"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TenantApprovalService,
  TenantBooking,
  BookingFilters,
} from "@/lib/services/tenant/tenant-approval-service";
import { toast } from "react-hot-toast";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

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
    label: "Diproses",
    color: "bg-green-100 text-green-800",
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: XCircleIcon,
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800",
    icon: XCircleIcon,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircleIcon,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: XCircleIcon,
  },
};

export function useTenantApproval() {
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
  const loadBookings = useCallback(async (filters: BookingFilters = {}) => {
    try {
      setIsLoading(true);
      const requestParams = {
        page: filters.page || pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        bookingNo: searchTerm || undefined,
        ...filters,
      };

      const result = await TenantApprovalService.getTenantBookings(
        requestParams
      );

      setBookings(result.bookings || []);

      if (result.pagination) {
        const backendPage = result.pagination.page || 1;
        const totalPages = result.pagination.totalPages || 0;
        const validPage = backendPage > totalPages ? 1 : backendPage;

        setPagination({
          total: result.pagination.total || 0,
          page: validPage,
          limit: result.pagination.limit || 10,
          totalPages: totalPages,
        });

        // If we had to reset to page 1, reload with page 1
        if (validPage === 1 && backendPage > totalPages) {
          loadBookings({ page: 1 });
          return;
        }
      } else {
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      }
    } catch (error: unknown) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, searchTerm]);

  // Load pending count
  const loadPendingCount = useCallback(async () => {
    try {
      const count = await TenantApprovalService.getPendingConfirmationsCount();
      setPendingCount(count);
    } catch (error) {
      console.error("Error loading pending count:", error);
    }
  }, []);

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadBookings({ page: 1, bookingNo: value || undefined });
  };

  // Handle status filter
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadBookings({
      page: 1,
      status: status !== "all" ? status : undefined,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    loadBookings({ page });
  };

  // Handle booking actions
  const handleConfirmPayment = async (
    bookingId: number,
    confirmationNotes?: string
  ) => {
    try {
      await TenantApprovalService.confirmPayment(bookingId, {
        confirmationNotes: confirmationNotes || "Payment confirmed by tenant",
      });
      toast.success("Payment confirmed successfully");
      loadBookings();
      loadPendingCount();
    } catch (error: unknown) {
      console.error("Error confirming payment:", error);
      toast.error(error.response?.data?.message || "Failed to confirm payment");
    }
  };

  const handleRejectPayment = async (
    bookingId: number,
    rejectionReason: string
  ) => {
    try {
      await TenantApprovalService.rejectPayment(bookingId, {
        rejectionReason: rejectionReason || "Payment rejected by tenant",
      });
      toast.success("Payment rejected successfully");
      loadBookings();
      loadPendingCount();
    } catch (error: unknown) {
      console.error("Error rejecting payment:", error);
      toast.error(error.response?.data?.message || "Failed to reject payment");
    }
  };

  const handleCancelOrder = async (bookingId: number, cancelReason: string) => {
    try {
      await TenantApprovalService.cancelUserOrder(bookingId, {
        cancelReason: cancelReason || "Order cancelled by tenant",
      });
      toast.success("Order cancelled successfully");
      loadBookings();
      loadPendingCount();
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleSendReminder = async (bookingId: number) => {
    try {
      await TenantApprovalService.sendReminder(bookingId, {
        reminderType: "payment",
      });
      toast.success("Reminder sent successfully");
    } catch (error: unknown) {
      console.error("Error sending reminder:", error);
      toast.error(error.response?.data?.message || "Failed to send reminder");
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBookings();
    loadPendingCount();
  }, [loadBookings, loadPendingCount]);

  return {
    bookings,
    isLoading,
    searchTerm,
    statusFilter,
    pagination,
    pendingCount,
    statusConfig,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handleConfirmPayment,
    handleRejectPayment,
    handleCancelOrder,
    handleSendReminder,
    loadBookings,
  };
}
