import api from "@/lib/api";
import type {
  CreateRoomPayload,
  RoomDetail,
  RoomImagePayload,
  RoomListItem,
  UpdateRoomPayload,
} from "@/lib/types/inventory/room-type";

function forFormData(
  payload: CreateRoomPayload | UpdateRoomPayload,
  images?: RoomImagePayload[]
): FormData {
  const formData = new FormData();

  if (payload.name) formData.append("name", payload.name);
  if (payload.capacity !== undefined)
    formData.append("capacity", String(payload.capacity));
  if (payload.basePrice !== undefined)
    formData.append("basePrice", String(payload.basePrice));
  if (payload.description) formData.append("description", payload.description);
  if (payload.totalUnits !== undefined)
    formData.append("totalUnits", String(payload.totalUnits));

  if (images && images.length > 0) {
    const meta = images.map((img) => ({
      isPrimary: img.isPrimary,
      order: img.order,
      altText: img.altText,
    }));

    // ✅ FIXED: renamed for consistency with backend
    formData.append("imageMeta", JSON.stringify(meta));

    images.forEach((img) => {
      formData.append("images", img.file);
    });
  }

  return formData;
}

export async function createRoom(
  propertyId: number,
  payload: CreateRoomPayload
): Promise<RoomDetail> {
  const formData = forFormData(payload, payload.images);
  const { data } = await api.post(`/properties/${propertyId}/rooms`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export const listsRoomsByProperty = async (
  propertyId: number
): Promise<RoomListItem[]> => {
  const res = await api.get(`/properties/${propertyId}/rooms`);
  const data = res.data.data as RoomDetail[];

  return data.map((room) => ({
    id: room.id,
    propertyId: room.propertyId,
    name: room.name,
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

export async function updateRoom(
  propertyId: number,
  roomId: number,
  payload: UpdateRoomPayload,
  images?: RoomImagePayload[]
): Promise<RoomDetail> {
  const formData = forFormData(payload, images);
  const { data } = await api.patch(
    `/properties/${propertyId}/rooms/${roomId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data.data;
}

export async function deleteRoom(
  propertyId: number,
  roomId: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/rooms/${roomId}`);
}
