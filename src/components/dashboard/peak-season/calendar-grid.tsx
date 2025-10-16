"use client";

import { motion } from "framer-motion";
import { formatLocalDate } from "@/lib/utils/calendar-utils";
import { PeakSeason } from "@/lib/types/inventory/peak-season-type";

interface CalendarGridProps {
  days: (Date | null)[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  getPeakStatus: (date: Date) => PeakSeason | null;
}

export default function CalendarGrid({
  days,
  selectedDate,
  onSelectDate,
  getPeakStatus,
}: CalendarGridProps) {
  const getStatusColor = (season: PeakSeason | null): string => {
    if (!season) return "bg-gray-50 text-gray-600 border-gray-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
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
        const season = getPeakStatus(day);
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
                ? "ring-2 ring-rose-500 bg-rose-50"
                : getStatusColor(season)
            } ${isToday ? "font-bold" : ""}`}
          >
            {day.getDate()}
          </motion.button>
        );
      })}
    </div>
  );
}
