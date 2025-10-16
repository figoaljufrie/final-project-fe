import { PriceChangeType } from "../enums/enums-type";


export interface CreatePeakSeason {
  name: string;
  startDate: string; 
  endDate: string;   
  changeType: PriceChangeType;
  changeValue: number;
  applyToAllProperties: boolean;
  propertyIds?: number[];
}

export type UpdatePeakSeason = Partial<CreatePeakSeason>;

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