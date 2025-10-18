"use client";

import { useMemo } from "react";
import { Users, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface RoomSelectionProps {
  propertyId: number;
  selectedRooms: Set<number>;
  setSelectedRooms: React.Dispatch<React.SetStateAction<Set<number>>>;
  checkIn?: string;
  checkOut?: string;
  roomsData?: any[];
}

export default function RoomSelection({
  propertyId,
  selectedRooms,
  setSelectedRooms,
  checkIn,
  checkOut,
  roomsData = [],
}: RoomSelectionProps) {
  const rooms = useMemo(() => {
    return roomsData.map((room) => {
      const hasDateRange = checkIn && checkOut;

      // Determine availability status
      let availabilityStatus = "unknown";
      let availableUnits = room.totalUnits || 1;

      if (hasDateRange) {
        if (room.isAvailable === false) {
          availabilityStatus = "unavailable";
          availableUnits = 0;
        } else if (room.isAvailable === true) {
          availabilityStatus = "available";
          // Calculate available units based on booked units if provided
          availableUnits = room.totalUnits - (room.bookedUnits || 0);
        }
      }

      return {
        ...room,
        available: availabilityStatus !== "unavailable" && availableUnits > 0,
        availabilityStatus,
        availableUnits,
        displayPrice:
          hasDateRange && room.calculatedPrice !== null
            ? room.calculatedPrice
            : room.basePrice,
        hasPeakSeason:
          hasDateRange &&
          room.calculatedPrice !== null &&
          room.calculatedPrice !== room.basePrice,
        image:
          room.images?.[0]?.url ||
          room.image ||
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&h=200&fit=crop&crop=center",
      };
    });
  }, [roomsData, checkIn, checkOut]);

  const toggleRoomSelection = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room?.available) return;

    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomId)) newSelected.delete(roomId);
    else newSelected.add(roomId);
    setSelectedRooms(newSelected);
  };

  if (rooms.length === 0) {
    return <p className="text-gray-500">No rooms available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rooms.map((room) => {
        const hasDateRange = checkIn && checkOut;

        return (
          <button
            key={room.id}
            onClick={() => room.available && toggleRoomSelection(room.id)}
            disabled={!room.available}
            className={`relative bg-white rounded-xl overflow-hidden border-2 transition-all ${
              selectedRooms.has(room.id)
                ? "border-rose-500 shadow-lg ring-2 ring-rose-200"
                : "border-gray-200 hover:border-rose-300 hover:shadow-md"
            } ${
              !room.available
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {/* Selection Indicator */}
            <div className="absolute top-3 right-3 z-10">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                  selectedRooms.has(room.id)
                    ? "bg-rose-500 border-rose-500"
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

            {/* Availability Badge */}
            {hasDateRange && (
              <div className="absolute top-3 left-3 z-10">
                {room.availabilityStatus === "available" ? (
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    <CheckCircle className="w-3 h-3" />
                    <span>Available</span>
                  </div>
                ) : room.availabilityStatus === "unavailable" ? (
                  <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    <XCircle className="w-3 h-3" />
                    <span>Unavailable</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    <AlertCircle className="w-3 h-3" />
                    <span>Select Dates</span>
                  </div>
                )}
              </div>
            )}

            {/* Room Image */}
            <div className="aspect-video relative">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {!room.available && hasDateRange && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center text-white">
                    <XCircle className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-semibold text-sm">Not Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="p-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {room.name}
              </h3>

              {/* Capacity */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                <span>{room.capacity} guests</span>
                {hasDateRange && room.available && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-green-600 font-medium">
                      {room.availableUnits}{" "}
                      {room.availableUnits === 1 ? "unit" : "units"} left
                    </span>
                  </>
                )}
              </div>

              {/* Price Display */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  {room.hasPeakSeason && (
                    <span className="text-sm text-gray-400 line-through">
                      Rp {room.basePrice?.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-rose-600">
                      Rp {room.displayPrice?.toLocaleString("id-ID")}
                      <span className="text-sm font-normal text-gray-600">
                        /night
                      </span>
                    </div>
                    {room.hasPeakSeason && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                          Peak Season Applied
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Units Info (always visible) */}
              {!hasDateRange && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Units:</span>{" "}
                    {room.totalUnits || 1}
                  </div>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
