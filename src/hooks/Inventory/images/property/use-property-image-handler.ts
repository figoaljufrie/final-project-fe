import {
  useUploadPropertyImages,
  useUpdatePropertyImages,
  useDeletePropertyImages,
} from "@/hooks/Inventory/images/property/use-property-images";
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";
import type { LocalImage } from "@/components/dashboard/property/images/property-image-uploader";

export function usePropertyImageHandlers({
  propertyId,
  setLocalImages,
}: {
  propertyId: number;
  setLocalImages: React.Dispatch<React.SetStateAction<LocalImage[]>>;
}) {
  const uploadMutation = useUploadPropertyImages();
  const updateMutation = useUpdatePropertyImages();
  const deleteMutation = useDeletePropertyImages();

  // Upload logic
  const uploadImages = async (files: File[]): Promise<UploadedImageResult[] | null> => {
    try {
      const response = await uploadMutation.mutateAsync({ propertyId, files });
      return response;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  // Update (set primary)
  const updateImages = async (imageId: number) => {
    try {
      await updateMutation.mutateAsync({ propertyId, imageId });
      setLocalImages((prev) =>
        prev
          .map((img) => ({ ...img, isPrimary: img.id === imageId }))
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      );
    } catch (err) {
      console.error("Failed to set primary", err);
    }
  };

  // Delete
  const deleteImage = async (imageId: number) => {
    try {
      await deleteMutation.mutateAsync({ propertyId, imageId });
      setLocalImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  return {
    uploadImages,
    updateImages,
    deleteImage,
    isUploading: uploadMutation.isPending,
  };
}