import { useQuery } from "@tanstack/react-query";
import { getTenantPeakSeasons } from "@/lib/services/Inventory/pricing/pricing-service";
import type { PeakSeason } from "@/lib/types/inventory/pricing-type";

export const useTenantPeakSeasons = () => {
  return useQuery<PeakSeason[]>({
    queryKey: ["tenant-peak-seasons"],
    queryFn: async () => {
      return await getTenantPeakSeasons();
    },
  });
};
