"use client";

import { motion } from "framer-motion";
import { useTenantApproval } from "@/hooks/tenant-approval/use-tenant-approval";
import BookingSearchFilter from "@/components/dashboard/booking/BookingSearchFilter";
import BookingStatsCards from "@/components/dashboard/booking/BookingStatsCards";
import BookingTable from "@/components/dashboard/booking/BookingTable";
import BookingSkeleton from "@/components/dashboard/booking/BookingSkeleton";
import TenantApprovalHeader from "@/components/dashboard/tenant-approval/TenantApprovalHeader";
import TenantApprovalPagination from "@/components/dashboard/tenant-approval/TenantApprovalPagination";

export default function TenantApprovalPage() {
  const {
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
  } = useTenantApproval();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <TenantApprovalHeader pendingCount={pendingCount} />

        <motion.div variants={itemVariants} className="mb-6">
          <BookingStatsCards bookings={bookings} />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <BookingSearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            statusConfig={statusConfig}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <BookingSkeleton />
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No bookings found
              </div>
              <div className="text-gray-400 text-sm">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No bookings have been made yet"}
              </div>
            </div>
          ) : (
            <>
              <BookingTable
                bookings={bookings}
                statusConfig={statusConfig}
                onConfirmPayment={handleConfirmPayment}
                onRejectPayment={handleRejectPayment}
                onCancelOrder={handleCancelOrder}
                onSendReminder={handleSendReminder}
              />
              <TenantApprovalPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
