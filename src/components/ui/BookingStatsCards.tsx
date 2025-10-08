"use client";

import { ClockIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Booking } from "@/lib/types/bookings/booking";

interface BookingStatsCardsProps {
  bookings: Booking[] | any[];
}

export default function BookingStatsCards({
  bookings,
}: BookingStatsCardsProps) {
  return (
    <div className="glass-card rounded-2xl p-8 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Waiting Confirmation</p>
              <p className="text-2xl font-bold">
                {
                  bookings.filter(
                    (b) => b.status === "waiting_for_confirmation"
                  ).length
                }
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Confirmed</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <CheckIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
