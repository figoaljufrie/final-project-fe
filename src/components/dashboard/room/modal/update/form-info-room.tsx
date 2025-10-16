import { Loader2 } from "lucide-react";
import { updateRoom } from "@/lib/services/Inventory/room/room-service";
import type {
  UpdateRoomPayload,
  RoomListItem,
  RoomDetail,
} from "@/lib/types/inventory/room-type";
import { QueryClient } from "@tanstack/react-query";

interface Props {
  propertyId: number;
  roomId: number;
  form: {
    name: string;
    capacity: number;
    basePrice: number;
    description: string;
    totalUnits: number;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      capacity: number;
      basePrice: number;
      description: string;
      totalUnits: number;
    }>
  >;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated: (room: RoomListItem | RoomDetail) => void;
  onClose: () => void;
  queryClient: QueryClient;
}

export default function RoomInfoForm({
  propertyId,
  roomId,
  form,
  setForm,
  isSubmitting,
  setIsSubmitting,
  onUpdated,
  onClose,
  queryClient,
}: Props) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: UpdateRoomPayload = { ...form };
      const updatedRoom = await updateRoom(propertyId, roomId, payload);

      await queryClient.invalidateQueries({
        queryKey: ["room", propertyId, roomId],
      });

      onUpdated(updatedRoom);
      onClose();
    } catch (err) {
      console.error("Failed to update room:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Room Info
        </button>
      </div>
    </form>
  );
}