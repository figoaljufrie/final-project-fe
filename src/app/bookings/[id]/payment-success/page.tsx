"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Loader2,
  CreditCard,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
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
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  items: Array<{
    room: {
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
      };
    };
    nights: number;
  }>;
  user: {
    name: string;
    email: string;
  };
}

export default function PaymentSuccess() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollingStatus, setPollingStatus] = useState<
    "polling" | "success" | "timeout" | "error"
  >("polling");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Load initial booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        setBookingData(data);
        setCurrentStatus(data.status);

        // If already confirmed, show success immediately
        if (data.status === "confirmed") {
          setPollingStatus("success");
          toast.success("Payment confirmed! Your booking is now confirmed.");
        }
      } catch (error: unknown) {
        console.error("Error loading booking data:", error);
        setPollingStatus("error");
        toast.error("Failed to load booking data");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId]);

  // Start polling for status changes
  useEffect(() => {
    if (!bookingData || bookingData.status === "confirmed") return;

    const polling = new StatusPolling(
      async () => {
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        return { status: data.status };
      },
      {
        interval: 3000, // Poll every 3 seconds
        maxAttempts: 20, // Poll for 1 minute (20 * 3s)
        onStatusChange: (newStatus) => {
          setCurrentStatus(newStatus);
          setPollingStatus("success");
          toast.success("Payment confirmed! Your booking is now confirmed.");

          // Redirect to booking details after 3 seconds
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusMessage = () => {
    switch (pollingStatus) {
      case "polling":
        return {
          title: "Payment Successful!",
          subtitle: "We are verifying your payment...",
          icon: <Clock size={48} className="text-yellow-500" />,
          color: "text-yellow-600",
        };
      case "success":
        return {
          title: "Payment Confirmed!",
          subtitle: "Your booking is now confirmed.",
          icon: <CheckCircle size={48} className="text-green-500" />,
          color: "text-green-600",
        };
      case "timeout":
        return {
          title: "Verification Timeout",
          subtitle: "Please check your booking status manually.",
          icon: <AlertCircle size={48} className="text-orange-500" />,
          color: "text-orange-600",
        };
      case "error":
        return {
          title: "Verification Error",
          subtitle: "Unable to verify payment status.",
          icon: <AlertCircle size={48} className="text-red-500" />,
          color: "text-red-600",
        };
      default:
        return {
          title: "Processing...",
          subtitle: "Please wait...",
          icon: <Loader2 size={48} className="animate-spin text-blue-500" />,
          color: "text-blue-600",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-[#8B7355]"
          />
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
          <Link href="/bookings" className="text-[#8B7355] hover:underline">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const statusInfo = getStatusMessage();

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to My Bookings</span>
        </Link>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center mb-8"
        >
          <div className="mb-6">{statusInfo.icon}</div>

          <h1 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>

          <p className="text-gray-600 text-lg mb-6">{statusInfo.subtitle}</p>

          {pollingStatus === "polling" && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying payment... This may take a few moments.</span>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Current Status:</strong>{" "}
              <span className="capitalize">
                {currentStatus.replace("_", " ")}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Booking ID:</strong> {bookingData.bookingNo}
            </p>
          </div>

          {pollingStatus === "success" && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                Redirecting to your booking details...
              </p>
              <Button
                onClick={() => router.push(`/bookings/${bookingId}`)}
                className="bg-[#8B7355] hover:bg-[#7A6349] text-white"
              >
                View Booking Details
              </Button>
            </div>
          )}

          {(pollingStatus === "timeout" || pollingStatus === "error") && (
            <div className="space-y-4">
              <Button
                onClick={() => router.push(`/bookings/${bookingId}`)}
                className="bg-[#8B7355] hover:bg-[#7A6349] text-white"
              >
                Check Booking Status
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="ml-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </motion.div>

        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-[#8B7355] mb-6">
            Booking Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Info */}
            <div className="flex items-start gap-4">
              <Image
                src={
                  property?.images[0]?.url ||
                  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }
                alt={property?.name || "Property"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-[#8B7355]">
                  {property?.name || "Property"}
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <MapPin size={14} />
                  {property?.address || "Address not available"}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm">
                  <strong>Check-in:</strong> {formatDate(bookingData.checkIn)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm">
                  <strong>Check-out:</strong> {formatDate(bookingData.checkOut)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-sm">
                  <strong>Guests:</strong> {bookingData.totalGuests} guests
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-500" />
                <span className="text-sm">
                  <strong>Total:</strong> Rp{" "}
                  {bookingData.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
