"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { StatusPolling } from "@/lib/utils/status-polling";

interface BookingData {
  id: number;
  bookingNo: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentDeadline?: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  notes?: string;
  createdAt: string;
  paymentProofUrl?: string;
  items: Array<{
    id: number;
    room: {
      name: string;
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
        tenant: {
          name: string;
          email: string;
          phone?: string;
          avatarUrl?: string;
        };
      };
    };
    unitCount: number;
    unitPrice: number;
    nights: number;
    subTotal: number;
  }>;
  user: {
    name: string;
    email: string;
  };
}

export function useBookingDetail(bookingId?: string) {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const params = useParams();
  const router = useRouter();
  const finalBookingId = bookingId || (params.id as string);

  // Handle redirects based on booking status
  const handleStatusBasedRedirect = useCallback(
    (bookingData: Record<string, unknown>) => {
      if (!bookingData) return;

      const { status, paymentMethod } = bookingData;

      // If payment is confirmed, show success message and redirect
      if (status === "confirmed") {
        toast.success("Payment confirmed! Your booking is now confirmed.");
        setTimeout(() => {
          router.push(`/bookings/${finalBookingId}`);
        }, 3000);
        return;
      }

      // If payment is completed, show completion message
      if (status === "completed") {
        toast.success("Booking completed! Thank you for your stay.");
        return;
      }

      // If booking is cancelled, show cancellation message
      if (status === "cancelled") {
        toast.error("This booking has been cancelled.");
        setTimeout(() => {
          router.push("/bookings");
        }, 3000);
        return;
      }

      // If booking is expired, show expiration message
      if (status === "expired") {
        toast.error("This booking has expired.");
        setTimeout(() => {
          router.push("/bookings");
        }, 3000);
        return;
      }

      // If payment is still pending, check if we should redirect to payment pages
      if (status === "waiting_for_payment") {
        const urlParams = new URLSearchParams(window.location.search);
        const fromPayment = urlParams.get("from");

        if (fromPayment === "success") {
          toast.success("Payment successful! Your booking is being processed.");
          setTimeout(() => {
            router.replace(`/bookings/${finalBookingId}`);
          }, 2000);
        } else if (fromPayment === "error") {
          toast.error("Payment failed. Please try again.");
          setTimeout(() => {
            if (paymentMethod === "payment_gateway") {
              router.push(`/bookings/${finalBookingId}/payment-pending`);
            } else {
              router.push(`/bookings/${finalBookingId}/upload-payment`);
            }
          }, 2000);
        } else if (fromPayment === "pending") {
          toast("Payment is still being processed. Please wait for confirmation.");
          setTimeout(() => {
            if (paymentMethod === "payment_gateway") {
              router.push(`/bookings/${finalBookingId}/payment-pending`);
            } else {
              router.push(`/bookings/${finalBookingId}/upload-payment`);
            }
          }, 2000);
        }
      }
    },
    [finalBookingId, router]
  );

  // Load booking data from API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(
          Number(finalBookingId)
        );
        setBookingData(data);
        handleStatusBasedRedirect(data);
      } catch (error: unknown) {
        console.error("Error loading booking data:", error);

        // Type guard untuk AxiosError
        const isAxiosError = (
          err: unknown
        ): err is { response?: { status: number } } => {
          return typeof err === "object" && err !== null && "response" in err;
        };

        if (isAxiosError(error)) {
          if (error.response?.status === 403) {
            toast.error(
              "Access denied. You may not have permission to view this booking."
            );
            setTimeout(() => {
              router.push("/bookings");
            }, 2000);
          } else if (error.response?.status === 404) {
            toast.error("Booking not found.");
            setTimeout(() => {
              router.push("/bookings/not-found");
            }, 2000);
          } else if (error.response?.status === 401) {
            toast.error("Please login to view your bookings.");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            toast.error("Failed to load booking data. Please try again.");
          }
        } else {
          toast.error("Failed to load booking data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (finalBookingId) {
      loadBookingData();
    }
  }, [finalBookingId, router, handleStatusBasedRedirect]);

  // Auto-reload for manual transfer confirmations
  useEffect(() => {
    if (!bookingData || bookingData.status !== "waiting_for_confirmation")
      return;

    const polling = new StatusPolling(
      async () => {
        const data = await PaymentService.getBookingDetails(
          Number(finalBookingId)
        );
        return { status: data.status };
      },
      {
        interval: 3000, // Poll every 3 seconds for faster updates
        maxAttempts: 40, // Poll for 2 minutes (40 * 3s)
        onStatusChange: (newStatus) => {
          if (newStatus === "confirmed") {
            toast.success("Payment confirmed! Your booking is now confirmed.");
            // Immediately reload booking data
            const reloadData = async () => {
              try {
                const data = await PaymentService.getBookingDetails(
                  Number(finalBookingId)
                );
                setBookingData(data);
              } catch (error) {
                console.error("Error reloading booking data:", error);
              }
            };
            reloadData();
          } else if (newStatus === "cancelled" || newStatus === "expired") {
            // Stop polling if booking is cancelled or expired
            polling.stop();
            const reloadData = async () => {
              try {
                const data = await PaymentService.getBookingDetails(
                  Number(finalBookingId)
                );
                setBookingData(data);
              } catch (error) {
                console.error("Error reloading booking data:", error);
              }
            };
            reloadData();
          }
        },
        onError: (error) => {
          console.error("Polling error:", error);
        },
        onMaxAttemptsReached: () => {
          // Stop polling after 2 minutes, user can manually refresh
          console.log("Polling stopped after max attempts reached");
        },
      }
    );

    polling.start(bookingData.status);

    return () => {
      polling.stop();
    };
  }, [bookingData, finalBookingId]);

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      await PaymentService.cancelBooking(Number(finalBookingId), cancelReason);
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setCancelReason("");
      const data = await PaymentService.getBookingDetails(
        Number(finalBookingId)
      );
      setBookingData(data);
    } catch (error: unknown) {
      console.error("Error cancelling booking:", error);

      // Type guard untuk AxiosError
      const isAxiosError = (
        err: unknown
      ): err is { response?: { data?: { message?: string } } } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to cancel booking"
        );
      } else {
        toast.error("Failed to cancel booking");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    bookingData,
    isLoading,
    isCancelling,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    handleCancelBooking,
  };
}
