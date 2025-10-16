"use client";

import { useState } from "react";
import type {
  CreateRoomPayload,
  RoomImagePayload,
  RoomListItem,
} from "@/lib/types/inventory/room-type";
import { useRoomMutation } from "../mutations/use-room-mutation";
interface UseCreateRoomFormArgs {
  propertyId: number;
  onClose: () => void;
  onCreated: (room: RoomListItem) => void;
}

export function useCreateRoomForm({
  propertyId,
  onClose,
  onCreated,
}: UseCreateRoomFormArgs) {
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

  return {
    form,
    images,
    isPending,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}

export type CreateRoomFormProps = ReturnType<typeof useCreateRoomForm>;