"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentService,
  CreateBookingPayload,
} from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";

export function useCreateBooking() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const createBooking = async (bookingData: CreateBookingPayload) => {
    setIsCreating(true);
    try {
      const response = await PaymentService.createBooking(bookingData);

      // Handle different payment methods
      if (bookingData.paymentMethod === "payment_gateway") {
        // Redirect to Midtrans payment
        if (response.midtransPayment?.redirectUrl) {
          window.location.href = response.midtransPayment.redirectUrl;
        } else {
          // Fallback to payment pending page
          router.push(`/bookings/${response.id}/payment-pending`);
        }
      } else {
        // Redirect to upload payment proof page
        router.push(`/bookings/${response.id}/upload-payment`);
      }

      toast.success("Booking created successfully!");
      return response;
    } catch (error: unknown) {
      console.error("Error creating booking:", error);

      // Type guard untuk AxiosError
      const isAxiosError = (
        err: unknown
      ): err is { response?: { data?: { message?: string } } } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create booking"
        );
      } else {
        toast.error("Failed to create booking");
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createBooking,
    isCreating,
  };
}
