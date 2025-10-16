"use client";

import type { CreateRoomFormProps } from "@/hooks/Inventory/room/ui-state/use-create-room-form";
import { Loader2 } from "lucide-react";

export default function CreateRoomForm({
  form,
  isPending,
  handleChange,
  handleFileChange,
  handleSubmit,
}: CreateRoomFormProps) {
  return (
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
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Room
        </button>
      </div>
    </form>
  );
}
