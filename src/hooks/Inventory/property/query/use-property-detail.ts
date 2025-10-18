import { useQuery } from "@tanstack/react-query";
import { getPropertyDetails } from "@/lib/services/Inventory/property/property-service";
import type { PropertyDetail } from "@/lib/types/inventory/property-types";

export const usePropertyDetail = (
  propertyId: number, 
  checkInDate?: string, 
  checkOutDate?: string
) => {
  return useQuery({
    queryKey: ["property", propertyId, checkInDate, checkOutDate],
    queryFn: async (): Promise<PropertyDetail> => {
      return await getPropertyDetails(propertyId, checkInDate, checkOutDate);
    },
    enabled: !!propertyId,
    staleTime: 0,
  });
};