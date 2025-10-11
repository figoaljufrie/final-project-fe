"use client";

import { motion } from "framer-motion";
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import BookingRejectModal from "./BookingRejectModal";
import { useState } from "react";

interface BookingTableProps {
  bookings: Array<{
    id: number;
    bookingNo: string;
    status: string;
    totalAmount: number;
    paymentMethod: "manual_transfer" | "payment_gateway";
    createdAt: string;
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    user?: {
      name: string;
      email: string;
    };
    property?: {
      name: string;
      city: string;
      province: string;
      address: string;
    };
  }>;
  statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }
  >;
  onConfirmPayment: (bookingId: number, confirmationNotes?: string) => void;
  onRejectPayment: (bookingId: number, rejectionReason: string) => void;
  onCancelOrder: (bookingId: number, cancelReason: string) => void;
  onSendReminder: (bookingId: number) => void;
}

export default function BookingTable({
  bookings,
  statusConfig,
  onConfirmPayment,
  onRejectPayment,
  onCancelOrder,
  onSendReminder,
}: BookingTableProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRejectClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (selectedBookingId) {
      setIsLoading(true);
      try {
        await onRejectPayment(selectedBookingId, reason);
        setRejectModalOpen(false);
        setSelectedBookingId(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => {
              const StatusIcon =
                statusConfig[booking.status]?.icon || CheckIcon;
              return (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{booking.bookingNo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.property?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.property?.city || "N/A"},{" "}
                        {booking.property?.province || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkIn)}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {formatDate(booking.checkOut)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.totalGuests} guests
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.paymentMethod === "manual_transfer"
                        ? "Manual Transfer"
                        : "Payment Gateway"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusConfig[booking.status]?.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[booking.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          window.open(
                            `/dashboard/tenant-approval/${booking.id}`,
                            "_blank"
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>

                      {booking.status === "waiting_for_confirmation" &&
                        booking.paymentMethod === "manual_transfer" && (
                          <>
                            <button
                              onClick={() =>
                                onConfirmPayment(
                                  booking.id,
                                  "Payment confirmed via tenant approval"
                                )
                              }
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Confirm Payment"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(booking.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject Payment"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}

                      {booking.status === "waiting_for_confirmation" &&
                        booking.paymentMethod === "payment_gateway" && (
                          <span className="text-xs text-gray-500 italic">
                            Handled by Midtrans
                          </span>
                        )}

                      {booking.status === "waiting_for_payment" && (
                        <button
                          onClick={() => onSendReminder(booking.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Send Reminder"
                        >
                          <BellIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BookingRejectModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedBookingId(null);
        }}
        onReject={handleRejectConfirm}
        isLoading={isLoading}
      />
    </>
  );
}
