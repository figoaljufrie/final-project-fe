import api from "@/lib/api";
import type {
  CreateRoomPayload,
  RoomDetail,
  RoomImagePayload,
  RoomListItem,
  UpdateRoomPayload
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
    const imagesMetaData = images.map((img) => ({
      isPrimary: img.isPrimary,
      order: img.order,
      altText: img.altText,
    }));
    formData.append("images", JSON.stringify(imagesMetaData));

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
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

export async function listsRoomsByProperty(
  propertyId: number
): Promise<RoomListItem[]> {
  const { data } = await api.get(`/properties/${propertyId}/rooms`);

  return data.data;
}

export async function updateRoom(
  propertyId: number,
  roomId: number,
  payload: UpdateRoomPayload
): Promise<RoomDetail> {
  const { data } = await api.patch(
    `properties/${propertyId}/rooms/${roomId}`,
    payload
  );
  return data.data;
}

export async function deleteRoom(
  propertyId: number,
  roomId: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/rooms/${roomId}`);
}
