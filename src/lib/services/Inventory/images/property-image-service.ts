// property-image-api.ts
import api from "@/lib/api"; // Axios instance
import type { UploadedImageResult } from "@/lib/types/inventory/image-type";

/**
 * Upload new images for a property
 */
export async function uploadPropertyImages(
  propertyId: number,
  files: File[]
): Promise<UploadedImageResult[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { data } = await api.post(
    `/properties/${propertyId}/images`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.data;
}

/**
 * Update property images (e.g., replace or update metadata)
 */
export async function updatePropertyImages(
  propertyId: number,
  imageId: number,
  file?: File
): Promise<UploadedImageResult> {
  const formData = new FormData();
  if (file) formData.append("image", file);

  const { data } = await api.patch(
    `/properties/${propertyId}/images/${imageId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.data;
}

/**
 * Delete a single image by its database ID
 */
export async function deletePropertyImages(
  propertyId: number,
  imageId: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/images/${imageId}`);
}