"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface BookingRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  rejectReason: string;
  onReasonChange: (reason: string) => void;
  isLoading: boolean;
}

export default function BookingRejectModal({
  isOpen,
  onClose,
  onReject,
  rejectReason,
  onReasonChange,
  isLoading
}: BookingRejectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md glass-card">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Reject Booking</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Please provide a reason for rejecting this booking..."
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onReject}
              disabled={isLoading || !rejectReason.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? "Rejecting..." : "Reject Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
