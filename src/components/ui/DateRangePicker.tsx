"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import clsx from "clsx";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    value || { startDate: null, endDate: null }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDisplayText = () => {
    if (!selectedRange.startDate && !selectedRange.endDate) {
      return placeholder;
    }
    if (selectedRange.startDate && !selectedRange.endDate) {
      return `${formatDate(selectedRange.startDate)} - Select end date`;
    }
    if (selectedRange.startDate && selectedRange.endDate) {
      return `${formatDate(selectedRange.startDate)} - ${formatDate(
        selectedRange.endDate
      )}`;
    }
    return placeholder;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      // Start new selection
      const newRange = { startDate: clickedDate, endDate: null };
      setSelectedRange(newRange);
      onChange?.(newRange);
    } else if (selectedRange.startDate && !selectedRange.endDate) {
      // Complete the range
      if (clickedDate < selectedRange.startDate) {
        // If clicked date is before start date, swap them
        const newRange = {
          startDate: clickedDate,
          endDate: selectedRange.startDate,
        };
        setSelectedRange(newRange);
        onChange?.(newRange);
      } else {
        const newRange = {
          startDate: selectedRange.startDate,
          endDate: clickedDate,
        };
        setSelectedRange(newRange);
        onChange?.(newRange);
      }
      setIsOpen(false);
    }
  };

  const isDateInRange = (day: number) => {
    if (!selectedRange.startDate || !selectedRange.endDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return (
      (selectedRange.startDate &&
        date.getTime() === selectedRange.startDate.getTime()) ||
      (selectedRange.endDate &&
        date.getTime() === selectedRange.endDate.getTime())
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(day);
      const isInRange = isDateInRange(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={clsx(
            "p-2 text-sm rounded-lg transition-all duration-200 hover:bg-rose-100 font-medium",
            isSelected && "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
            isInRange && !isSelected && "bg-rose-100 text-rose-700",
            !isSelected &&
              !isInRange &&
              "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={clsx("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 hover:shadow-md"
      >
        <span
          className={clsx(
            "text-sm font-medium",
            selectedRange.startDate || selectedRange.endDate
              ? "text-gray-900"
              : "text-gray-500"
          )}
        >
          {formatDisplayText()}
        </span>
        <Calendar className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 min-w-[320px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-rose-50 rounded-lg transition-colors group"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-rose-50 rounded-lg transition-colors group"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div
                key={day}
                className="p-2 text-xs font-semibold text-gray-600 text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedRange({ startDate: null, endDate: null });
                onChange?.({ startDate: null, endDate: null });
              }}
              className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
