"use client";

import { motion } from "framer-motion";
import { CreditCard, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface BookingPaymentTabProps {
  bookingData: {
    paymentMethod: string;
    totalAmount: number;
    status: string;
    paymentDeadline?: string;
    paymentProofUrl?: string;
  };
  bookingId: string;
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  getDeadlineText: (method: string) => string;
  getDeadlineMessage: (method: string) => string;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export default function BookingPaymentTab({
  bookingData,
  bookingId,
  setShowPaymentModal,
  getDeadlineText,
  getDeadlineMessage,
  formatDate,
  formatTime,
}: BookingPaymentTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-3 text-lg">
            <CreditCard size={22} className="text-rose-500" />
            Payment Method
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Method:</span>
              <p className="font-medium capitalize">
                {bookingData.paymentMethod.replace("_", " ")}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Total Amount:</span>
              <p className="font-medium text-lg">
                Rp {bookingData.totalAmount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-3 text-lg">
            <Clock size={22} className="text-rose-500" />
            Payment Status
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <p className="font-medium capitalize">
                {bookingData.status.replace("_", " ")}
              </p>
            </div>
            {bookingData.paymentDeadline && (
              <div>
                <span className="text-sm text-gray-600">Payment Deadline:</span>
                <p className="font-medium">
                  {formatDate(bookingData.paymentDeadline)} at{" "}
                  {formatTime(bookingData.paymentDeadline)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ({getDeadlineText(bookingData.paymentMethod)} from booking
                  creation)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {bookingData.paymentProofUrl && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-6 text-lg">Payment Proof</h3>
          <div className="bg-gray-50/50 border border-gray-200/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Image
                src={bookingData.paymentProofUrl}
                alt="Payment Proof"
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  console.error("Failed to load payment proof image:", e);
                }}
              />
              <div className="flex-1">
                <p className="font-medium">Payment proof uploaded</p>
                <p className="text-sm text-gray-600">
                  Waiting for verification
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {bookingData.status === "waiting_for_payment" &&
        !bookingData.paymentProofUrl && (
          <div className="pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg">
                Complete Your Payment
              </h4>

              {bookingData.paymentMethod === "manual_transfer" ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {getDeadlineMessage(bookingData.paymentMethod)}
                  </p>
                  <Link href={`/bookings/${bookingId}/upload-payment`}>
                    <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Upload Payment Proof
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {getDeadlineMessage(bookingData.paymentMethod)}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      window.location.href = `/bookings/${bookingId}/payment-pending`;
                    }}
                  >
                    Pay with Payment Gateway
                  </Button>
                </div>
              )}

              {/* Alternative Payment Method */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Want to use a different payment method?
                </p>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Change Payment Method
                </Button>
              </div>
            </div>
          </div>
        )}
    </motion.div>
  );
}
