"use client";

import { motion } from "framer-motion";
import { BedDouble, Pencil, Trash2 } from "lucide-react";
import type { RoomListItem } from "@/lib/types/inventory/room-type";

export default function RoomCard({ room }: { room: RoomListItem }) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <BedDouble className="w-10 h-10 text-gray-400" />
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {room.name}
          </h3>
          <p className="text-sm text-gray-600">
            Capacity: {room.capacity} guests
          </p>
          <p className="text-sm text-gray-600">
            Units: {room.totalUnits || 1}
          </p>
          <p className="text-lg font-bold text-gray-800 mt-2">
            {formatCurrency(room.basePrice)}{" "}
            <span className="text-sm text-gray-500 font-normal">/night</span>
          </p>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}