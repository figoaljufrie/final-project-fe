// Room availability for a single date
export interface RoomAvailability {
  id: number;
  roomId: number;
  date: string; // ISO string
  isAvailable: boolean;
  bookedUnits: number;
  totalUnits: number; // matches backend
  customPrice: number | null;
  priceModifier: number | null;
  reason: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Payload to update availability
export interface SetAvailabilityBody {
  date: string; // ISO string
  isAvailable?: boolean;
  customPrice?: number;
  priceModifier?: number;
  reason?: string;
  bookedUnits?: number;
}

// Payload for API call including roomId
export interface SetAvailability {
  roomId: number;
  date: string;
  isAvailable?: boolean;
  customPrice?: number;
  priceModifier?: number;
  reason?: string;
  bookedUnits?: number;
}

// Room data for pricing calculations
export interface RoomForPricing {
  id: number;
  propertyId: number;
  basePrice: number;
  totalUnits: number;
}

// Result of price calculation
export interface CalculatedPrice {
  date: string;
  roomBasePrice: number;
  finalPrice: number;
  isAvailable: boolean;
  reason: string | null;
}
