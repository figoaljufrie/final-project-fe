import * as propertyService from "@/lib/services/Inventory/property/property-service";
import type { NearbyProperty } from "@/lib/types/inventory/property-types";
import { useState } from "react";

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
