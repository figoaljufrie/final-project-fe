"use client";

import { motion } from "framer-motion";
import { RoomAvailability } from "@/lib/types/inventory/availability-types";

interface AvailabilityDayInfoProps {
  selectedDate: string;
  availability: RoomAvailability | null;
}

export default function AvailabilityDayInfo({
  selectedDate,
  availability,
}: AvailabilityDayInfoProps) {
  const dateObj = new Date(selectedDate);

  const statusColor = availability
    ? availability.isAvailable
      ? "text-green-700"
      : "text-red-700"
    : "text-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t pt-4"
    >
      <h4 className="text-md font-semibold text-gray-900 mb-3">
        Availability on{" "}
        {dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h4>

      {availability ? (
        <div
          className={`p-4 rounded-lg border ${
            availability.isAvailable
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p className={`font-medium ${statusColor}`}>
            {availability.isAvailable ? "Available" : "Unavailable"}
          </p>
          {availability.customPrice && (
            <p className="text-sm text-gray-700 mt-1">
              Custom Price: Rp{availability.customPrice.toLocaleString()}
            </p>
          )}
          {availability.reason && (
            <p className="text-sm text-gray-700 mt-1">
              Reason: {availability.reason}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No availability data yet.</p>
      )}
    </motion.div>
  );
}