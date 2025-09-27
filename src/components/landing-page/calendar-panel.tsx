// components/CalendarPanel.tsx
"use client";
import { Fragment } from "react";

export default function CalendarPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return <></>;
  return (
    <Fragment>
      <div className="fixed right-6 top-20 z-50 w-80 bg-white rounded-xl shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Select Dates</div>
          <button onClick={onClose} className="text-sm text-gray-600">
            Close
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2">
            <div className="text-sm font-medium mb-1">Sept 2025</div>
            <div className="text-xs text-gray-500">
              simple calendar placeholder
            </div>
          </div>
          <div className="border rounded p-2">
            <div className="text-sm font-medium mb-1">Oct 2025</div>
            <div className="text-xs text-gray-500">
              simple calendar placeholder
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
