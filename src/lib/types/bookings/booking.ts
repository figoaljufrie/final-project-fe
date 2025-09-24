export type BookingStatus = 
  | 'waiting_for_payment'
  | 'waiting_for_confirmation'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'completed'
  | 'rejected';

export type PaymentMethod = 'manual_transfer' | 'payment_gateway';

export interface Guest {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface Property {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  basePrice: number;
  description?: string;
}

export interface BookingItem {
  id: number;
  roomId: number;
  unitCount: number;
  unitPrice: number;
  nights: number;
  subTotal: number;
  room: Room;
}

export interface Booking {
  id: number;
  bookingNo: string;
  userId: number;
  status: BookingStatus;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paymentProofUrl?: string;
  paymentDeadline?: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  notes?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user: Guest;
  property: Property;
  items: BookingItem[];
}
