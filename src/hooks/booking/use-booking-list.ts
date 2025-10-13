import { useState, useEffect } from "react";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { BookingData, FilterStatus } from "@/types/booking";

export function useBookingList() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load bookings data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getUserBookings();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error: any) {
        console.error("Error loading bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Filter and search bookings
  useEffect(() => {
    const { filterBookings } = require("@/lib/utils/booking-utils");
    const filtered = filterBookings(bookings, activeFilter, searchTerm);
    setFilteredBookings(filtered);
  }, [bookings, activeFilter, searchTerm]);

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return {
    bookings,
    filteredBookings,
    isLoading,
    activeFilter,
    searchTerm,
    handleFilterChange,
    handleSearchChange,
  };
}

