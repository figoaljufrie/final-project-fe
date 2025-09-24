"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import BookingDetailHeader from "@/components/ui/BookingDetailHeader";
import BookingDetailContent from "@/components/ui/BookingDetailContent";
import BookingDetailSidebar from "@/components/ui/BookingDetailSidebar";
import BookingRejectModal from "@/components/ui/BookingRejectModal";

// Mock data - replace with actual API call
const mockBooking = {
  id: "BK001",
  bookingNo: "NGP-2025-001",
  guest: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+62812345678",
    avatar: null,
  },
  property: {
    name: "Villa Sunset Bali",
    location: "Seminyak, Bali",
    address: "Jl. Sunset Road No. 123, Seminyak, Badung, Bali",
    images: ["/api/placeholder/400/300"],
  },
  checkIn: "2025-01-15",
  checkOut: "2025-01-18",
  totalGuests: 4,
  status: "waiting_for_confirmation",
  totalAmount: 2400000,
  paymentMethod: "manual_transfer",
  paymentProofUrl: "/api/placeholder/600/400",
  paymentDeadline: "2025-01-14T14:00:00Z",
  createdAt: "2025-01-14T12:00:00Z",
  notes: "Anniversary celebration - please prepare room decoration",
  rooms: [
    {
      id: 1,
      name: "Deluxe Ocean View",
      unitCount: 1,
      unitPrice: 800000,
      nights: 3,
      subTotal: 2400000,
    },
  ],
};

type BookingStatus = 
  | "waiting_for_payment" 
  | "waiting_for_confirmation" 
  | "confirmed" 
  | "completed" 
  | "cancelled" 
  | "expired" 
  | "rejected";

const statusConfig: Record<BookingStatus, {
  label: string;
  color: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = {
  waiting_for_payment: {
    label: "Waiting Payment",
    color: "bg-yellow-100 text-yellow-800",
    icon: ClockIcon,
  },
  waiting_for_confirmation: {
    label: "Pending Confirmation",
    color: "bg-blue-100 text-blue-800",
    icon: ClockIcon,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckIcon,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
    icon: CheckIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XMarkIcon,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-800",
    icon: XMarkIcon,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XMarkIcon,
  },
};

export default function BookingDetailPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(mockBooking);
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log("Confirming booking:", booking.id);
      
      setBooking(prev => ({
        ...prev,
        status: "confirmed" as const,
        confirmedAt: new Date().toISOString(),
      }));
      
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to confirm booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log("Rejecting booking:", booking.id, "Reason:", rejectReason);
      
      setBooking(prev => ({
        ...prev,
        status: "rejected" as const,
        cancelReason: rejectReason,
      }));
      
      toast.success("Booking rejected successfully!");
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <BookingDetailHeader
          booking={booking}
          statusConfig={statusConfig}
          onBack={() => router.back()}
          onConfirm={handleConfirmBooking}
          onReject={() => setShowRejectModal(true)}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <BookingDetailContent booking={booking} />

          {/* Sidebar */}
          <BookingDetailSidebar booking={booking} />
        </div>

        {/* Reject Modal */}
        <BookingRejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onReject={handleRejectBooking}
          rejectReason={rejectReason}
          onReasonChange={setRejectReason}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
