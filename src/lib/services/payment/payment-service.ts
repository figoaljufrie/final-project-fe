import api from "../../api";
import { Booking } from "../../types/bookings/booking";

export interface CreateBookingPayload {
  roomId: number;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  unitCount: number;
  paymentMethod: "manual_transfer" | "payment_gateway";
  notes?: string;
}

export interface MidtransPaymentResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
}

export interface PaymentStatusResponse {
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  settlement_time?: string;
  fraud_status: string;
  status_message: string;
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
    const response = await api.post("/bookings", bookingData);
    return response.data.data || response.data;
  }

  // Create Midtrans payment
  static async createMidtransPayment(bookingId: number) {
    const response = await api.post(`/bookings/${bookingId}/midtrans-payment`);
    return response.data.data || response.data;
  }

  // Create payment gateway payment (direct to Midtrans)
  static async createPaymentGatewayPayment(bookingData: {
    bookingId: number;
    bookingNo: string;
    totalAmount: number;
    userEmail: string;
    userName: string;
  }) {
    const response = await api.post("/payment/create-payment", bookingData);
    return response.data.data || response.data;
  }

  // Upload payment proof
  static async uploadPaymentProof(bookingId: number, formData: FormData) {
    const response = await api.post(
      `/bookings/${bookingId}/upload-payment`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
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
    const response = await api.get("/bookings", { params });
    return response.data.data || response.data;
  }

  // Cancel booking
  static async cancelBooking(bookingId: number, reason: string) {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      cancelReason: reason,
    });
    return response.data.data || response.data;
  }

  // Check payment status from Midtrans
  static async checkPaymentStatus(
    orderId: string
  ): Promise<PaymentStatusResponse> {
    const response = await api.get(`/payment/payment-status/${orderId}`);
    return response.data.data || response.data;
  }

  // Poll payment status (for real-time updates)
  static async pollPaymentStatus(
    orderId: string,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<PaymentStatusResponse> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const status = await this.checkPaymentStatus(orderId);

          // Check if payment is completed or failed
          if (
            [
              "settlement",
              "capture",
              "cancel",
              "deny",
              "expire",
              "failure",
            ].includes(status.transaction_status)
          ) {
            resolve(status);
            return;
          }

          // Continue polling if not final status
          if (attempts < maxAttempts) {
            setTimeout(poll, intervalMs);
          } else {
            reject(new Error("Payment status polling timeout"));
          }
        } catch (error) {
          if (attempts < maxAttempts) {
            setTimeout(poll, intervalMs);
          } else {
            reject(error);
          }
        }
      };

      poll();
    });
  }

  // Poll booking status (for status changes after payment)
  static async pollBookingStatus(
    bookingId: number
  ): Promise<{ status: string }> {
    const booking = await this.getBookingDetails(bookingId);
    return { status: booking.status };
  }
}
