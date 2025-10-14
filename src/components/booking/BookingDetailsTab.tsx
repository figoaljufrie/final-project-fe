"use client";

import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";

interface BookingDetailsTabProps {
  bookingData: {
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    notes?: string;
    items: Array<{
      id: number;
      room: {
        name: string;
      };
      unitCount: number;
      unitPrice: number;
      nights: number;
      subTotal: number;
    }>;
  };
  formatDate: (dateString: string) => string;
}

export default function BookingDetailsTab({
  bookingData,
  formatDate,
}: BookingDetailsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-3 text-lg">
            <Calendar size={22} className="text-rose-500" />
            Check-in & Check-out
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Check-in:</span>
              <p className="font-medium">{formatDate(bookingData.checkIn)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Check-out:</span>
              <p className="font-medium">{formatDate(bookingData.checkOut)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Duration:</span>
              <p className="font-medium">
                {bookingData.items[0]?.nights || 0} nights
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-3 text-lg">
            <Users size={22} className="text-rose-500" />
            Guest Information
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Number of Guests:</span>
              <p className="font-medium">{bookingData.totalGuests} guests</p>
            </div>
            {bookingData.notes && (
              <div>
                <span className="text-sm text-gray-600">Special Requests:</span>
                <p className="font-medium">{bookingData.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-6 text-lg">Room Details</h3>
        <div className="space-y-3">
          {bookingData.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50/50 border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.room.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.unitCount} unit{item.unitCount > 1 ? "s" : ""} ×{" "}
                    {item.nights} night{item.nights > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Rp {item.unitPrice.toLocaleString("id-ID")}/night
                  </p>
                  <p className="text-sm text-gray-600">
                    Subtotal: Rp {item.subTotal.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
