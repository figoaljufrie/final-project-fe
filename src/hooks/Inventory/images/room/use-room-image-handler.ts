"use client";

import {
  useUploadRoomImages,
  useUpdateRoomImage,
  useDeleteRoomImage,
} from "@/hooks/Inventory/images/room/use-room-image";
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";

export type LocalImage = {
  id: number;
  url: string;
  isPrimary?: boolean;
  isNew?: boolean;
};

export function useRoomImageHandlers({
  propertyId,
  roomId,
  setLocalImages,
}: {
  propertyId: number;
  roomId: number;
  setLocalImages: React.Dispatch<React.SetStateAction<LocalImage[]>>;
}) {
  const uploadMutation = useUploadRoomImages();
  const updateMutation = useUpdateRoomImage();
  const deleteMutation = useDeleteRoomImage();

  const uploadImages = async (
    files: File[]
  ): Promise<UploadedImageResult[] | null> => {
    try {
      const response = await uploadMutation.mutateAsync({
        propertyId,
        roomId,
        files,
      });
      return response;
    } catch (err) {
      console.error("❌ Upload failed:", err);
      return null;
    }
  };

  const updateImages = async (imageId: number) => {
    try {
      await updateMutation.mutateAsync({ 
        propertyId, 
        roomId, 
        imageId,
        metadata: { isPrimary: true }
      });
      setLocalImages((prev) =>
        prev
          .map((img) => ({ ...img, isPrimary: img.id === imageId }))
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      );
    } catch (err) {
      console.error("❌ Failed to set primary image:", err);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await deleteMutation.mutateAsync({ propertyId, roomId, imageId });
      setLocalImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("❌ Failed to delete image:", err);
    }
  };

  return {
    uploadImages,
    updateImages,
    deleteImage,
    isUploading: uploadMutation.isPending,
  };
}