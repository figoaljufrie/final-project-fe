"use client";

import { motion } from "framer-motion";
import {
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface BookingStatsCardsProps {
  bookings: Array<{
    status: string;
    totalAmount: number;
  }>;
}

export default function BookingStatsCards({
  bookings,
}: BookingStatsCardsProps) {
  const stats = [
    {
      name: "Total Bookings",
      value: bookings.length,
      icon: CheckIcon,
      color: "bg-blue-500",
    },
    {
      name: "Pending Approval",
      value: bookings.filter((b) => b.status === "waiting_for_confirmation")
        .length,
      icon: ClockIcon,
      color: "bg-yellow-500",
    },
    {
      name: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: CheckIcon,
      color: "bg-green-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
