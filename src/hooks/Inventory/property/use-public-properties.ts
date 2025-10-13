import { useQuery } from "@tanstack/react-query";
import { getPublicProperties } from "@/lib/services/Inventory/property/property-service";
import { PropertySearchQuery, PropertySearchResponse } from "@/lib/types/inventory/property-types";

export function usePublicProperties(filters: PropertySearchQuery = {}) {
  return useQuery<PropertySearchResponse>({
    queryKey: ["publicProperties", filters],
    queryFn: () => getPublicProperties(filters),
  });
}
