export interface BookingData {
  id: number;
  bookingNo: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  createdAt: string;
  items: Array<{
    room: {
      name: string;
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
      };
    };
    nights: number;
  }>;
}

export type FilterStatus =
  | "all"
  | "waiting_for_payment"
  | "waiting_for_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface FilterOption {
  value: FilterStatus;
  label: string;
  count: number;
}

