"use client";

import { ClockIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Booking } from "@/lib/types/bookings/booking";

interface BookingStatsCardsProps {
  bookings: Booking[] | any[];
}

export default function BookingStatsCards({ bookings }: BookingStatsCardsProps) {
  return (
    <div className="glass-card rounded-2xl p-8 mb-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Transaction Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Feature 2: Handle booking confirmations, payment processing, and transaction management
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'waiting_for_confirmation').length}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Confirmed</p>
              <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
            </div>
            <CheckIcon className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm">Revenue</p>
              <p className="text-2xl font-bold">Rp {(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / 1000000).toFixed(1)}M</p>
            </div>
            <svg className="h-8 w-8 text-rose-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
