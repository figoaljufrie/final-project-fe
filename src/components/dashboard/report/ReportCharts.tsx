"use client";

import { motion } from "framer-motion";
import ShadcnChart from "@/components/ui/ShadcnChart";
import {
  MonthlyData,
  BookingStatusData,
} from "@/lib/services/report/report-service";

interface ReportChartsProps {
  monthlyData: MonthlyData[];
  bookingStatusData: BookingStatusData[];
}

export default function ReportCharts({
  monthlyData,
  bookingStatusData,
}: ReportChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Revenue Trend
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Monthly revenue performance over time
        </p>
        <div className="h-64">
          <ShadcnChart
            data={monthlyData.map((item) => ({
              name: item.name,
              value: item.value,
            }))}
            type="area"
            keys={[{ key: "value", color: "#3b82f6" }]}
          />
        </div>
      </motion.div>

      {/* Booking Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Booking Status Distribution
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Number of bookings by status (count, not currency)
        </p>
        <div className="h-64">
          <ShadcnChart
            data={bookingStatusData.map((item) => ({
              name: item.name,
              value: item.value,
              count: item.value, // Ensure it's treated as count, not currency
            }))}
            type="bar"
            keys={[{ key: "value", color: "#10b981" }]}
            isCount={true}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>
                <strong>Completed:</strong> Finished bookings
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>
                <strong>Confirmed:</strong> Awaiting completion
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>
                <strong>Pending:</strong> Awaiting confirmation
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>
                <strong>Cancelled:</strong> Cancelled bookings
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
