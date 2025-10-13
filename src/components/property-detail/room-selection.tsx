"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import Image from "next/image";
import { useRoomsByProperty } from "@/hooks/Inventory/room/use-selected-room";

interface RoomSelectionProps {
  propertyId: number;
  selectedRooms: Set<number>;
  setSelectedRooms: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export default function RoomSelection({
  propertyId,
  selectedRooms,
  setSelectedRooms,
}: RoomSelectionProps) {
  const {
    rooms: fetchedRooms,
    loading,
    error,
  } = useRoomsByProperty(propertyId);

  const rooms = useMemo(() => {
    return fetchedRooms.map((room) => ({
      ...room,
      available: true,
      image: room.image || "https://via.placeholder.com/300",
    }));
  }, [fetchedRooms]);

  const toggleRoomSelection = (roomId: number) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomId)) newSelected.delete(roomId);
    else newSelected.add(roomId);
    setSelectedRooms(newSelected);
  };

  if (loading) return <p className="text-gray-500">Loading rooms...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!rooms.length)
    return <p className="text-gray-500">No rooms available.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => room.available && toggleRoomSelection(room.id)}
          disabled={!room.available}
          className={`relative bg-white rounded-lg overflow-hidden border-2 transition-all ${
            selectedRooms.has(room.id)
              ? "border-[#8B7355] shadow-lg"
              : "border-[#D6D5C9] hover:border-[#8B7355]/50"
          } ${
            !room.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {/* Selection Indicator */}
          <div className="absolute top-3 right-3 z-10">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedRooms.has(room.id)
                  ? "bg-[#8B7355] border-[#8B7355]"
                  : "bg-white border-gray-300"
              }`}
            >
              {selectedRooms.has(room.id) && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Room Image */}
          <div className="aspect-video relative">
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {!room.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Unavailable</span>
              </div>
            )}
          </div>

          {/* Room Info */}
          <div className="p-4 text-left">
            <h3 className="font-semibold text-[#8B7355] mb-2">{room.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Users className="w-4 h-4" />
              <span>{room.capacity} guests</span>
            </div>
            <div className="text-lg font-bold text-[#8B7355]">
              ${room.basePrice}
              <span className="text-sm font-normal text-gray-600">/night</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
