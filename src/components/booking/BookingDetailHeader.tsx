"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BookingDetailHeaderProps {
  bookingData: {
    bookingNo: string;
    totalAmount: number;
    status: string;
    items: Array<{
      room: {
        property: {
          name: string;
          address: string;
          images: Array<{ url: string }>;
        };
      };
    }>;
  };
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function BookingDetailHeader({
  bookingData,
  getStatusColor,
  getStatusIcon,
}: BookingDetailHeaderProps) {
  const property = bookingData.items[0]?.room?.property;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "CONFIRMED";
      case "waiting_for_payment":
        return "WAITING FOR PAYMENT";
      case "waiting_for_confirmation":
        return "WAITING FOR CONFIRMATION";
      case "cancelled":
        return "CANCELLED";
      case "expired":
        return "EXPIRED";
      case "completed":
        return "COMPLETED";
      default:
        return status.replace("_", " ").toUpperCase();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={
                property?.images[0]?.url ||
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={property?.name || "Property"}
              width={100}
              height={100}
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute -top-3 -right-3">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-lg ${getStatusColor(
                  bookingData.status
                )}`}
              >
                {getStatusIcon(bookingData.status)}
                {getStatusLabel(bookingData.status)}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {property?.name || "Property"}
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-1">
              {property?.address || "Address not available"}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Booking #{bookingData.bookingNo}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1">
            Rp {bookingData.totalAmount.toLocaleString("id-ID")}
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Amount</p>
        </div>
      </div>
    </motion.div>
  );
}
