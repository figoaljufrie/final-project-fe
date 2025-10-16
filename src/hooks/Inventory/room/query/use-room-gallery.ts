import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoomDetail,
  updateRoomImages,
} from "@/lib/services/Inventory/room/room-service";
import type {
  RoomDetail,
  RoomImagePayload,
} from "@/lib/types/inventory/room-type";

interface UseRoomGalleryParams {
  roomId: number;
  propertyId: number;
}

export function useRoomGallery({ propertyId, roomId }: UseRoomGalleryParams) {
  const queryClient = useQueryClient();

  // Fetch room detail
  const { data: roomDetail, isLoading } = useQuery<RoomDetail, Error>({
    queryKey: ["room", propertyId, roomId],
    queryFn: () => getRoomDetail(propertyId, roomId),
    enabled: !!propertyId && !!roomId,
  });

  const images: string[] = roomDetail?.images?.map((img) => img.url) ?? [];

  // ✅ Use the new image endpoint
  const addImageMutation = useMutation<RoomDetail, Error, File>({
    mutationFn: async (file: File) => {
      const payload: RoomImagePayload[] = [
        { file, altText: "Room image", isPrimary: false, order: images.length },
      ];
      return updateRoomImages(propertyId, roomId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", propertyId, roomId] });
    },
  });

  const addImage = async (file: File) => {
    await addImageMutation.mutateAsync(file);
  };

  return {
    images,
    isLoading,
    addImage,
  };
}
