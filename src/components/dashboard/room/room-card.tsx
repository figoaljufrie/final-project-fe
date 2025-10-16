"use client";

import type { RoomListItem } from "@/lib/types/inventory/room-type";
import { motion } from "framer-motion";
import { BedDouble, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AvailabilityCalendar from "./availability/availability-calendar";
import UpdateRoomModal from "./modal/update/modal-update-room";

interface RoomCardProps {
  room: RoomListItem;
  propertyId: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RoomCard({
  room,
  propertyId,
  onDelete,
}: RoomCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <>
      <motion.div
        className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="h-40 bg-gray-200 flex items-center justify-center relative">
          {room.image ? (
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 33vw"
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
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal with room details + calendar */}
      {isModalOpen && (
        <UpdateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
          roomId={room.id}
          onUpdated={() => {}}
        >
          <div className="mt-6">
            <AvailabilityCalendar propertyId={propertyId} roomId={room.id} />
          </div>
        </UpdateRoomModal>
      )}
    </>
  );
}
