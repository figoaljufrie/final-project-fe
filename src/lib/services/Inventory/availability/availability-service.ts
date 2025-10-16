import api from "@/lib/api";
import type {
  RoomAvailability,
  SetAvailabilityBody,
} from "@/lib/types/inventory/availability-types";

export async function setRoomAvailability(
  propertyId: number,
  roomId: number,
  payload: SetAvailabilityBody
): Promise<RoomAvailability> {
  const { data } = await api.post(
    `/properties/${propertyId}/rooms/${roomId}/availability`,
    payload
  );
  return data.data as RoomAvailability;
}

export async function getRoomAvailabilityRange(
  propertyId: number,
  roomId: number,
  from: string,
  to: string
): Promise<RoomAvailability[]> {
  const { data } = await api.get(
    `/properties/${propertyId}/rooms/${roomId}/availability`,
    { params: { from, to } }
  );
  return data.data as RoomAvailability[];
}

export async function getRoomAvailabilityByDate(
  propertyId: number,
  roomId: number,
  date: string
): Promise<RoomAvailability | null> {
  const { data } = await api.get(
    `/properties/${propertyId}/rooms/${roomId}/availability/day`,
    { params: { date } }
  );
  return data.data as RoomAvailability | null;
}