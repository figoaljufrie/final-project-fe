"use client";

import { useRoomData } from "@/hooks/Inventory/room/ui-state/use-room-data";
import type { RoomDetail, RoomListItem } from "@/lib/types/inventory/room-type";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import RoomGallery from "../../room-gallery/room-index";
import ImageUploader from "./image-uploader";
import RoomInfoForm from "./form-info-room";

interface UpdateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  roomId: number;
  onUpdated: (room: RoomListItem | RoomDetail) => void;
  children?: React.ReactNode;
}

export default function UpdateRoomModal({
  isOpen,
  onClose,
  propertyId,
  roomId,
  onUpdated,
  children,
}: UpdateRoomModalProps) {
  const queryClient = useQueryClient();

  const {
    form,
    setForm,
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
    isSubmitting,
    setIsSubmitting,
    loading,
  } = useRoomData({ propertyId, roomId, isOpen });

  if (!isOpen) return null;

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
            className="bg-white/90 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
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
              <>
                <RoomGallery roomId={roomId} propertyId={propertyId} />

                <ImageUploader
                  propertyId={propertyId}
                  roomId={roomId}
                  existingImages={existingImages}
                  setExistingImages={setExistingImages}
                  newImages={newImages}
                  setNewImages={setNewImages}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  queryClient={queryClient}
                />

                <RoomInfoForm
                  propertyId={propertyId}
                  roomId={roomId}
                  form={form}
                  setForm={setForm}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  onUpdated={onUpdated}
                  onClose={onClose}
                  queryClient={queryClient}
                />

                {children && <div className="mt-6">{children}</div>}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}