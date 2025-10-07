"use client";

import Link from "next/link";
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { BellIcon } from "lucide-react";
import clsx from "clsx";
import { Booking } from "@/lib/types/bookings/booking";
import { TenantBooking } from "@/lib/services/tenant/tenant-approval-service";

interface BookingTableProps {
  bookings: (Booking | TenantBooking)[];
  statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }
  >;
  onConfirmBooking: (bookingId: number) => void;
  onRejectBooking: (bookingId: number) => void;
  isLoading: boolean;
  showReminderButton?: boolean;
  onSendReminder?: (bookingId: number) => void;
}

export default function BookingTable({
  bookings,
  statusConfig,
  onConfirmBooking,
  onRejectBooking,
  isLoading,
  showReminderButton = false,
  onSendReminder,
}: BookingTableProps) {
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

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Booking Details
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Guest
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dates
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => {
                  const StatusIcon =
                    statusConfig[booking.status]?.icon || ClockIcon;

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.bookingNo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.totalGuests} guests
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>
                          <div className="text-gray-900">
                            {booking.user?.name || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            {booking.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>
                          <div className="text-gray-900">
                            {booking.property?.name || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            {booking.property?.city &&
                            booking.property?.province
                              ? `${booking.property.city}, ${booking.property.province}`
                              : booking.property?.address || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>
                          <div className="text-gray-900">
                            {formatDate(booking.checkIn)} -{" "}
                            {formatDate(booking.checkOut)}
                          </div>
                          <div className="text-gray-500">
                            {Math.ceil(
                              (new Date(booking.checkOut).getTime() -
                                new Date(booking.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={clsx(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            statusConfig[booking.status]?.color ||
                              "bg-gray-100 text-gray-800"
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[booking.status]?.label ||
                            booking.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={
                              showReminderButton
                                ? `/dashboard/tenant-approval/${booking.id}`
                                : `/dashboard/bookings/${booking.id}`
                            }
                            className="text-rose-600 hover:text-rose-900"
                            title="View booking details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          {booking.status === "waiting_for_confirmation" && (
                            <>
                              <button
                                onClick={() => onConfirmBooking(booking.id)}
                                disabled={isLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Confirm booking"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onRejectBooking(booking.id)}
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Reject booking"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {showReminderButton && onSendReminder && (
                            <button
                              onClick={() => onSendReminder(booking.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Send reminder"
                            >
                              <BellIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            No bookings found matching your criteria.
          </div>
        </div>
      )}
    </div>
  );
}
