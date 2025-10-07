import api from "@/lib/api";
import type {
  PeakSeason,
  CreatePeakSeasonPayload,
  UpdatePeakSeasonPayload,
  RoomAvailability,
  SetAvailabilityPayload,
} from "@/lib/types/inventory/pricing-type";

export async function setRoomAvailability(
  propertyId: number,
  roomId: number,
  payload: SetAvailabilityPayload
): Promise<RoomAvailability> {
  const { data } = await api.post(
    `/properties/${propertyId}/rooms/${roomId}/availability`,
    payload
  );

  return data.data;
}

export async function getRoomAvailabilityRange(
  propertyId: number,
  roomId: number,
  from: string,
  to: string
): Promise<RoomAvailability[]> {
  const { data } = await api.get(
    `properties/${propertyId}/rooms/${roomId}/availability`,
    {
      params: { from, to },
    }
  );
  return data.data;
}

export async function getRoomAvailabilityByDate(
  propertyId: number,
  roomId: number,
  date: string
): Promise<RoomAvailability | null> {
  const { data } = await api.get(
    `/properties/${propertyId}/rooms/${roomId}/availability/day`,
    {
      params: { date },
    }
  );
  return data.data;
}

//peal seaosn:

export async function createPeakSeason(
  payload: CreatePeakSeasonPayload
): Promise<PeakSeason> {
  const { data } = await api.post("tenant/peakseasons", payload);
  return data.data;
}

export async function updatePeakSeason(
  id: number,
  payload: UpdatePeakSeasonPayload
): Promise<PeakSeason> {
  const { data } = await api.patch(`tenant/peakseasons/${id}`, payload);

  return data.data;
}

export async function deletePeakSeason(id: number): Promise<void> {
  const { data } = await api.delete(`/tenant/peakseasons/${id}`);
  return data.data;
}
