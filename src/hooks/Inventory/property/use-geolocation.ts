"use client";

import { useState, useEffect } from "react";
import * as propertyService from "@/lib/services/Inventory/property/property-service";
import type {
  UserLocation,
  GeocodingResult,
  NearbyProperty,
} from "@/lib/types/inventory/property-types";

interface UseGeolocationOptions {
  autoFetch?: boolean; // Automatically fetch location on mount
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    autoFetch = false,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
  } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // Check permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermissionStatus(result.state);
          result.onchange = () => {
            setPermissionStatus(result.state);
          };
        })
        .catch(() => {
          setPermissionStatus("unknown");
        });
    }
  }, []);

  // Auto-fetch location on mount if enabled
  useEffect(() => {
    if (autoFetch && permissionStatus === "granted") {
      getCurrentLocation();
    }
  }, [autoFetch, permissionStatus]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise<UserLocation>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };

            // Optionally reverse geocode to get address
            try {
              const addressData = await propertyService.reverseGeocode(
                coords.latitude,
                coords.longitude
              );

              const userLocation: UserLocation = {
                ...coords,
                city: addressData.city,
                address: addressData.formattedAddress,
              };

              setLocation(userLocation);
              setLoading(false);
              resolve(userLocation);
            } catch {
              // If reverse geocoding fails, still return coordinates
              const userLocation: UserLocation = coords;
              setLocation(userLocation);
              setLoading(false);
              resolve(userLocation);
            }
          } catch (err) {
            const errorMsg =
              err instanceof Error ? err.message : "Failed to get location";
            setError(errorMsg);
            setLoading(false);
            reject(new Error(errorMsg));
          }
        },
        (err) => {
          const errorMsg = `Geolocation error: ${err.message}`;
          setError(errorMsg);
          setLoading(false);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  return {
    location,
    loading,
    error,
    permissionStatus,
    getCurrentLocation,
    clearLocation,
    isSupported: !!navigator.geolocation,
  };
};

// Hook for searching nearby properties
export const useNearbyProperties = () => {
  const [properties, setProperties] = useState<NearbyProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = async (
    latitude: number,
    longitude: number,
    radius = 10,
    limit = 20
  ) => {
    setLoading(true);
    setError(null);

    try {
      const results = await propertyService.searchNearbyProperties({
        latitude,
        longitude,
        radius,
        limit,
      });
      setProperties(results);
      return results;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to search nearby properties";
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setProperties([]);
    setError(null);
  };

  return {
    properties,
    loading,
    error,
    searchNearby,
    clearResults,
  };
};

// Hook for geocoding addresses
export const useGeocoding = () => {
  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string) => {
    if (!address.trim()) {
      setError("Address is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const geocodeResult = await propertyService.geocodeAddress(address);
      setResult(geocodeResult);
      return geocodeResult;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to geocode address";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const geocodeResult = await propertyService.reverseGeocode(
        latitude,
        longitude
      );
      setResult(geocodeResult);
      return geocodeResult;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to reverse geocode";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    geocode,
    reverseGeocode,
    clearResult,
  };
};
