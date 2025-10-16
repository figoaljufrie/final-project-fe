import { useState, useEffect } from "react";
import { listsRoomsByProperty } from "@/lib/services/Inventory/room/room-service";

export function useRoomData({
  propertyId,
  roomId,
  isOpen,
}: {
  propertyId: number;
  roomId: number;
  isOpen: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    capacity: 1,
    basePrice: 0,
    description: "",
    totalUnits: 1,
  });

  const [existingImages, setExistingImages] = useState<
    { id?: number; url: string; altText?: string; isPrimary?: boolean }[]
  >([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId || !propertyId || !isOpen) return;

    const fetchRoom = async () => {
      setLoading(true);
      try {
        const rooms = await listsRoomsByProperty(propertyId);
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        setForm({
          name: room.name,
          capacity: room.capacity,
          basePrice: room.basePrice,
          description: room.description || "",
          totalUnits: room.totalUnits,
        });

        const imgs =
          Array.isArray(room.image) && room.image.length > 0
            ? room.image.map(
                (
                  img:
                    | string
                    | { url: string; altText?: string; isPrimary?: boolean }
                ) => (typeof img === "string" ? { url: img } : img)
              )
            : [];
        setExistingImages(imgs);
      } catch (err) {
        console.error("Failed to fetch room details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, propertyId, isOpen]);

  return {
    form,
    setForm,
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
    isSubmitting,
    setIsSubmitting,
    loading,
  };
}
