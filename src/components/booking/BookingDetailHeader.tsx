"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
        return "DIPROSES";
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
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={
                property?.images[0]?.url ||
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={property?.name || "Property"}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="absolute -top-2 -right-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  bookingData.status
                )}`}
              >
                {getStatusIcon(bookingData.status)}
                {getStatusLabel(bookingData.status)}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#8B7355]">
              {property?.name || "Property"}
            </h1>
            <p className="text-gray-600">
              {property?.address || "Address not available"}
            </p>
            <p className="text-sm text-gray-500">
              Booking #{bookingData.bookingNo}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-[#8B7355]">
            Rp {bookingData.totalAmount.toLocaleString("id-ID")}
          </div>
          <p className="text-sm text-gray-600">Total Amount</p>
        </div>
      </div>
    </motion.div>
  );
}
