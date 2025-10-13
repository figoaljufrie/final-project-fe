"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTenantPeakSeasons } from "@/hooks/Inventory/pricing/peak-season/use-peakseasons";
import { usePeakMutations } from "@/hooks/Inventory/pricing/peak-season/use-peakseason-mutation";
import { PeakSeason } from "@/lib/types/inventory/pricing-type";
import { useCalendar } from "@/hooks/Inventory/pricing/use-calendar";
import {
  formatLocalDate,
  parseLocalDate,
  isWithinRange,
} from "@/lib/utils/calendar-utils";
import CalendarHeader from "./calendar-header";
import AddPeakSeasonModal from "./add-peak-seson-modal";

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

  const { create, remove } = usePeakMutations();

  const calendarDays = useCalendar(currentMonth);

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

  const getStatusColor = (season: PeakSeason | null): string => {
    if (!season) return "bg-gray-50 text-gray-600 border-gray-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <CalendarHeader
        currentMonth={currentMonth}
        onNavigate={setCurrentMonth}
        onAdd={() => setIsModalOpen(true)}
      />

      {/* --- Calendar Grid --- */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
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
              onClick={() => setSelectedDate(localDateStr)}
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

      {/* --- Selected Day Info --- */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-4"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Peak Seasons on{" "}
            {parseLocalDate(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>

          <div className="space-y-4">
            {peakSeasons
              ?.filter((season: PeakSeason) => {
                const start = parseLocalDate(
                  formatLocalDate(new Date(season.startDate))
                );
                const end = parseLocalDate(
                  formatLocalDate(new Date(season.endDate))
                );
                const date = parseLocalDate(selectedDate);
                return isWithinRange(date, start, end);
              })
              .map((season: PeakSeason) => (
                <div
                  key={season.id}
                  className={`p-4 rounded-lg border ${getStatusColor(season)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {season.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {parseLocalDate(
                          formatLocalDate(new Date(season.startDate))
                        ).toLocaleDateString()}{" "}
                        –{" "}
                        {parseLocalDate(
                          formatLocalDate(new Date(season.endDate))
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        remove.mutate(season.id, {
                          onSuccess: () => {
                            toast.success("Peak season deleted");
                            refetch();
                          },
                        })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Display change type and value */}
                  <p className="text-sm mt-2 text-gray-700">
                    <span className="font-medium text-blue-700">
                      {season.changeType === "nominal"
                        ? `+Rp${season.changeValue.toLocaleString()}`
                        : `${season.changeValue}%`}
                    </span>{" "}
                    price adjustment
                  </p>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* --- Add Modal --- */}
      <AddPeakSeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          toast.success("Peak season created");
          refetch();
        }}
        // @ts-expect-error - Type mismatch between usePeakMutations and CreateMutation
        create={create}
      />
    </div>
  );
}
