"use client";

import { motion } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ShadcnSelect from "@/components/ui/ShadcnSelect";

interface BookingSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  statusConfig: Record<
    string,
    {
      label: string;
      color: string;
    }
  >;
}

export default function BookingSearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusConfig,
}: BookingSearchFilterProps) {
  const statusOptions = [
    { value: "all", label: "All Status" },
    ...Object.entries(statusConfig).map(([key, config]) => ({
      value: key,
      label: config.label,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>

          <div className="min-w-[200px]">
            <ShadcnSelect
              value={statusFilter}
              onChange={onStatusChange}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
