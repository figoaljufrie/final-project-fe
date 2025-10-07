import { useQuery } from "@tanstack/react-query";
import { listsRoomsByProperty } from "@/lib/services/Inventory/room/room-service";
import type { RoomListItem } from "@/lib/types/inventory/room-type";

export const useRooms = (propertyId: number | undefined) => {
  return useQuery<RoomListItem[]>({
    queryKey: ["rooms", propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("Invalid Property ID");
      return await listsRoomsByProperty(propertyId);
    },
    enabled: !!propertyId,
  });
};
