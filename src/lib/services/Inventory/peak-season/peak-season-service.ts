import api from "@/lib/api";
import type { CreatePeakSeason, UpdatePeakSeason, PeakSeason } from "@/lib/types/inventory/peak-season-type"

export async function createPeakSeason(payload: CreatePeakSeason): Promise<PeakSeason> {
  const { data } = await api.post("/tenant/peakseasons", payload);
  return data.data as PeakSeason;
}

export async function getTenantPeakSeasons(): Promise<PeakSeason[]> {
  const { data } = await api.get("/tenant/peakseasons");
  return data.data as PeakSeason[];
}

export async function updatePeakSeason(id: number, payload: UpdatePeakSeason): Promise<PeakSeason> {
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