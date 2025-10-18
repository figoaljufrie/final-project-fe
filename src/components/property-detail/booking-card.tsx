"use client";

import { useState } from "react";
import { Plus, Minus, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateBooking } from "@/hooks/booking/use-create-booking";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "react-hot-toast";

interface BookingCardProps {
  selectedRooms?: Set<number>;
  rooms?: Array<{ 
    id: number; 
    name: string; 
    basePrice: number;
    calculatedPrice?: number | null;
    isAvailable?: boolean;
  }>;
  propertyId?: number;
  checkIn?: string;
  checkOut?: string;
  onCheckInChange?: (date: string) => void;
  onCheckOutChange?: (date: string) => void;
}

export default function BookingCard({
  selectedRooms = new Set(),
  rooms = [],
  propertyId,
  checkIn = "",
  checkOut = "",
  onCheckInChange,
  onCheckOutChange,
}: BookingCardProps) {
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<"manual_transfer" | "payment_gateway">("payment_gateway");
  
  const { createBooking, isCreating } = useCreateBooking();
  const { user } = useAuthStore();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const calculateTotalPrice = () => {
    return Array.from(selectedRooms).reduce((total, roomId) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return total;
      
      // Use calculated price if available and dates are selected
      const price = checkIn && checkOut && room.calculatedPrice !== null && room.calculatedPrice !== undefined
        ? room.calculatedPrice
        : room.basePrice;
      
      return total + price;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Check if any selected room is unavailable
  const hasUnavailableRooms = Array.from(selectedRooms).some(roomId => {
    const room = rooms.find(r => r.id === roomId);
    return room?.isAvailable === false;
  });

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to make a booking");
      return;
    }

    if (selectedRooms.size === 0) {
      toast.error("Please select at least one room");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (hasUnavailableRooms) {
      toast.error("One or more selected rooms are not available for the chosen dates");
      return;
    }

    if (!propertyId) {
      toast.error("Property information is missing");
      return;
    }

    // Get the first selected room (for now, we'll handle multiple rooms later)
    const roomId = Array.from(selectedRooms)[0];
    const room = rooms.find((r) => r.id === roomId);
    
    if (!room) {
      toast.error("Selected room not found");
      return;
    }

    try {
      await createBooking({
        roomId,
        checkIn,
        checkOut,
        totalGuests: guests,
        unitCount: 1,
        paymentMethod,
        notes: `Booking for ${guests} guests`,
      });
    } catch (error) {
      console.error("Booking creation failed:", error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 sticky top-24 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Book Your Stay</h3>
      </div>

      {/* Check-in/Check-out */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Check-In
          </label>
          <div className="relative">
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => onCheckInChange?.(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Check-Out
          </label>
          <div className="relative">
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => onCheckOutChange?.(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection Warning */}
      {(!checkIn || !checkOut) && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2 text-blue-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              Select dates to see accurate pricing and availability
            </p>
          </div>
        </div>
      )}

      {/* Unavailable Rooms Warning */}
      {hasUnavailableRooms && checkIn && checkOut && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-2 text-red-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium">
              Some selected rooms are not available for these dates
            </p>
          </div>
        </div>
      )}

      {/* Guests */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-3">
          Guests
        </label>
        <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 hover:bg-white transition-all duration-300">
          <span className="font-semibold text-gray-900">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGuests(guests + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Rooms Summary */}
      {selectedRooms.size > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              Selected Rooms ({selectedRooms.size})
            </div>
          </div>
          <div className="space-y-2">
            {Array.from(selectedRooms).map((roomId) => {
              const room = rooms.find((r) => r.id === roomId);
              if (!room) return null;
              
              const displayPrice = checkIn && checkOut && room.calculatedPrice !== null && room.calculatedPrice !== undefined
                ? room.calculatedPrice
                : room.basePrice;
              
              const hasPeakSeason = checkIn && checkOut && room.calculatedPrice !== null && room.calculatedPrice !== room.basePrice;
              const isUnavailable = room.isAvailable === false;
              
              return (
                <div key={roomId} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${isUnavailable ? 'text-red-600' : 'text-gray-700'}`}>
                      {room.name}
                      {isUnavailable && <span className="ml-2 text-xs">(Unavailable)</span>}
                    </span>
                    <span className="text-rose-600 font-semibold">
                      Rp {displayPrice.toLocaleString("id-ID")}/night
                    </span>
                  </div>
                  {hasPeakSeason && !isUnavailable && (
                    <div className="flex items-center gap-1 text-xs text-amber-700">
                      <span className="px-2 py-0.5 bg-amber-100 rounded-full">
                        Peak season pricing
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-3">
          Payment Method
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-rose-300 transition-all duration-200 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="payment_gateway"
              checked={paymentMethod === "payment_gateway"}
              onChange={(e) => setPaymentMethod(e.target.value as "payment_gateway")}
              className="text-rose-600 focus:ring-rose-500"
            />
            <div className="ml-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Payment Gateway (Credit Card)
              </span>
            </div>
          </label>
          <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-rose-300 transition-all duration-200 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="manual_transfer"
              checked={paymentMethod === "manual_transfer"}
              onChange={(e) => setPaymentMethod(e.target.value as "manual_transfer")}
              className="text-rose-600 focus:ring-rose-500"
            />
            <div className="ml-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Manual Transfer
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-6 py-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-700">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="text-sm text-gray-500 text-right">per night</div>
        {checkIn && checkOut && selectedRooms.size > 0 && (
          <div className="mt-2 text-xs text-gray-400 text-right">
            Prices include peak season rates if applicable
          </div>
        )}
      </div>

      {/* Book Button */}
      <Button
        onClick={handleBook}
        disabled={selectedRooms.size === 0 || !checkIn || !checkOut || isCreating || hasUnavailableRooms}
        className="w-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-rose-600 hover:via-rose-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isCreating ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
            Creating Booking...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {hasUnavailableRooms ? 'Room(s) Unavailable' : 'Book Now'}
          </div>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}