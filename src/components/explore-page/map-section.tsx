import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/Inventory/property/use-geolocation";
import type { NearbyProperty } from "@/lib/types/inventory/property-types";

const DefaultIcon = L.Icon.Default.extend({
  options: {
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  },
});
L.Marker.prototype.options.icon = new DefaultIcon();

function MapBounds({ locations }: { locations: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
}

interface MapSectionProps {
  properties?: NearbyProperty[];
}

export default function MapSection({ properties = [] }: MapSectionProps) {
  const { location, getCurrentLocation, loading, error } = useGeolocation({
    autoFetch: true,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [isMounted, setIsMounted] = useState(false); // <-- important

  useEffect(() => {
    setIsMounted(true); // ensure client-only render
  }, []);

  useEffect(() => {
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  if (!isMounted) return null; // prevent SSR issues
  if (loading) return <div className="p-4">Loading your location...</div>;
  if (error) return <div className="p-4">{error}</div>;
  if (!location || !mapCenter)
    return (
      <div className="p-4">
        <Button onClick={getCurrentLocation}>Get My Location</Button>
      </div>
    );

  const markerPositions: [number, number][] = [
    mapCenter,
    ...properties.map((p) => [p.latitude, p.longitude] as [number, number]),
  ];

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "relative"
      } rounded-2xl shadow-lg`}
      style={{ height: isFullscreen ? "100vh" : "100%" }}
    >
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Property Locations</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      {/* Map container must have explicit height */}
      <div style={{ height: isFullscreen ? "100vh" : "500px" }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapBounds locations={markerPositions} />
          <Marker position={mapCenter}>
            <Popup>Your Location</Popup>
          </Marker>
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
            >
              <Popup>
                <strong>{property.name}</strong>
                <br />
                {property.address || property.city}
                <br />${property.minPrice} / night
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
