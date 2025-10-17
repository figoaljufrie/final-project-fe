"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { StatusPolling } from "@/lib/utils/status-polling";
import { toast } from "react-hot-toast";

interface BookingData {
  status: string;
}

export function usePaymentStatusPolling(bookingData: BookingData | null, bookingId: string) {
  const [pollingStatus, setPollingStatus] = useState<
    "polling" | "success" | "timeout" | "error"
  >("polling");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!bookingData || bookingData.status === "confirmed") return;

    const polling = new StatusPolling(
      async () => {
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        return { status: data.status };
      },
      {
        interval: 3000,
        maxAttempts: 20,
        onStatusChange: (newStatus) => {
          setCurrentStatus(newStatus);
          setPollingStatus("success");
          toast.success("Payment confirmed! Your booking is now confirmed.");

          setTimeout(() => {
            router.push(`/bookings/${bookingId}`);
          }, 3000);
        },
        onError: (error) => {
          console.error("Polling error:", error);
          setPollingStatus("error");
        },
        onMaxAttemptsReached: () => {
          setPollingStatus("timeout");
          toast.error(
            "Payment verification timed out. Please check your booking status manually."
          );
        },
      }
    );

    polling.start(bookingData.status);

    return () => {
      polling.stop();
    };
  }, [bookingData, bookingId, router]);

  const getStatusMessage = () => {
    switch (pollingStatus) {
      case "polling":
        return {
          title: "Payment Successful!",
          subtitle: "We are verifying your payment...",
          icon: "clock",
          color: "text-yellow-600",
        };
      case "success":
        return {
          title: "Payment Confirmed!",
          subtitle: "Your booking is now confirmed.",
          icon: "check",
          color: "text-green-600",
        };
      case "timeout":
        return {
          title: "Verification Timeout",
          subtitle: "Please check your booking status manually.",
          icon: "alert",
          color: "text-orange-600",
        };
      case "error":
        return {
          title: "Verification Error",
          subtitle: "Unable to verify payment status.",
          icon: "alert",
          color: "text-red-600",
        };
      default:
        return {
          title: "Processing...",
          subtitle: "Please wait...",
          icon: "loader",
          color: "text-blue-600",
        };
    }
  };

  return {
    pollingStatus,
    currentStatus,
    getStatusMessage,
  };
}
