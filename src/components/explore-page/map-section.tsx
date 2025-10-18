import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/Inventory/property/utils/use-geolocation";
import type { NearbyProperty } from "@/lib/types/inventory/property-types";
import { MapPin, Maximize2, Minimize2, Navigation } from "lucide-react";

const DefaultIcon = L.Icon.Default.extend({
  options: {
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  },
});
L.Marker.prototype.options.icon = new DefaultIcon();

// Custom property marker icon
const createPropertyIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
        border: 2px solid white;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        $${price}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function MapBounds({ locations }: { locations: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      if (locations.length === 1) {
        map.setView(locations[0], 13);
      } else {
        const bounds = L.latLngBounds(locations);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set map center based on user location or properties
  useEffect(() => {
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    } else if (properties.length > 0 && properties[0].latitude && properties[0].longitude) {
      // Center on first property if no user location
      setMapCenter([properties[0].latitude, properties[0].longitude]);
    }
  }, [location, properties]);

  if (!isMounted) return null;

  // Show loading state
  if (loading) {
    return (
      <div className="h-[500px] md:h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show button to get location if not available
  if (!mapCenter && !error) {
    return (
      <div className="h-[500px] md:h-[600px] bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-200/50 shadow-xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Enable Location</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Allow location access to see properties near you on the map
          </p>
          <Button 
            onClick={getCurrentLocation}
            className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get My Location
          </Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-[500px] md:h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={getCurrentLocation} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!mapCenter) return null;

  // Prepare marker positions
  const markerPositions: [number, number][] = [
    ...(location ? [[location.latitude, location.longitude] as [number, number]] : []),
    ...properties.map((p) => [p.latitude, p.longitude] as [number, number]),
  ];

  const propertyCount = properties.length;

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-[9999]" : "relative"
      } rounded-2xl shadow-xl transition-all duration-300`}
      style={{ height: isFullscreen ? "100vh" : "500px" }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-200/50 rounded-t-2xl">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Property Locations</h3>
              {propertyCount > 0 && (
                <p className="text-sm text-gray-600">
                  Showing {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 mr-2" />
                Exit
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="rounded-2xl overflow-hidden"
        style={{ height: isFullscreen ? "100vh" : "500px" }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapBounds locations={markerPositions} />
          
          {/* User Location Marker */}
          {location && (
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>
                <div className="text-center font-semibold">
                  📍 Your Location
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Property Markers */}
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPropertyIcon(property.minPrice!)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="font-bold text-gray-900 mb-1">{property.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.address || property.city}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-rose-600">
                      ${property.minPrice}
                    </span>
                    <span className="text-xs text-gray-500">per night</span>
                  </div>
                  <button
                    onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Empty State Overlay */}
      {propertyCount === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[999] pointer-events-none rounded-2xl">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No properties to display</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search filters</p>
          </div>
        </div>
      )}
    </div>
  );
}