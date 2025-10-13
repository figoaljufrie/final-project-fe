"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import ShadcnSelect from "./ShadcnSelect";

interface BookingSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  className?: string;
}

const statusOptions = [
  { value: "all", label: "All Status", icon: "📋" },
  { value: "waiting_for_payment", label: "Waiting Payment", icon: "⏳" },
  { value: "waiting_for_confirmation", label: "Waiting Confirmation", icon: "🔄" },
  { value: "confirmed", label: "Confirmed", icon: "✅" },
  { value: "completed", label: "Completed", icon: "🎉" },
  { value: "cancelled", label: "Cancelled", icon: "❌" },
  { value: "expired", label: "Expired", icon: "⏰" },
  { value: "rejected", label: "Rejected", icon: "🚫" },
];

export default function BookingSearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  className = ""
}: BookingSearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl p-6 ${className}`}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings by ID, guest name, or property..."
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Filter className="h-5 w-5 text-gray-400 hover:text-rose-500 transition-colors" />
          </button>
        </div>

        {/* Advanced Filters */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : 0,
            opacity: showFilters ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <ShadcnSelect
                  options={statusOptions}
                  value={statusFilter}
                  onChange={onStatusChange}
                  placeholder="Select status"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
                    placeholder="To"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
