import api from '../../api';
import { Booking, CreateBookingRequest } from '../../types/bookings/booking';

export interface CreateBookingPayload {
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  unitCount: number;
  paymentMethod: 'manual_transfer' | 'payment_gateway';
  notes?: string;
}

export interface MidtransPaymentResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PaymentService {
  // Create new booking
  static async createBooking(bookingData: CreateBookingPayload) {
    const response = await api.post('/bookings', bookingData);
    return response.data.data || response.data;
  }

  // Create Midtrans payment
  static async createMidtransPayment(bookingId: number) {
    const response = await api.post(`/bookings/${bookingId}/midtrans-payment`);
    return response.data.data || response.data;
  }

  // Upload payment proof
  static async uploadPaymentProof(bookingId: number, formData: FormData) {
    const response = await api.post(`/bookings/${bookingId}/upload-payment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data || response.data;
  }

  // Get booking details
  static async getBookingDetails(bookingId: number) {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data.data || response.data;
  }

  // Get user bookings
  static async getUserBookings(params?: {
    status?: string;
    bookingNo?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/bookings', { params });
    return response.data.data || response.data;
  }

  // Cancel booking
  static async cancelBooking(bookingId: number, reason: string) {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { cancelReason: reason });
    return response.data.data || response.data;
  }

  // Check payment status
  static async checkPaymentStatus(orderId: string) {
    const response = await api.get(`/payment/payment-status/${orderId}`);
    return response.data.data || response.data;
  }
}
