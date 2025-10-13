import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { BookingData, FilterStatus, StatusConfig } from "@/types/booking";

export const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "confirmed":
      return {
        label: "CONFIRMED",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      };
    case "waiting_for_payment":
      return {
        label: "WAITING FOR PAYMENT",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      };
    case "waiting_for_confirmation":
      return {
        label: "WAITING FOR CONFIRMATION",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
      };
    case "completed":
      return {
        label: "COMPLETED",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
      };
    case "cancelled":
      return {
        label: "CANCELLED",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      };
    default:
      return {
        label: status.replace("_", " ").toUpperCase(),
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
      };
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const canReviewBooking = (booking: BookingData): boolean => {
  // Only completed bookings can be reviewed
  // Completed status means: 1 day AFTER checkout date (automatic via cron job)
  return booking.status === "completed";
};

export const filterBookings = (
  bookings: BookingData[],
  activeFilter: FilterStatus,
  searchTerm: string
): BookingData[] => {
  let filtered = bookings;

  // Filter by status
  if (activeFilter !== "all") {
    filtered = filtered.filter((booking) => booking.status === activeFilter);
  }

  // Search by booking number or property name
  if (searchTerm) {
    filtered = filtered.filter(
      (booking) =>
        booking.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.items[0]?.room?.property?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  return filtered;
};
