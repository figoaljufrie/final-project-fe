"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoomDetail } from "@/lib/services/Inventory/room/room-service";
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";

interface RoomImageObject {
  id?: number;
  url: string;
  isPrimary?: boolean;
  order?: number;
}

export const useRoomGallery = ({
  roomId,
  propertyId,
}: {
  roomId: number;
  propertyId: number;
}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roomImages", propertyId, roomId],
    queryFn: async () => {
      const room = await getRoomDetail(propertyId, roomId);
      
      // Convert images array to UploadedImageResult format
      if (Array.isArray(room.images)) {
        return room.images.map(
          (img: string | RoomImageObject, index: number): UploadedImageResult => {
            if (typeof img === "string") {
              return {
                id: index + 1,
                url: img,
                isPrimary: index === 0,
                order: index,
              };
            }
            return {
              id: img.id ?? index + 1,
              url: img.url,
              isPrimary: img.isPrimary ?? index === 0,
              order: img.order ?? index,
            };
          }
        );
      }
      return [];
    },
    enabled: !!propertyId && !!roomId,
  });

  return {
    images: data ?? [],
    isLoading,
    refetch,
  };
};