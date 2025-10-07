"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, BedDouble, AlertTriangle } from "lucide-react";
import RoomCard from "@/components/dashboard/room/room-card";
import CreateRoomModal from "@/components/dashboard/room/room-create-modal";
import { useRooms } from "@/hooks/Inventory/room/use-rooms";
import type { RoomListItem } from "@/lib/types/inventory/room-type";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const propertyId = Number(id);
  const { data: rooms, isLoading, isError } = useRooms(propertyId);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleRoomCreated = (newRoom: RoomListItem) => {
    // optional local update if needed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Rooms</h1>
          <p className="text-gray-600 mt-1">
            Manage all rooms under this property.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 px-4 py-2"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Room
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-card p-8 text-center rounded-xl">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Failed to load rooms. Please try again later.
          </p>
        </div>
      ) : !rooms || rooms.length === 0 ? (
        <div className="text-center glass-card rounded-xl p-12 border-2 border-dashed border-gray-300">
          <BedDouble className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            No rooms found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add your first room for this property.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Create Room
          </button>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </motion.div>
      )}

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        propertyId={propertyId}
        onCreated={handleRoomCreated}
      />
    </motion.div>
  );
}
