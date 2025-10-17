import api from "@/lib/api";
import type {
  UploadedImageResult,
  ImageMetadata,
} from "@/lib/types/inventory/image-type";

export async function uploadRoomImages(
  propertyId: number,
  roomId: number,
  files: File[]
): Promise<UploadedImageResult[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { data } = await api.post(
    `/properties/${propertyId}/rooms/${roomId}/images`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.data;
}

export async function updateRoomImage(
  propertyId: number,
  roomId: number,
  imageId: number,
  payload: {
    file?: File;
    metadata?: Partial<ImageMetadata>;
  }
): Promise<UploadedImageResult> {
  const formData = new FormData();

  if (payload.file) formData.append("images", payload.file);

  if (payload.metadata) {
    if (payload.metadata.isPrimary !== undefined)
      formData.append("isPrimary", String(payload.metadata.isPrimary));
    if (payload.metadata.order !== undefined)
      formData.append("order", String(payload.metadata.order));
  }

  const { data } = await api.patch(
    `/properties/${propertyId}/rooms/${roomId}/images/${imageId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data.data;
}

export async function deleteRoomImage(
  propertyId: number,
  roomId: number,
  imageId: number
): Promise<void> {
  await api.delete(
    `/properties/${propertyId}/rooms/${roomId}/images/${imageId}`
  );
}

export async function deleteAllRoomImages(
  propertyId: number,
  roomId: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/rooms/${roomId}/images`);
}
