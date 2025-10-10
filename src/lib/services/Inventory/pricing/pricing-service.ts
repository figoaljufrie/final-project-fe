import api from "@/lib/api";
import type {
  PeakSeason,
  CreatePeakSeason,
  UpdatePeakSeason,
  RoomAvailability,
  SetAvailabilityBody,
} from "@/lib/types/inventory/pricing-type";

// ✅ AVAILABILITY
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

//peak-season:
export async function createPeakSeason(
  payload: CreatePeakSeason
): Promise<PeakSeason> {
  const { data } = await api.post(`/tenant/peakseasons`, payload);
  return data.data as PeakSeason;
}


export async function getTenantPeakSeasons(): Promise<PeakSeason[]> {
  const { data } = await api.get(`/tenant/peakseasons`);
  return data.data as PeakSeason[];
}


export async function updatePeakSeason(
  id: number,
  payload: UpdatePeakSeason
): Promise<PeakSeason> {
  const { data } = await api.patch(`/tenant/peakseasons/${id}`, payload);
  return data.data as PeakSeason;
}


export async function deletePeakSeason(id: number): Promise<void> {
  await api.delete(`/tenant/peakseasons/${id}`);
}

export async function getPeakSeasonsForPropertyRange(
  propertyId: number,
  start: string,
  end: string
): Promise<PeakSeason[]> {
  const { data } = await api.get(`/properties/${propertyId}/peakseasons`, {
    params: { start, end },
  });
  return data.data as PeakSeason[];
}