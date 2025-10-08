"use client";

import { useState, useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  TenantApprovalService,
  TenantBooking,
  BookingFilters,
} from "@/lib/services/tenant/tenant-approval-service";
import BookingSearchFilter from "@/components/ui/BookingSearchFilter";
import BookingStatsCards from "@/components/ui/BookingStatsCards";
import BookingTable from "@/components/ui/BookingTable";
import BookingSkeleton from "@/components/ui/BookingSkeleton";
import { toast } from "react-hot-toast";

const statusConfig = {
  waiting_for_payment: {
    label: "Waiting Payment",
    color: "bg-red-100 text-red-800",
    icon: ClockIcon,
  },
  waiting_for_confirmation: {
    label: "Waiting Confirmation",
    color: "bg-yellow-100 text-yellow-800",
    icon: ExclamationTriangleIcon,
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

export default function TenantApprovalPage() {
  const [bookings, setBookings] = useState<TenantBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);

  // Load bookings data
  const loadBookings = async (filters: BookingFilters = {}) => {
    try {
      setIsLoading(true);
      const requestParams = {
        page: filters.page || pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        bookingNo: searchTerm || undefined,
        ...filters,
      };
      console.log("Request parameters:", requestParams);
      const result = await TenantApprovalService.getTenantBookings(
        requestParams
      );

      setBookings(result.bookings || []);
      // Update pagination state with the actual response
      if (result.pagination) {
        console.log("Backend pagination response:", result.pagination);
        const backendPage = result.pagination.page || 1;
        const totalPages = result.pagination.totalPages || 0;

        // Fix invalid page number - if page > totalPages, reset to page 1
        const validPage = backendPage > totalPages ? 1 : backendPage;

        setPagination({
          total: result.pagination.total || 0,
          page: validPage,
          limit: result.pagination.limit || 10,
          totalPages: totalPages,
        });

        // If page was invalid, reload with correct page
        if (backendPage > totalPages && totalPages > 0) {
          console.log(`Invalid page ${backendPage}, reloading with page 1`);
          loadBookings({ page: 1 });
        }
      } else {
        // Reset to default if no pagination data
        console.log("No pagination data, resetting to default");
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      }
    } catch (error: any) {
      console.error("Error loading bookings:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
      // Reset pagination on error
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load pending count
  const loadPendingCount = async () => {
    try {
      const result = await TenantApprovalService.getPendingConfirmationsCount();
      setPendingCount(result.count || 0);
    } catch (error: any) {
      console.error("Error loading pending count:", error);
    }
  };

  useEffect(() => {
    console.log("Initial pagination state:", pagination);
    loadBookings();
    loadPendingCount();
  }, []);

  // Use bookings directly since filtering is now done on backend
  const filteredBookings = bookings;

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId: number) => {
    try {
      setIsLoading(true);
      await TenantApprovalService.confirmPayment(bookingId, {
        confirmationNotes: "Payment confirmed by tenant",
      });

      toast.success("Booking confirmed successfully");
      await loadBookings();
      await loadPendingCount();
    } catch (error: any) {
      console.error("Error confirming booking:", error);
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject booking
  const handleRejectBooking = async (bookingId: number) => {
    const rejectionReason = prompt("Please provide a reason for rejection:");
    if (!rejectionReason) return;

    try {
      setIsLoading(true);
      await TenantApprovalService.rejectPayment(bookingId, {
        rejectionReason,
      });

      toast.success("Booking rejected successfully");
      await loadBookings();
      await loadPendingCount();
    } catch (error: any) {
      console.error("Error rejecting booking:", error);
      toast.error(error.response?.data?.message || "Failed to reject booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send reminder
  const handleSendReminder = async (
    bookingId: number,
    reminderType: "payment" | "checkin" | "checkout" = "payment"
  ) => {
    try {
      await TenantApprovalService.sendReminder(bookingId, { reminderType });
      toast.success("Reminder sent successfully");
    } catch (error: any) {
      console.error("Error sending reminder:", error);
      toast.error(error.response?.data?.message || "Failed to send reminder");
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // Reload data with new search term (page will be reset to 1 by backend)
    loadBookings({
      page: 1,
      bookingNo: newSearchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    // Reload data with new status filter (page will be reset to 1 by backend)
    loadBookings({
      page: 1,
      bookingNo: searchTerm || undefined,
      status: newStatus !== "all" ? newStatus : undefined,
    });
  };

  if (isLoading && bookings.length === 0) {
    return <BookingSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#8B7355]">
              Tenant Approval System
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and approve booking requests from users
            </p>
          </div>

          {pendingCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-center gap-3"
            >
              <BellIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">
                  {pendingCount} booking{pendingCount > 1 ? "s" : ""} pending
                  approval
                </p>
                <p className="text-sm text-yellow-700">
                  Please review and take action
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <BookingStatsCards bookings={bookings} />

        {/* Search & Bookings Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Search & Filters Header */}
          <div className="px-6 py-4 border-b border-gray-200/50">
            <BookingSearchFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
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
            showReminderButton={true}
            onSendReminder={handleSendReminder}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && pagination.total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-white rounded-lg p-4"
          >
            <div className="text-sm text-gray-700">
              {pagination.total > 0 ? (
                <>
                  Showing{" "}
                  {Math.max(
                    1,
                    (Math.min(pagination.page, pagination.totalPages) - 1) *
                      pagination.limit +
                      1
                  )}{" "}
                  to{" "}
                  {Math.min(
                    Math.min(pagination.page, pagination.totalPages) *
                      pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </>
              ) : (
                "No results found"
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newPage = Math.max(1, pagination.page - 1);
                  loadBookings({ page: newPage });
                }}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm">
                Page {Math.min(pagination.page, pagination.totalPages)} of{" "}
                {pagination.totalPages}
              </span>

              <button
                onClick={() => {
                  const newPage = Math.min(
                    pagination.totalPages,
                    pagination.page + 1
                  );
                  loadBookings({ page: newPage });
                }}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
