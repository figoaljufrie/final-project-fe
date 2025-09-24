"use client";

import { useState, useEffect } from "react";
import { 
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import BookingSearchFilter from "@/components/ui/BookingSearchFilter";
import BookingStatsCards from "@/components/ui/BookingStatsCards";
import BookingTable from "@/components/ui/BookingTable";
import BookingSkeleton from "@/components/ui/BookingSkeleton";
import { Booking } from "@/lib/types/bookings/booking";

// Mock data sesuai dengan schema database
const mockBookings: Booking[] = [
  {
    id: 1,
    bookingNo: "NGP-2025-001",
    userId: 1,
    status: "waiting_for_confirmation",
    totalAmount: 2400000,
    paymentMethod: "manual_transfer",
    paymentProofUrl: "/uploads/payment-proof-001.jpg",
    paymentDeadline: "2025-01-14T14:00:00Z",
    checkIn: "2025-01-15",
    checkOut: "2025-01-18",
    totalGuests: 4,
    notes: "Anniversary celebration",
    createdAt: "2025-01-14T12:00:00Z",
    updatedAt: "2025-01-14T12:00:00Z",
    user: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+62812345678",
    },
    property: {
      id: 1,
      name: "Villa Sunset Bali",
      city: "Seminyak",
      province: "Bali",
      address: "Jl. Sunset Road No. 123, Seminyak, Badung, Bali",
    },
    items: [
      {
        id: 1,
        roomId: 1,
        unitCount: 1,
        unitPrice: 800000,
        nights: 3,
        subTotal: 2400000,
        room: {
          id: 1,
          name: "Deluxe Ocean View",
          capacity: 4,
          basePrice: 800000,
          description: "Spacious room with ocean view",
        },
      },
    ],
  },
  {
    id: 2,
    bookingNo: "NGP-2025-002",
    userId: 2,
    status: "confirmed",
    totalAmount: 1800000,
    paymentMethod: "manual_transfer",
    paymentProofUrl: "/uploads/payment-proof-002.jpg",
    paymentDeadline: "2025-01-15T10:00:00Z",
    checkIn: "2025-01-16",
    checkOut: "2025-01-19",
    totalGuests: 2,
    notes: "Honeymoon trip",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T09:30:00Z",
    confirmedAt: "2025-01-15T09:30:00Z",
    user: {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phoneNumber: "+62823456789",
    },
    property: {
      id: 2,
      name: "Beach House Lombok",
      city: "Lombok",
      province: "NTB",
      address: "Jl. Pantai Senggigi No. 45, Lombok, NTB",
    },
    items: [
      {
        id: 2,
        roomId: 2,
        unitCount: 1,
        unitPrice: 600000,
        nights: 3,
        subTotal: 1800000,
        room: {
          id: 2,
          name: "Beachfront Suite",
          capacity: 2,
          basePrice: 600000,
          description: "Romantic suite with beach access",
        },
      },
    ],
  },
  {
    id: 3,
    bookingNo: "NGP-2025-003",
    userId: 3,
    status: "completed",
    totalAmount: 1200000,
    paymentMethod: "manual_transfer",
    paymentProofUrl: "/uploads/payment-proof-003.jpg",
    paymentDeadline: "2025-01-10T16:00:00Z",
    checkIn: "2025-01-12",
    checkOut: "2025-01-14",
    totalGuests: 3,
    notes: "Family weekend getaway",
    createdAt: "2025-01-10T14:00:00Z",
    updatedAt: "2025-01-14T11:00:00Z",
    confirmedAt: "2025-01-10T15:30:00Z",
    completedAt: "2025-01-14T11:00:00Z",
    user: {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phoneNumber: "+62834567890",
    },
    property: {
      id: 3,
      name: "Mountain Cabin Bandung",
      city: "Bandung",
      province: "Jawa Barat",
      address: "Jl. Lembang Raya No. 78, Bandung, Jawa Barat",
    },
    items: [
      {
        id: 3,
        roomId: 3,
        unitCount: 1,
        unitPrice: 400000,
        nights: 3,
        subTotal: 1200000,
        room: {
          id: 3,
          name: "Mountain View Cabin",
          capacity: 4,
          basePrice: 400000,
          description: "Cozy cabin with mountain view",
        },
      },
    ],
  },
];

const statusConfig = {
  waiting_for_payment: {
    label: "Waiting Payment",
    color: "bg-red-100 text-red-800",
    icon: ClockIcon,
  },
  waiting_for_confirmation: {
    label: "Waiting Confirmation",
    color: "bg-yellow-100 text-yellow-800",
    icon: ClockIcon,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: XMarkIcon,
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800",
    icon: XMarkIcon,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckIcon,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XMarkIcon,
  },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookings(mockBookings);
      setIsLoading(false);
    };

    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleConfirmBooking = async (bookingId: number) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "confirmed", confirmedAt: new Date().toISOString() }
          : booking
      ));
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "rejected" }
          : booking
      ));
    } catch (error) {
      console.error("Error rejecting booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <BookingSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header with Stats */}
        <BookingStatsCards bookings={bookings} />

        {/* Search & Bookings Table - Combined Card */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Search & Filters Header - No card styling */}
          <div className="px-6 py-4 border-b border-gray-200/50">
            <BookingSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              className="!p-0 !bg-transparent !shadow-none !border-none"
            />
          </div>

          {/* Bookings Table */}
          <BookingTable
            bookings={filteredBookings}
            statusConfig={statusConfig}
            onConfirmBooking={handleConfirmBooking}
            onRejectBooking={handleRejectBooking}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}