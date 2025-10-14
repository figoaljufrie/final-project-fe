"use client";

import { motion } from "framer-motion";
import BookingCard from "@/components/booking/BookingCard";
import BookingFilters from "@/components/booking/BookingFilters";
import BookingEmptyState from "@/components/booking/BookingEmptyState";
import { useBookingList } from "@/hooks/booking/use-booking-list";
import { FilterOption } from "@/types/booking";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProfileBookingsPage() {
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
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track all your property bookings
            </p>
            {safeBookings.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <span className="text-sm font-medium text-rose-700">
                  {safeBookings.length} booking{safeBookings.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6">
          <BookingFilters
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            filterOptions={filterOptions}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12">
            <BookingEmptyState
              searchTerm={searchTerm}
              activeFilter={activeFilter}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <BookingCard booking={booking} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {filteredBookings.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {safeBookings.filter((b) => b.status === "confirmed").length}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {safeBookings.filter((b) => b.status === "waiting_for_payment").length}
                </p>
                <p className="text-sm text-gray-600">Pending Payment</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {safeBookings.filter((b) => b.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {safeBookings.filter((b) => b.status === "cancelled").length}
                </p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

