"use client";

import {
  deleteAllRoomImages,
  deleteRoomImage,
  updateRoomImage,
  uploadRoomImages,
} from "@/lib/services/Inventory/images/room-image-service";
import { getRoomDetail } from "@/lib/services/Inventory/room/room-service";
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRoomImages = (propertyId: number, roomId: number) => {
  return useQuery<UploadedImageResult[], Error>({
    queryKey: ["roomImages", propertyId, roomId],
    queryFn: async () => {
      const room = await getRoomDetail(propertyId, roomId);
      return room.images as UploadedImageResult[];
    },
    enabled: !!propertyId && !!roomId,
  });
};

export const useUploadRoomImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      files,
    }: {
      propertyId: number;
      roomId: number;
      files: File[];
    }) => uploadRoomImages(propertyId, roomId, files),
    onSuccess: (_, variables) => {
      toast.success("Room images uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["roomImages", variables.propertyId, variables.roomId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to upload room images: ${message}`);
    },
  });
};

export const useUpdateRoomImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      imageId,
      file,
      metadata,
    }: {
      propertyId: number;
      roomId: number;
      imageId: number;
      file?: File;
      metadata?: Partial<{ isPrimary: boolean; order: number }>;
    }) => updateRoomImage(propertyId, roomId, imageId, { file, metadata }),
    onSuccess: (_, variables) => {
      toast.success("Room image updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["roomImages", variables.propertyId, variables.roomId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update room image: ${message}`);
    },
  });
};

export const useDeleteRoomImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
      imageId,
    }: {
      propertyId: number;
      roomId: number;
      imageId: number;
    }) => deleteRoomImage(propertyId, roomId, imageId),
    onSuccess: (_, variables) => {
      toast.success("Room image deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["roomImages", variables.propertyId, variables.roomId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete room image: ${message}`);
    },
  });
};

export const useDeleteAllRoomImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      roomId,
    }: {
      propertyId: number;
      roomId: number;
    }) => deleteAllRoomImages(propertyId, roomId),
    onSuccess: (_, variables) => {
      toast.success("All room images deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["roomImages", variables.propertyId, variables.roomId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete all room images: ${message}`);
    },
  });
};
