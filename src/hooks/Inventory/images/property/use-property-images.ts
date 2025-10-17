"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";
import {
  uploadPropertyImages,
  updatePropertyImages,
  deletePropertyImages,
} from "@/lib/services/Inventory/images/property-image-service";
import { getPropertyDetails } from "@/lib/services/Inventory/property/property-service";

export const usePropertyImages = (propertyId: number) => {
  return useQuery<UploadedImageResult[], Error>({
    queryKey: ["propertyImages", propertyId],
    queryFn: async () => {
      const property = await getPropertyDetails(propertyId);
      return property.images as UploadedImageResult[];
    },
    enabled: !!propertyId,
  });
};

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      files,
    }: {
      propertyId: number;
      files: File[];
    }) => uploadPropertyImages(propertyId, files),
    onSuccess: (_, variables) => {
      toast.success("Images uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", variables.propertyId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to upload images: ${message}`);
    },
  });
};

// Update single image
export const useUpdatePropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      imageId,
      file,
    }: {
      propertyId: number;
      imageId: number;
      file?: File;
    }) => updatePropertyImages(propertyId, imageId, file),
    onSuccess: (_, variables) => {
      toast.success("Image updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", variables.propertyId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update image: ${message}`);
    },
  });
};

// Delete single image
export const useDeletePropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      imageId,
    }: {
      propertyId: number;
      imageId: number;
    }) => deletePropertyImages(propertyId, imageId),
    onSuccess: (_, variables) => {
      toast.success("Image deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["propertyImages", variables.propertyId],
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete image: ${message}`);
    },
  });
};
