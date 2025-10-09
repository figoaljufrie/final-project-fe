"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type {
  CreateRoomPayload,
  RoomImagePayload,
  RoomListItem,
} from "@/lib/types/inventory/room-type";
import { useRoomMutation } from "@/hooks/Inventory/room/use-room-mutation";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  onCreated: (room: RoomListItem) => void;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  propertyId,
  onCreated,
}: CreateRoomModalProps) {
  const [form, setForm] = useState({
    name: "",
    capacity: 1,
    basePrice: 0,
    description: "",
    totalUnits: 1,
  });
  const [images, setImages] = useState<File[]>([]);

  const { mutateAsync: createRoom, isPending } = useRoomMutation(propertyId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagePayload: RoomImagePayload[] | undefined =
      images.length > 0
        ? images.map((file, i) => ({
            file,
            altText: file.name,
            isPrimary: i === 0,
            order: i,
          }))
        : undefined;

    const payload: CreateRoomPayload = {
      ...form,
      propertyId,
      images: imagePayload,
    };

    try {
      const newRoom = await createRoom(payload);
      onCreated(newRoom);
      onClose();
      setForm({
        name: "",
        capacity: 1,
        basePrice: 0,
        description: "",
        totalUnits: 1,
      });
      setImages([]);
    } catch (err) {
      console.error("Failed to create room:", err);
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
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Room</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700"
                />
              </div>

              {/* Room Info Inputs */}
              <div className="space-y-2">
                <input
                  name="name"
                  placeholder="Room Name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded-md w-full px-3 py-2 text-sm"
                  required
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="border rounded-md w-full px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  name="basePrice"
                  placeholder="Base Price"
                  value={form.basePrice}
                  onChange={handleChange}
                  className="border rounded-md w-full px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  name="totalUnits"
                  placeholder="Total Units"
                  value={form.totalUnits}
                  onChange={handleChange}
                  className="border rounded-md w-full px-3 py-2 text-sm"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="border rounded-md w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center bg-rose-600 text-white rounded-md px-4 py-2 hover:bg-rose-700 disabled:opacity-50"
                >
                  {isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Room
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
