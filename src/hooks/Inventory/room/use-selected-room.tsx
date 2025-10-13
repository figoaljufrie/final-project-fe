// /hooks/Inventory/property/use-rooms.ts
import { useState, useEffect } from "react";
import { listsRoomsByProperty } from "@/lib/services/Inventory/room/room-service";
import type { RoomListItem } from "@/lib/types/inventory/room-type";

export const useRoomsByProperty = (propertyId: number) => {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    setLoading(true);
    listsRoomsByProperty(propertyId)
      .then((res) => {
        setRooms(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load rooms");
        setLoading(false);
      });
  }, [propertyId]);

  return { rooms, loading, error };
};
