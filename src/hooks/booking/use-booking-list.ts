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
        
        // Handle different response structures from backend
        let bookingsArray: BookingData[] = [];
        
        if (Array.isArray(data)) {
          // If data is already an array
          bookingsArray = data;
        } else if (data && typeof data === 'object') {
          // If data is an object, check for common array properties
          if (Array.isArray(data.bookings)) {
            bookingsArray = data.bookings;
          } else if (Array.isArray(data.data)) {
            bookingsArray = data.data;
          } else if (Array.isArray(data.results)) {
            bookingsArray = data.results;
          } else {
            // If it's a single booking object, wrap it in an array
            bookingsArray = [data];
          }
        }
        
        console.log("Raw data from backend:", data);
        console.log("Processed bookings array:", bookingsArray);
        
        setBookings(bookingsArray);
        setFilteredBookings(bookingsArray);
      } catch (error: unknown) {
        console.error("Error loading bookings:", error);
        toast.error("Failed to load bookings");
        // Set empty arrays on error
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Filter and search bookings
  useEffect(() => {
    import("@/lib/utils/booking-utils").then(({ filterBookings }) => {
      const filtered = filterBookings(bookings, activeFilter, searchTerm);
      setFilteredBookings(filtered);
    });
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

