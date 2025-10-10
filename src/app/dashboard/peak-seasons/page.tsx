"use client";

import PeakSeasonCalendar from "@/components/dashboard/peak-season/peak-season-calendar";

export default function PeakSeasonPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Tenant Peak Season Management
      </h2>
      <PeakSeasonCalendar />
    </div>
  );
}
