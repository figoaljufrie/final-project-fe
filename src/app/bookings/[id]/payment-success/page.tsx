"use client";

import { useState, useEffect } from "react";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentCard } from "@/components/payment/payment-card";
import { usePaymentStatusPolling } from "@/hooks/payment/use-payment-status-polling";

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
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;

  const { pollingStatus, currentStatus, getStatusMessage } = usePaymentStatusPolling(bookingData, bookingId);

  // Load initial booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        setBookingData(data);

        // Check if redirected from Midtrans
        const fromMidtrans = searchParams.get('from');
        if (fromMidtrans === 'success') {
          toast.success("Payment successful! Redirected from payment gateway.");
        }

        // If already confirmed, show success immediately
        if (data.status === "confirmed") {
          toast.success("Payment confirmed! Your booking is now confirmed.");
        }
      } catch (error: unknown) {
        console.error("Error loading booking data:", error);
        toast.error("Failed to load booking data");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId, searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading payment status"
        subMessage="Please wait while we verify your payment..."
      />
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
          <Link href="/bookings" className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent hover:from-amber-700 hover:to-rose-700 transition-all duration-300">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const statusInfo = getStatusMessage();

  const getStatusIcon = () => {
    switch (statusInfo.icon) {
      case "clock":
        return <Clock size={48} className="text-yellow-500" />;
      case "check":
        return <CheckCircle size={48} className="text-green-500" />;
      case "alert":
        return <AlertCircle size={48} className="text-orange-500" />;
      case "loader":
        return <Loader2 size={48} className="animate-spin text-blue-500" />;
      default:
        return <Loader2 size={48} className="animate-spin text-blue-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent hover:from-amber-700 hover:to-rose-700 transition-all duration-300 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to My Bookings</span>
        </Link>

        <PaymentCard delay={0} className="p-8 text-center mb-8">
          <div className="mb-6">{getStatusIcon()}</div>

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

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 backdrop-blur-sm">
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
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Booking Details
              </Button>
            </div>
          )}

          {(pollingStatus === "timeout" || pollingStatus === "error") && (
            <div className="space-y-4">
              <Button
                onClick={() => router.push(`/bookings/${bookingId}`)}
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Check Booking Status
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="ml-4 border-gray-300/50 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </Button>
          </div>
          )}
        </PaymentCard>

        <PaymentCard delay={0.1}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-6">
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
                <h3 className="font-semibold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
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
        </PaymentCard>
      </div>

      <Footer />
    </main>
  );
}
