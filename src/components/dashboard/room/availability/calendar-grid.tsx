"use client";

import { motion } from "framer-motion";
import { RoomAvailability } from "@/lib/types/inventory/availability-types";
import { formatLocalDate } from "@/lib/utils/calendar-utils";

interface CalendarGridProps {
  days: (Date | null)[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  getAvailabilityStatus: (date: Date) => RoomAvailability | null;
}

export default function CalendarGrid({
  days,
  selectedDate,
  onSelectDate,
  getAvailabilityStatus,
}: CalendarGridProps) {
  const getStatusColor = (availability: RoomAvailability | null): string => {
    if (!availability) return "bg-gray-50 text-gray-600 border-gray-200";
    return availability.isAvailable
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="p-2 text-center text-sm font-medium text-gray-500"
        >
          {day}
        </div>
      ))}

      {days.map((day, index) => {
        if (!day) return <div key={index} className="p-2" />;
        const availability = getAvailabilityStatus(day);
        const localDateStr = formatLocalDate(day);
        const isSelected = selectedDate === localDateStr;
        const isToday = formatLocalDate(day) === formatLocalDate(new Date());

        return (
          <motion.button
            key={localDateStr}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDate(localDateStr)}
            className={`p-2 text-sm rounded-lg border transition-all ${
              isSelected
                ? "ring-2 ring-blue-500 bg-blue-50"
                : getStatusColor(availability)
            } ${isToday ? "font-bold" : ""}`}
          >
            {day.getDate()}
          </motion.button>
        );
      })}
    </div>
  );
}