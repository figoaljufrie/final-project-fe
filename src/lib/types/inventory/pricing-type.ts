import { PriceChangeType } from "../enums/enums-type";

export interface PeakSeason {
  id: number;
  tenantId: number;
  name: string;
  startDate: string;
  endDate: string;
  changeType: PriceChangeType;
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePeakSeasonPayload {
  name: string;
  startDate: string;
  endDate: string;
  changeType: PriceChangeType;
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds?: number[];
}

export interface UpdatePeakSeasonPayload
  extends Partial<CreatePeakSeasonPayload> {}

export interface RoomAvailability {
  id: number;
  roomId: number;
  date: string;
  isAvailable: boolean;
  customPrice: number | null;
  priceModifier: number | null;
  reason: string | null;
  bookedUnits: number;
}

export interface SetAvailabilityPayload {
  date: string;
  isAvailable?: boolean;
  customPrice?: number;
  priceModifier?: number;
  reason?: string;
}

export interface DailyCalculatedPrice {
  date: string;
  roomBasePrice: number;
  finalPrice: number;
  isAvailable: boolean;
  activePeakSeasons: Pick<PeakSeason, "name" | "changeType" | "changeValue">[];
  reason: string | null;
}
