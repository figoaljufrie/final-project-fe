import * as propertyService from "@/lib/services/Inventory/property/property-service";
import type { GeocodingResult } from "@/lib/types/inventory/property-types";
import { useState } from "react";

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
