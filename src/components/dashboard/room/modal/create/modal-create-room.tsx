"use client";

import { useCreateRoomForm } from "@/hooks/Inventory/room/ui-state/use-create-room-form";
import type { RoomListItem } from "@/lib/types/inventory/room-type";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import CreateRoomForm from "./form-create-room";

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
  const formProps = useCreateRoomForm({ propertyId, onClose, onCreated });

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

            <CreateRoomForm {...formProps} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
