"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  selectedRooms?: Set<number>;
  rooms?: Array<{ id: number; name: string; basePrice: number }>;
}

export default function BookingCard({
  selectedRooms = new Set(),
  rooms = [],
}: BookingCardProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const calculateTotalPrice = () => {
    return Array.from(selectedRooms).reduce((total, roomId) => {
      const room = rooms.find((r) => r.id === roomId);
      return total + (room?.basePrice || 0);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

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

      {/* Total Price */}
      <div className="mb-4 py-3 border-t border-[#D6D5C9]">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-[#8B7355]">
            ${totalPrice}
          </span>
        </div>
        <div className="text-xs text-gray-500 text-right">per night</div>
      </div>

      {/* Book Button */}
      <Button
        disabled={selectedRooms.size === 0 || !checkIn || !checkOut}
        className="w-full bg-[#8B7355] text-white py-3 rounded-lg font-semibold hover:bg-[#7A6349] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book!
      </Button>

      <p className="text-xs text-gray-500 text-center mt-3">
        You wont be charged yet
      </p>
    </div>
  );
}
