"use client";

import { motion } from "framer-motion";
import { Download, MessageCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingDetailSidebarProps {
  bookingData: {
    status: string;
    paymentMethod: string;
    paymentProofUrl?: string;
    checkIn: string;
    createdAt: string;
  };
  bookingId: string;
  showCancelModal: boolean;
  setShowCancelModal: (show: boolean) => void;
  formatDate: (dateString: string) => string;
  canReview?: boolean;
  isCheckingReview?: boolean;
}

export default function BookingDetailSidebar({
  bookingData,
  bookingId,
  setShowCancelModal,
  formatDate,
  canReview = false,
  isCheckingReview = false,
}: BookingDetailSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-[#8B7355] mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {bookingData.status === "waiting_for_payment" &&
            !bookingData.paymentProofUrl && (
              <>
                {bookingData.paymentMethod === "manual_transfer" ? (
                  <Link
                    href={`/bookings/${bookingId}/upload-payment`}
                    className="block"
                  >
                    <Button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white">
                      Upload Payment Proof
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                    onClick={() => {
                      window.location.href = `/bookings/${bookingId}/payment-pending`;
                    }}
                  >
                    Pay with Payment Gateway
                  </Button>
                )}
              </>
            )}

          <Button variant="outline" className="w-full">
            <Download size={16} className="mr-2" />
            Download Receipt
          </Button>

          <Button variant="outline" className="w-full">
            <MessageCircle size={16} className="mr-2" />
            Contact Host
          </Button>

          {/* Review Button - Only show for completed bookings that can be reviewed */}
          {bookingData.status === "completed" && (
            <>
              {isCheckingReview ? (
                <Button disabled className="w-full bg-gray-400 text-white">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Checking...
                </Button>
              ) : canReview ? (
                <Link href={`/bookings/${bookingId}/review`} className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Star size={16} className="mr-2" />
                    Write a Review
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full bg-gray-400 text-white">
                  <Star size={16} className="mr-2" />
                  Review Already Submitted
                </Button>
              )}
            </>
          )}

          {bookingData.status === "waiting_for_payment" && (
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      {/* Booking Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-[#8B7355] mb-4">Booking Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
            <div>
              <p className="text-sm font-medium">Booking Created</p>
              <p className="text-xs text-gray-500">
                {formatDate(bookingData.createdAt)}
              </p>
            </div>
          </div>

          {bookingData.status === "waiting_for_payment" && (
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium">Waiting for Payment</p>
                <p className="text-xs text-gray-500">
                  Upload proof to continue
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Check-in</p>
              <p className="text-xs text-gray-500">
                {formatDate(bookingData.checkIn)}
              </p>
            </div>
          </div>

          {/* Show completed status and review option */}
          {bookingData.status === "completed" && (
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium text-green-600">Stay Completed</p>
                <p className="text-xs text-gray-500">
                  {canReview ? "You can now write a review" : "Review already submitted"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
