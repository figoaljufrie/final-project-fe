"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Users,
  Building,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { SalesReportData } from "@/lib/services/report/report-service";

interface ReportKPICardsProps {
  kpiData: SalesReportData;
  isLoading?: boolean;
}

export default function ReportKPICards({
  kpiData,
  isLoading = false,
}: ReportKPICardsProps) {
  // Debug: Log the data being received
  console.log("ReportKPICards - kpiData:", kpiData);
  console.log("ReportKPICards - isLoading:", isLoading);

  // Fallback data for testing if kpiData is empty
  const safeKpiData = {
    totalRevenue: kpiData.totalRevenue || 0,
    totalBookings: kpiData.totalBookings || 0,
    totalGuests: kpiData.totalGuests || 0,
    averageOccupancy: kpiData.averageOccupancy || 0,
    revenueGrowth: kpiData.revenueGrowth || 0,
    bookingGrowth: kpiData.bookingGrowth || 0,
    guestGrowth: kpiData.guestGrowth || 0,
    occupancyGrowth: kpiData.occupancyGrowth || 0,
  };
  const kpiCards = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(safeKpiData.totalRevenue),
      change: `${
        safeKpiData.revenueGrowth >= 0 ? "+" : ""
      }${safeKpiData.revenueGrowth.toFixed(1)}%`,
      trend: safeKpiData.revenueGrowth >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Total Bookings",
      value: safeKpiData.totalBookings.toString(),
      change: `${
        safeKpiData.bookingGrowth >= 0 ? "+" : ""
      }${safeKpiData.bookingGrowth.toFixed(1)}%`,
      trend: safeKpiData.bookingGrowth >= 0 ? "up" : "down",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      borderColor: "border-l-green-500",
    },
    {
      title: "Total Guests",
      value: safeKpiData.totalGuests.toString(),
      change: `${
        safeKpiData.guestGrowth >= 0 ? "+" : ""
      }${safeKpiData.guestGrowth.toFixed(1)}%`,
      trend: safeKpiData.guestGrowth >= 0 ? "up" : "down",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-l-purple-500",
    },
    {
      title: "Avg. Occupancy",
      value: `${safeKpiData.averageOccupancy.toFixed(1)}%`,
      change: `${
        safeKpiData.occupancyGrowth >= 0 ? "+" : ""
      }${safeKpiData.occupancyGrowth.toFixed(1)}%`,
      trend: safeKpiData.occupancyGrowth >= 0 ? "up" : "down",
      icon: Building,
      color: "from-rose-500 to-rose-600",
      borderColor: "border-l-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 shadow-sm border-l-4 ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {isLoading ? "..." : card.value}
                </p>
                <div className="flex items-center">
                  <TrendIcon
                    className={`h-4 w-4 mr-1 ${
                      card.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      card.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${card.color} shadow-md`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
