"use client";

import { motion } from "framer-motion";
import { PeakSeason } from "@/lib/types/inventory/peak-season-type";
import {
  parseLocalDate,
  formatLocalDate,
  isWithinRange,
} from "@/lib/utils/calendar-utils";
import { PriceChangeType } from "@/lib/types/enums/enums-type";

interface PeakSeasonDayInfoProps {
  selectedDate: string;
  peakSeasons: PeakSeason[];
  deleteSeason: (id: number) => void;
}

export default function PeakSeasonDayInfo({
  selectedDate,
  peakSeasons,
  deleteSeason,
}: PeakSeasonDayInfoProps) {
  const getStatusColor = (season: PeakSeason | null): string => {
    if (!season) return "bg-gray-50 text-gray-600 border-gray-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const dateObj = parseLocalDate(selectedDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t pt-4"
    >
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        Peak Seasons on{" "}
        {dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h4>

      <div className="space-y-4">
        {peakSeasons
          .filter((season) =>
            isWithinRange(
              dateObj,
              parseLocalDate(formatLocalDate(new Date(season.startDate))),
              parseLocalDate(formatLocalDate(new Date(season.endDate)))
            )
          )
          .map((season) => (
            <div
              key={season.id}
              className={`p-4 rounded-lg border ${getStatusColor(season)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">{season.name}</h5>
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
                  onClick={() => deleteSeason(season.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm mt-2 text-gray-700">
                <span className="font-medium text-blue-700">
                  {season.changeType === PriceChangeType.NOMINAL
                    ? `+Rp${season.changeValue.toLocaleString()}`
                    : `${season.changeValue}%`}
                </span>{" "}
                price adjustment
              </p>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
