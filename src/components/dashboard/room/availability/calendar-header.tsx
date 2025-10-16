"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onNavigate: (month: Date) => void;
  onAdd: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onNavigate,
  onAdd,
}: CalendarHeaderProps) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const next = new Date(currentMonth);
    next.setMonth(currentMonth.getMonth() + (direction === "next" ? 1 : -1));
    onNavigate(next);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        Room Availability Calendar
      </h3>

      <div className="flex items-center space-x-2">
        <button
          onClick={onAdd}
          className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
        >
          <Plus className="h-4 w-4 mr-1" /> Set Availability
        </button>

        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium min-w-[120px] text-center">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}