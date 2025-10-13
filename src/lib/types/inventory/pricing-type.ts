import { PriceChangeType } from "../enums/enums-type";

export interface SetAvailabilityBody {
  date: string;
  isAvailable?: boolean;
  customPrice?: number;
  priceModifier?: number;
  reason?: string;
}

export interface SetAvailability {
  roomId: number;
  date: string;
  isAvailable?: boolean;
  customPrice?: number;
  priceModifier?: number;
  reason?: string;
}

export interface AvailabilitySeedData {
  roomId: number;
  date: string; // ISO string
  isAvailable: boolean;
  bookedUnits: number;
  customPrice: number | null;
}

export interface RoomForPricing {
  id: number;
  propertyId: number;
  basePrice: number;
}

export interface PriceCalculationResult {
  priceModifier: number | null;
  customPrice: number | null;
  reason: string | null;
}

export interface CreatePeakSeason {
  name: string;
  startDate: string;
  endDate: string;
  changeType: PriceChangeType;
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds?: number[];
}

// Explicitly type as Partial<CreatePeakSeason> to avoid empty interface warning
export type UpdatePeakSeason = Partial<CreatePeakSeason>;

export interface PeakSeasonCreate {
  tenantId: number;
  name: string;
  startDate: string;
  endDate: string;
  changeType: PriceChangeType;
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds: number[];
}

export interface RoomAvailability {
  id: number;
  roomId: number;
  date: string;
  isAvailable: boolean;
  bookedUnits: number;
  customPrice: number | null;
  priceModifier: number | null;
  reason: string | null;
  createdAt?: string;
  updatedAt?: string;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface CalculatedPrice {
  date: string;
  roomBasePrice: number;
  finalPrice: number;
  isAvailable: boolean;
  activePeakSeasons: Pick<PeakSeason, "name" | "changeType" | "changeValue">[];
  reason: string | null;
}
