"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import {
  listsRoomsByProperty,
  updateRoom,
} from "@/lib/services/Inventory/room/room-service";
import type {
  UpdateRoomPayload,
  RoomListItem,
  RoomImagePayload,
} from "@/lib/types/inventory/room-type";

interface UpdateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  roomId: number;
  onUpdated: (room: RoomListItem) => void;
}

export default function UpdateRoomModal({
  isOpen,
  onClose,
  propertyId,
  roomId,
  onUpdated,
}: UpdateRoomModalProps) {
  const [form, setForm] = useState<{
    name: string;
    capacity: number;
    basePrice: number;
    description: string;
    totalUnits: number;
  }>({
    name: "",
    capacity: 1,
    basePrice: 0,
    description: "",
    totalUnits: 1,
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId || !propertyId || !isOpen) return;
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const rooms: RoomListItem[] = await listsRoomsByProperty(propertyId);
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        setForm({
          name: room.name,
          capacity: room.capacity,
          basePrice: room.basePrice,
          description: room.description || "",
          totalUnits: room.totalUnits,
        });
      } catch (err) {
        console.error("Failed to fetch room details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, propertyId, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "totalUnits" || name === "basePrice"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: UpdateRoomPayload = { ...form };
      const imagePayload: RoomImagePayload[] | undefined =
        images.length > 0
          ? images.map((file, i) => ({
              file,
              altText: file.name,
              isPrimary: i === 0,
              order: i,
            }))
          : undefined;

      const updatedRoom = await updateRoom(
        propertyId,
        roomId,
        payload,
        imagePayload
      );
      onUpdated(updatedRoom);
      onClose();
    } catch (err) {
      console.error("Failed to update room:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Update Room</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700"
                />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  required
                  placeholder="Name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min={1}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                    placeholder="Capacity"
                  />
                  <input
                    type="number"
                    name="totalUnits"
                    value={form.totalUnits}
                    onChange={handleChange}
                    min={1}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    required
                    placeholder="Units"
                  />
                </div>

                <input
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleChange}
                  min={0}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  required
                  placeholder="Base Price"
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  placeholder="Description"
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center bg-rose-600 text-white rounded-md px-4 py-2 hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Update Room
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
