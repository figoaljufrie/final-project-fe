"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCalendar } from "@/hooks/Inventory/calendar/use-calendar";
import { formatLocalDate } from "@/lib/utils/calendar-utils";
import { useRoomAvailability } from "@/hooks/Inventory/availability/use-availability"
import CalendarHeader from "./calendar-header";
import CalendarGrid from "./calendar-grid";
import AvailabilityDayInfo from "./availability-day-info";
import SetAvailabilityModal from "./modal/set-availability-modal";

interface AvailabilityCalendarProps {
  propertyId: number;
  roomId: number;
}

export default function AvailabilityCalendar({
  propertyId,
  roomId,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { useAvailabilityRange, useAvailabilityByDate, updateAvailability } =
    useRoomAvailability({ propertyId, roomId });

  const calendarDays = useCalendar(currentMonth);
  const from = formatLocalDate(calendarDays[0] ?? new Date());
  const to = formatLocalDate(calendarDays[calendarDays.length - 1] ?? new Date());

  const {
    data: availabilityRange,
    isLoading,
    error,
    refetch,
  } = useAvailabilityRange(from, to);

  const { data: selectedAvailability } = useAvailabilityByDate(selectedDate);

  const getAvailabilityStatus = (date: Date) => {
    if (!availabilityRange) return null;
    const target = formatLocalDate(date);
    return (
      availabilityRange.find(
        (a) => formatLocalDate(new Date(a.date)) === target
      ) || null
    );
  };

  if (error) toast.error("Failed to load availability");

  if (isLoading)
    return (
      <div className="glass-card rounded-xl p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <CalendarHeader
        currentMonth={currentMonth}
        onNavigate={setCurrentMonth}
        onAdd={() => setIsModalOpen(true)}
      />
      <CalendarGrid
        days={calendarDays}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        getAvailabilityStatus={getAvailabilityStatus}
      />

      {selectedDate && (
        <AvailabilityDayInfo
          selectedDate={selectedDate}
          availability={selectedAvailability ?? null}
        />
      )}

      <SetAvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate || formatLocalDate(new Date())}
        onSubmit={(data) =>
          updateAvailability.mutate(data, {
            onSuccess: () => {
              toast.success("Availability updated");
              refetch();
            },
          })
        }
      />
    </div>
  );
}