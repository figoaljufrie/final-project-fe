"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import BookingCard from "@/components/booking/BookingCard";
import BookingFilters from "@/components/booking/BookingFilters";
import BookingEmptyState from "@/components/booking/BookingEmptyState";
import { useBookingList } from "@/hooks/booking/use-booking-list";
import { FilterOption } from "@/types/booking";

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

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Bookings", count: bookings.length },
    {
      value: "waiting_for_payment",
      label: "Waiting for Payment",
      count: bookings.filter((b) => b.status === "waiting_for_payment").length,
    },
    {
      value: "waiting_for_confirmation",
      label: "Waiting for Confirmation",
      count: bookings.filter((b) => b.status === "waiting_for_confirmation")
        .length,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      count: bookings.filter((b) => b.status === "confirmed").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-[#8B7355]"
          />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#8B7355] mb-2">
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
