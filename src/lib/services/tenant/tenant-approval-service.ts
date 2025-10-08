import api from "../../api";

export interface TenantBooking {
  id: number;
  bookingNo: string;
  userId: number;
  status:
    | "waiting_for_payment"
    | "waiting_for_confirmation"
    | "confirmed"
    | "cancelled"
    | "expired"
    | "completed"
    | "rejected";
  totalAmount: number;
  paymentMethod: "manual_transfer" | "payment_gateway";
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
  midtransOrderId?: string;
  midtransPaymentType?: string;
  midtransSettlementTime?: string;
  midtransStatus?: string;
  midtransToken?: string;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  property: {
    id: number;
    name: string;
    city?: string;
    province?: string;
    address?: string;
  };
  items: {
    id: number;
    roomId: number;
    unitCount: number;
    unitPrice: number;
    nights: number;
    subTotal: number;
    room: {
      id: number;
      name: string;
      capacity: number;
      basePrice: number;
      description?: string;
    };
  }[];
}

export interface TenantBookingsResponse {
  bookings: TenantBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookingFilters {
  status?: string;
  bookingNo?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ConfirmPaymentData {
  confirmationNotes?: string;
}

export interface RejectPaymentData {
  rejectionReason: string;
}

export interface CancelOrderData {
  cancelReason: string;
}

export interface SendReminderData {
  reminderType: "payment" | "checkin" | "checkout";
}

export class TenantApprovalService {
  // Get tenant bookings with filters
  static async getTenantBookings(filters: BookingFilters = {}) {
    const response = await api.get("/tenant/bookings", { params: filters });
    console.log("Raw API response:", response.data);
    return response.data.data;
  }

  // Get booking details for tenant
  static async getBookingDetails(bookingId: number) {
    const response = await api.get(`/tenant/bookings/${bookingId}`);
    return response.data.data;
  }

  // Confirm payment
  static async confirmPayment(bookingId: number, data: ConfirmPaymentData) {
    const response = await api.patch(
      `/tenant/bookings/${bookingId}/confirm`,
      data
    );
    return response.data.data;
  }

  // Reject payment
  static async rejectPayment(bookingId: number, data: RejectPaymentData) {
    const response = await api.patch(
      `/tenant/bookings/${bookingId}/reject`,
      data
    );
    return response.data.data;
  }

  // Cancel user order
  static async cancelUserOrder(bookingId: number, data: CancelOrderData) {
    const response = await api.patch(
      `/tenant/bookings/${bookingId}/cancel`,
      data
    );
    return response.data.data;
  }

  // Get pending confirmations count
  static async getPendingConfirmationsCount() {
    const response = await api.get("/tenant/bookings/pending/count");
    return response.data.data;
  }

  // Send reminder
  static async sendReminder(bookingId: number, data: SendReminderData) {
    const response = await api.post(
      `/tenant/bookings/${bookingId}/reminder`,
      data
    );
    return response.data.data;
  }
}
