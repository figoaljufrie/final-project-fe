"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import PaymentMethodModal from "@/components/payment/PaymentMethodModal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBookingDetail } from "@/hooks/booking/use-booking-detail";
import BookingDetailHeader from "@/components/booking/BookingDetailHeader";
import BookingDetailTabs from "@/components/booking/BookingDetailTabs";
import BookingDetailSidebar from "@/components/booking/BookingDetailSidebar";
import {
  getDeadlineText,
  getDeadlineMessage,
} from "@/lib/utils/payment-deadline";

export default function BookingDetails() {
  const [activeTab, setActiveTab] = useState<"details" | "payment" | "contact">(
    "details"
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const params = useParams();
  const bookingId = params.id as string;

  const {
    bookingData,
    isLoading,
    isCancelling,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    handleCancelBooking,
  } = useBookingDetail(bookingId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting_for_payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "waiting_for_confirmation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "waiting_for_payment":
        return <Clock size={16} className="text-yellow-600" />;
      case "waiting_for_confirmation":
        return <AlertCircle size={16} className="text-blue-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      case "expired":
        return <XCircle size={16} className="text-red-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-[#8B7355]"
          />
          <p className="text-gray-600">Loading booking details...</p>
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
          <Link
            href="/dashboard/bookings"
            className="text-[#8B7355] hover:underline"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors mb-6"
        >
          <span>Back to My Bookings</span>
        </Link>

        {/* Header Section */}
        <BookingDetailHeader
          bookingData={bookingData}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BookingDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bookingData={bookingData}
              showPaymentModal={showPaymentModal}
              setShowPaymentModal={setShowPaymentModal}
              bookingId={bookingId}
              getDeadlineText={getDeadlineText}
              getDeadlineMessage={getDeadlineMessage}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingDetailSidebar
              bookingData={bookingData}
              bookingId={bookingId}
              showCancelModal={showCancelModal}
              setShowCancelModal={setShowCancelModal}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectMethod={(method) => {
          console.log("Selected payment method:", method);
          setShowPaymentModal(false);
          if (method === "payment_gateway") {
            window.location.href = `/bookings/${bookingId}/payment-pending`;
          } else {
            window.location.href = `/bookings/${bookingId}/upload-payment`;
          }
        }}
        totalAmount={bookingData.totalAmount}
        bookingId={bookingData.id}
        bookingNo={bookingData.bookingNo}
        bookingData={{
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.totalGuests,
          nights: bookingData.items[0]?.nights || 0,
        }}
      />

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[#8B7355] mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this booking..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="flex-1"
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleCancelBooking}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
