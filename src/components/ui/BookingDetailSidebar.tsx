"use client";

import Image from "next/image";
import {
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface BookingDetailSidebarProps {
  booking: {
    totalAmount: number;
    paymentDeadline?: string;
    status: string;
    paymentProofUrl?: string;
  };
}

export default function BookingDetailSidebar({ booking }: BookingDetailSidebarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="glass-card rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
            Payment Summary
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-medium text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {booking.paymentDeadline && booking.status === "waiting_for_payment" && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Payment Deadline</p>
                  <p className="text-sm text-yellow-700">
                    {formatDateTime(booking.paymentDeadline)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Proof */}
      {booking.paymentProofUrl && (
        <div className="glass-card rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-400" />
              Payment Proof
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="relative">
              <Image
                src={booking.paymentProofUrl}
                alt="Payment proof"
                width={300}
                height={200}
                className="w-full rounded-lg object-cover"
              />
              <button
                onClick={() => window.open(booking.paymentProofUrl, "_blank")}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
