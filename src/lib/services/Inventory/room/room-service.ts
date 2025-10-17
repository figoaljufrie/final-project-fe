import api from "@/lib/api";
import type {
  CreateRoomPayload,
  RoomDetail,
  RoomImagePayload,
  RoomListItem,
  UpdateRoomPayload,
} from "@/lib/types/inventory/room-type";

import { uploadRoomImages } from "../images/room-image-service";

export async function createRoom(
  propertyId: number,
  payload: CreateRoomPayload
): Promise<RoomDetail> {
  const images = payload.images;
  const roomPayload = { ...payload, images: undefined };

  const { data } = await api.post(
    `/properties/${propertyId}/rooms`,
    roomPayload
  );
  const roomId = data.data.id as number;

  // Upload images if any
  if (images && images.length > 0) {
    const files = images.map((img) => img.file);
    await uploadRoomImages(propertyId, roomId, files);
  }

  // Refetch full room detail
  const { data: full } = await api.get(
    `/properties/${propertyId}/rooms/${roomId}`
  );
  return full.data;
}

/**
 * List rooms for a property
 */
export const listsRoomsByProperty = async (
  propertyId: number
): Promise<RoomListItem[]> => {
  const res = await api.get(`/properties/${propertyId}/rooms`);
  const data = res.data.data as RoomDetail[];

  return data.map((room) => ({
    id: room.id,
    propertyId: room.propertyId,
    name: room.name,
    description: room.description || null,
    capacity: room.capacity,
    basePrice: room.basePrice,
    totalUnits: room.totalUnits,
    image:
      room.images && room.images.length > 0
        ? room.images.find((img) => img.isPrimary)?.url ||
          room.images[0].url ||
          null
        : null,
  }));
};

export async function getRoomDetail(
  propertyId: number,
  roomId: number
): Promise<RoomDetail> {
  const { data } = await api.get(`/properties/${propertyId}/rooms/${roomId}`);
  return data.data;
}

export async function updateRoom(
  propertyId: number,
  roomId: number,
  payload: UpdateRoomPayload,
  images?: RoomImagePayload[]
): Promise<RoomDetail> {
  const roomPayload: UpdateRoomPayload = { ...payload };

  await api.patch(`/properties/${propertyId}/rooms/${roomId}`, roomPayload);

  if (images && images.length > 0) {
    const files = images.map((img) => img.file);
    await uploadRoomImages(propertyId, roomId, files);
  }

  const { data: full } = await api.get(
    `/properties/${propertyId}/rooms/${roomId}`
  );
  return full.data;
}

export async function deleteRoom(
  propertyId: number,
  roomId: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/rooms/${roomId}`);
}
