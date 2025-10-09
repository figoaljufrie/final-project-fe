import { useQuery } from "@tanstack/react-query";
import { getPropertyDetails } from "@/lib/services/Inventory/property/property-service";
import type { PropertyDetail } from "@/lib/types/inventory/property-types";

export const usePropertyDetail = (propertyId: number) => {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: async (): Promise<PropertyDetail> => {
      return await getPropertyDetails(propertyId);
    },
    enabled: !!propertyId,
  });
};