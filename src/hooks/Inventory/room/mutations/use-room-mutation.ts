import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "@/lib/services/Inventory/room/room-service";
import type { CreateRoomPayload } from "@/lib/types/inventory/room-type";

export const useRoomMutation = (propertyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoom(propertyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", propertyId] });
    },
  });
};
