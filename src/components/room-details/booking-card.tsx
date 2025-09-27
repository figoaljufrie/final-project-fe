// app/components/room-details/booking-card.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function BookingCard() {
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  const [showCalendar, setShowCalendar] = useState<'checkIn' | 'checkOut' | null>(null);

  const pricePerNight = 320;
  const nights = 5; // This would be calculated based on selected dates
  const serviceFee = 50;
  const taxes = 25;
  const totalPrice = (pricePerNight * nights) + serviceFee + taxes;

  const handleGuestChange = (increment: boolean) => {
    setBookingData(prev => ({
      ...prev,
      guests: increment 
        ? Math.min(prev.guests + 1, 8) 
        : Math.max(prev.guests - 1, 1)
    }));
  };

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = firstDay.getDay(); // Day of week for first day
    const daysInMonth = lastDay.getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const currentMonth = monthNames[currentDate.getMonth()];
  const nextMonth = monthNames[(currentDate.getMonth() + 1) % 12];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-lg border border-[#D6D5C9] p-6 sticky top-6"
    >
      {/* Price Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-[#8B7355]">${pricePerNight}</span>
          <span className="text-gray-500"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium">4.9</span>
          <span className="text-gray-500 text-sm">(128)</span>
        </div>
      </div>

      {/* Check-in/Check-out */}
      <div className="border border-[#D6D5C9] rounded-lg mb-4">
        <div className="grid grid-cols-2">
          {/* Check-in */}
          <button
            onClick={() => setShowCalendar(showCalendar === 'checkIn' ? null : 'checkIn')}
            className="p-3 text-left border-r border-[#D6D5C9] hover:bg-gray-50 transition-colors"
          >
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Check-in</div>
            <div className="text-sm text-gray-800 mt-1">
              {bookingData.checkIn || 'Add date'}
            </div>
          </button>

          {/* Check-out */}
          <button
            onClick={() => setShowCalendar(showCalendar === 'checkOut' ? null : 'checkOut')}
            className="p-3 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Check-out</div>
            <div className="text-sm text-gray-800 mt-1">
              {bookingData.checkOut || 'Add date'}
            </div>
          </button>
        </div>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-[#D6D5C9] p-4 bg-white"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Current Month */}
              <div>
                <h4 className="font-medium text-center mb-3">{currentMonth} 2025</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center p-1 font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      disabled={!day}
                      className={`text-center p-1 text-sm rounded hover:bg-[#8B7355] hover:text-white transition-colors ${
                        !day ? 'invisible' : ''
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Month */}
              <div>
                <h4 className="font-medium text-center mb-3">{nextMonth} 2025</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center p-1 font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      disabled={!day}
                      className={`text-center p-1 text-sm rounded hover:bg-[#8B7355] hover:text-white transition-colors ${
                        !day ? 'invisible' : ''
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Guests */}
      <div className="border border-[#D6D5C9] rounded-lg mb-6">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Guests</div>
              <div className="text-sm text-gray-800 mt-1">{bookingData.guests} guests</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGuestChange(false)}
                disabled={bookingData.guests <= 1}
                className="w-8 h-8 rounded-full border border-[#D6D5C9] flex items-center justify-center hover:border-[#8B7355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-medium">{bookingData.guests}</span>
              <button
                onClick={() => handleGuestChange(true)}
                disabled={bookingData.guests >= 8}
                className="w-8 h-8 rounded-full border border-[#D6D5C9] flex items-center justify-center hover:border-[#8B7355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reserve Button */}
      <Button 
        size="lg"
        className="w-full mb-4 bg-[#8B7355] hover:bg-[#7A6349] text-white"
      >
        Reserve
      </Button>

      <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-6 border-t border-[#D6D5C9]">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">${pricePerNight} × {nights} nights</span>
          <span className="text-gray-700">${pricePerNight * nights}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 underline cursor-pointer">Service fee</span>
          <span className="text-gray-700">${serviceFee}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 underline cursor-pointer">Taxes</span>
          <span className="text-gray-700">${taxes}</span>
        </div>
        
        <div className="flex justify-between font-semibold text-lg pt-3 border-t border-[#D6D5C9]">
          <span>Total</span>
          <span className="text-[#8B7355]">${totalPrice}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-[#D6D5C9]">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <CalendarDays size={16} className="mt-0.5 flex-shrink-0" />
          <span>Free cancellation before 48 hours of check-in</span>
        </div>
        
        <div className="flex items-start gap-3 text-sm text-gray-600 mt-3">
          <Users size={16} className="mt-0.5 flex-shrink-0" />
          <span>This is a rare find - this property is highly rated</span>
        </div>
      </div>
    </motion.div>
  );
}