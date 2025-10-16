import * as peakSeasonService from "@/lib/services/Inventory/peak-season/peak-season-service";
import type {
  PeakSeason,
  UpdatePeakSeason,
} from "@/lib/types/inventory/peak-season-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ----------------- Queries -----------------
export function useTenantPeakSeasons() {
  return useQuery<PeakSeason[], Error>({
    queryKey: ["tenantPeakSeasons"],
    queryFn: peakSeasonService.getTenantPeakSeasons,
  });
}

export function usePeakSeasonsForProperty(
  propertyId: number,
  start: string,
  end: string
) {
  return useQuery<PeakSeason[], Error>({
    queryKey: ["propertyPeakSeasons", propertyId, start, end],
    queryFn: () =>
      peakSeasonService.getPeakSeasonsForPropertyRange(propertyId, start, end),
  });
}

// ----------------- Mutations -----------------
export function useCreatePeakSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: peakSeasonService.createPeakSeason,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tenantPeakSeasons"] }),
  });
}

export function useUpdatePeakSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePeakSeason }) =>
      peakSeasonService.updatePeakSeason(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tenantPeakSeasons"] }),
  });
}

export function useDeletePeakSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: peakSeasonService.deletePeakSeason,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tenantPeakSeasons"] }),
  });
}
