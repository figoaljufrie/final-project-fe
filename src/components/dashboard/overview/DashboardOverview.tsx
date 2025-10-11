"use client";

import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShadcnChart from "@/components/ui/ShadcnChart";

export default function DashboardOverview() {
  const { dashboardData, isLoading, error, refetch } = useDashboardData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const createKPICards = (kpiData: any) => {
    if (!kpiData) return [];

    return [
      {
        title: "Total Revenue",
        value: `Rp ${(kpiData.totalRevenue || 0).toLocaleString("id-ID")}`,
        change: kpiData.revenueGrowth || 0,
        trend: (kpiData.revenueGrowth || 0) >= 0 ? "up" : "down",
        icon: "💰",
        color: "bg-green-500",
      },
      {
        title: "Total Bookings",
        value: (kpiData.totalBookings || 0).toString(),
        change: kpiData.bookingGrowth || 0,
        trend: (kpiData.bookingGrowth || 0) >= 0 ? "up" : "down",
        icon: "📅",
        color: "bg-blue-500",
      },
      {
        title: "Total Guests",
        value: (kpiData.totalGuests || 0).toString(),
        change: kpiData.guestGrowth || 0,
        trend: (kpiData.guestGrowth || 0) >= 0 ? "up" : "down",
        icon: "👥",
        color: "bg-purple-500",
      },
      {
        title: "Avg. Occupancy",
        value: `${(kpiData.averageOccupancy || 0).toFixed(1)}%`,
        change: kpiData.occupancyGrowth || 0,
        trend: (kpiData.occupancyGrowth || 0) >= 0 ? "up" : "down",
        icon: "🏠",
        color: "bg-orange-500",
      },
    ];
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 h-96"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          There was an error loading your dashboard data. Please try again.
        </p>
        <Button onClick={refetch} className="bg-rose-500 hover:bg-rose-600">
          Retry
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your properties.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {dashboardData &&
          dashboardData.kpiData &&
          createKPICards(dashboardData.kpiData)
            .filter((kpi) => kpi != null)
            .map((kpi, index) => (
              <motion.div
                key={kpi.title}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          kpi.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(kpi.change)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.color}`}>
                    <span className="text-2xl">{kpi.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Revenue Trend
          </h3>
          {dashboardData &&
          dashboardData.monthlyData &&
          Array.isArray(dashboardData.monthlyData) &&
          dashboardData.monthlyData.length > 0 ? (
            <ShadcnChart
              data={dashboardData.monthlyData}
              type="area"
              height={300}
              keys={[{ key: "revenue", color: "hsl(var(--chart-1))" }]}
              colors={["hsl(var(--chart-1))"]}
              animated={true}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>
          {dashboardData &&
          dashboardData.recentTransactions &&
          dashboardData.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentTransactions
                .filter(
                  (transaction) =>
                    transaction && (transaction.id || transaction.property)
                )
                .slice(0, 5)
                .map((transaction, index) => (
                  <div
                    key={transaction.id || `transaction-${index}`}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 font-semibold text-sm">
                          {(transaction.id || "ID").slice(-2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.property || "Property"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.date
                            ? new Date(transaction.date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        Rp {(transaction.amount || 0).toLocaleString("id-ID")}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No recent transactions
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
