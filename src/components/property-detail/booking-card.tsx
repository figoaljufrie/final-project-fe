"use client";

import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateBooking } from "@/hooks/booking/use-create-booking";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "react-hot-toast";

interface BookingCardProps {
  selectedRooms?: Set<number>;
  rooms?: Array<{ id: number; name: string; basePrice: number }>;
  propertyId?: number;
}

export default function BookingCard({
  selectedRooms = new Set(),
  rooms = [],
  propertyId,
}: BookingCardProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<"manual_transfer" | "payment_gateway">("payment_gateway");
  
  const { createBooking, isCreating } = useCreateBooking();
  const { user } = useAuthStore();

  const calculateTotalPrice = () => {
    return Array.from(selectedRooms).reduce((total, roomId) => {
      const room = rooms.find((r) => r.id === roomId);
      return total + (room?.basePrice || 0);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

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
        unitCount: 1, // For now, assume 1 unit per room
        paymentMethod,
        notes: `Booking for ${guests} guests`,
      });
    } catch (error) {
      console.error("Booking creation failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-[#D6D5C9] p-6 sticky top-24">
      <h3 className="text-xl font-bold text-[#8B7355] mb-4">Room Price</h3>

      {/* Check-in/Check-out */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-600 font-medium block mb-1">
            Check-In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-[#D6D5C9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B7355]"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 font-medium block mb-1">
            Check-Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-[#D6D5C9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8B7355]"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="text-xs text-gray-600 font-medium block mb-2">
          Guests
        </label>
        <div className="flex items-center justify-between border border-[#D6D5C9] rounded px-4 py-2">
          <span className="font-medium">{guests}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              className="w-8 h-8 rounded-full border border-[#D6D5C9] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGuests(guests + 1)}
              className="w-8 h-8 rounded-full border border-[#D6D5C9] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Rooms Summary */}
      {selectedRooms.size > 0 && (
        <div className="mb-4 p-3 bg-[#F2EEE3] rounded">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Selected Rooms ({selectedRooms.size})
          </div>
          {Array.from(selectedRooms).map((roomId) => {
            const room = rooms.find((r) => r.id === roomId);
            if (!room) return null;
            return (
              <div
                key={roomId}
                className="text-xs text-gray-600 flex justify-between"
              >
                <span>{room.name}</span>
                <span>${room.basePrice}/night</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Payment Method
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="payment_gateway"
              checked={paymentMethod === "payment_gateway"}
              onChange={(e) => setPaymentMethod(e.target.value as "payment_gateway")}
              className="text-[#8B7355] focus:ring-[#8B7355]"
            />
            <span className="text-sm">Payment Gateway (Credit Card)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="manual_transfer"
              checked={paymentMethod === "manual_transfer"}
              onChange={(e) => setPaymentMethod(e.target.value as "manual_transfer")}
              className="text-[#8B7355] focus:ring-[#8B7355]"
            />
            <span className="text-sm">Manual Transfer</span>
          </label>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-4 py-3 border-t border-[#D6D5C9]">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-[#8B7355]">
            Rp {totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="text-xs text-gray-500 text-right">per night</div>
      </div>

      {/* Book Button */}
      <Button
        onClick={handleBook}
        disabled={selectedRooms.size === 0 || !checkIn || !checkOut || isCreating}
        className="w-full bg-[#8B7355] text-white py-3 rounded-lg font-semibold hover:bg-[#7A6349] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Creating Booking...
          </>
        ) : (
          "Book!"
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-3">
        You wont be charged yet
      </p>
    </div>
  );
}
