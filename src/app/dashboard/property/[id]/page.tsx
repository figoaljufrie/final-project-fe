"use client";

import PropertyHeroSection from "@/components/dashboard/property/property-hero-section";
import CreateRoomModal from "@/components/dashboard/room/modal/create/modal-create-room";
import UpdateRoomModal from "@/components/dashboard/room/modal/update/modal-update-room";
import RoomCard from "@/components/dashboard/room/room-card";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";
import { usePropertyDetail } from "@/hooks/Inventory/property/query/use-property-detail";
import { useRooms } from "@/hooks/Inventory/room/query/use-rooms";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const propertyId = Number(id);

  const { data: property, isLoading: propertyLoading } =
    usePropertyDetail(propertyId);
  const { data: rooms, isLoading: roomsLoading, refetch: refetchRooms } = useRooms(propertyId);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  if (propertyLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading property details"
        subMessage="Please wait while we fetch property information..."
      />
    );
  }
  if (!property) return <p>Property not found.</p>;

  const handleRoomEdit = (roomId: number) => {
    setSelectedRoomId(roomId);
    setUpdateModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      {/* 🏠 Property Section */}
      <PropertyHeroSection property={property} onUpdated={() => {}} />

      {/* 🛏 Room Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Rooms</h2>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 px-4 py-2"
          >
            Add Room
          </button>
        </div>

        {roomsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 text-sm">Loading rooms...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms?.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                propertyId={propertyId}
                onEdit={() => handleRoomEdit(room.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🧩 Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        propertyId={propertyId}
        onCreated={() => {
          setCreateModalOpen(false);
          refetchRooms(); // refresh the list after creating a new room
        }}
      />

      {/* 🧩 Update Room Modal */}
      {selectedRoomId && (
        <UpdateRoomModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          propertyId={propertyId}
          roomId={selectedRoomId}
          onUpdated={() => {
            setUpdateModalOpen(false);
            refetchRooms(); // refresh the list after updating a room
          }}
        />
      )}
    </motion.div>
  );
}