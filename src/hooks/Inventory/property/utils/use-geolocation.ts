"use client";

import * as propertyService from "@/lib/services/Inventory/property/property-service";
import type { UserLocation } from "@/lib/types/inventory/property-types";
import { useEffect, useState, useCallback } from "react";

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

  const getCurrentLocation = useCallback(async () => {
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
  }, [enableHighAccuracy, timeout, maximumAge]);

  // Auto-fetch location on mount if enabled
  useEffect(() => {
    if (autoFetch && permissionStatus === "granted") {
      getCurrentLocation();
    }
  }, [autoFetch, permissionStatus, getCurrentLocation]);

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
