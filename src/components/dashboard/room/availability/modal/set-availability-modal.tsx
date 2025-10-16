"use client";

import { useState } from "react";
import { SetAvailabilityBody } from "@/lib/types/inventory/availability-types";
import { Dialog } from "@headlessui/react";

interface SetAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SetAvailabilityBody) => void;
  selectedDate: string;
}

export default function SetAvailabilityModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: SetAvailabilityModalProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [customPrice, setCustomPrice] = useState<number | undefined>();
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit({
      date: selectedDate,
      isAvailable,
      customPrice,
      reason,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Set Availability – {selectedDate}
          </Dialog.Title>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              value={isAvailable ? "true" : "false"}
              onChange={(e) => setIsAvailable(e.target.value === "true")}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">
              Custom Price (optional)
            </label>
            <input
              type="number"
              value={customPrice ?? ""}
              onChange={(e) =>
                setCustomPrice(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Enter custom price"
              className="w-full border rounded-md p-2 text-sm"
            />

            <label className="block text-sm font-medium text-gray-700">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Maintenance, event, etc."
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-5">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}