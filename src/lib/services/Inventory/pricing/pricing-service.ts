import api from "@/lib/api";
import type {
  PeakSeason,
  CreatePeakSeason,
  UpdatePeakSeason,
  RoomAvailability,
  SetAvailabilityBody,
} from "@/lib/types/inventory/pricing-type";

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

export async function createPeakSeason(
  propertyId: number,
  payload: CreatePeakSeason
): Promise<PeakSeason> {
  const { data } = await api.post(
    `/properties/${propertyId}/peakseasons`,
    payload
  );
  return data.data as PeakSeason;
}

export async function updatePeakSeason(
  propertyId: number,
  id: number,
  payload: UpdatePeakSeason
): Promise<PeakSeason> {
  const { data } = await api.patch(
    `/properties/${propertyId}/peakseasons/${id}`,
    payload
  );
  return data.data as PeakSeason;
}

export async function deletePeakSeason(
  propertyId: number,
  id: number
): Promise<void> {
  await api.delete(`/properties/${propertyId}/peakseasons/${id}`);
}
