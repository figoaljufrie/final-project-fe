import {
  createPeakSeason,
  deletePeakSeason,
  updatePeakSeason,
} from "@/lib/services/Inventory/pricing/pricing-service";
import type {
  CreatePeakSeason,
  UpdatePeakSeason
} from "@/lib/types/inventory/pricing-type";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

export const usePeakMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: CreatePeakSeason) => createPeakSeason(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-peak-seasons"],
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePeakSeason }) =>
      updatePeakSeason(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-peak-seasons"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePeakSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-peak-seasons"] });
    },
  });
  return { create, update, remove };
};
