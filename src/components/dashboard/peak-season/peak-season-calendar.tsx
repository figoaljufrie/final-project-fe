"use client";

import { useCalendar } from "@/hooks/Inventory/calendar/use-calendar";
import { PriceChangeType } from "@/lib/types/enums/enums-type";
import { PeakSeason } from "@/lib/types/inventory/peak-season-type";
import {
  parseLocalDate,
  formatLocalDate,
  isWithinRange,
} from "@/lib/utils/calendar-utils";
import { useState } from "react";
import { toast } from "react-hot-toast";

import CalendarGrid from "./calendar-grid";
import CalendarHeader from "./calendar-header";
import AddPeakSeasonModal from "./modal/add-peak-seson-modal";
import PeakSeasonDayInfo from "./peak-season-info";

import {
  useCreatePeakSeason,
  useDeletePeakSeason,
  useTenantPeakSeasons,
} from "@/hooks/Inventory/peak-season/use-peak-season";

export default function PeakSeasonCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: peakSeasons,
    isLoading,
    error,
    refetch,
  } = useTenantPeakSeasons();
  const createMutation = useCreatePeakSeason();
  const deleteMutation = useDeletePeakSeason();
  const calendarDays: (Date | null)[] = useCalendar(currentMonth);

  if (error) toast.error("Failed to load peak seasons");

  const getPeakStatus = (date: Date): PeakSeason | null => {
    if (!peakSeasons) return null;
    return (
      peakSeasons.find((season) => {
        const start = parseLocalDate(
          formatLocalDate(new Date(season.startDate))
        );
        const end = parseLocalDate(formatLocalDate(new Date(season.endDate)));
        return isWithinRange(date, start, end);
      }) || null
    );
  };

  if (isLoading)
    return (
      <div className="glass-card rounded-xl p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
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
        getPeakStatus={getPeakStatus}
      />
      {selectedDate && peakSeasons && (
        <PeakSeasonDayInfo
          selectedDate={selectedDate}
          peakSeasons={peakSeasons}
          deleteSeason={(id: number) =>
            deleteMutation.mutate(id, {
              onSuccess: () => {
                toast.success("Peak season deleted");
                refetch();
              },
            })
          }
        />
      )}
      <AddPeakSeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          toast.success("Peak season created");
          refetch();
        }}
        create={{
          mutate: (data, options) =>
            createMutation.mutate(
              {
                ...data,
                changeType:
                  data.changeType === "nominal"
                    ? PriceChangeType.NOMINAL
                    : PriceChangeType.PERCENTAGE,
              },
              options
            ),
        }}
      />
    </div>
  );
}
