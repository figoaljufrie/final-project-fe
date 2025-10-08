"use client";

import { motion } from "framer-motion";
import { Download, BarChart3, Loader2 } from "lucide-react";
import { useState } from "react";
import DateRangePicker from "@/components/ui/DateRangePicker";

interface ReportFiltersProps {
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  onExport: (format: "pdf" | "excel") => Promise<void>;
}

export default function ReportFilters({
  dateRange,
  setDateRange,
  onExport,
}: ReportFiltersProps) {
  const [isExporting, setIsExporting] = useState<"pdf" | "excel" | null>(null);

  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(format);
    try {
      await onExport(format);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Date Range */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-rose-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Report Filters
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date Range
            </label>
            <div className="max-w-md">
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={setDateRange}
              />
            </div>
          </div>
        </div>

        {/* Right side - Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting === "pdf" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
          </button>
          <button
            onClick={() => handleExport("excel")}
            disabled={isExporting !== null}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting === "excel" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting === "excel" ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
