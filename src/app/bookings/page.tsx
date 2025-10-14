"use client";

import { motion } from "framer-motion";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import BookingCard from "@/components/booking/BookingCard";
import BookingFilters from "@/components/booking/BookingFilters";
import BookingEmptyState from "@/components/booking/BookingEmptyState";
import { useBookingList } from "@/hooks/booking/use-booking-list";
import { FilterOption } from "@/types/booking";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

export default function BookingsPage() {
  const {
    bookings,
    filteredBookings,
    isLoading,
    activeFilter,
    searchTerm,
    handleFilterChange,
    handleSearchChange,
  } = useBookingList();

  // Ensure bookings is always an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Bookings", count: safeBookings.length },
    {
      value: "waiting_for_payment",
      label: "Waiting for Payment",
      count: safeBookings.filter((b) => b.status === "waiting_for_payment").length,
    },
    {
      value: "waiting_for_confirmation",
      label: "Waiting for Confirmation",
      count: safeBookings.filter((b) => b.status === "waiting_for_confirmation")
        .length,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      count: safeBookings.filter((b) => b.status === "confirmed").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: safeBookings.filter((b) => b.status === "completed").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: safeBookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading your bookings"
        subMessage="Please wait while we fetch your booking list..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              Manage and track all your property bookings
            </p>
          </div>

          {/* Filters and Search */}
          <BookingFilters
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            filterOptions={filterOptions}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <BookingEmptyState
              searchTerm={searchTerm}
              activeFilter={activeFilter}
            />
          ) : (
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
