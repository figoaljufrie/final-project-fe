"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import ShadcnChart from "@/components/ui/ShadcnChart";
import clsx from "clsx";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import {
  DashboardKPIData,
  MonthlyRevenueData,
  RecentTransaction,
} from "@/lib/services/dashboard/dashboard-service";

// Quick actions data (static)
const quickActions = [
  {
    title: "Manage Bookings",
    description: "Handle confirmations & payments",
    href: "/dashboard/tenant-approval",
    icon: "💳",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "View Reports",
    description: "Analytics & insights",
    href: "/dashboard/reports",
    icon: "📊",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Reviews",
    description: "Coming soon...",
    href: "#",
    icon: "⭐",
    color: "from-purple-500 to-purple-600",
  },
];

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  waiting_for_confirmation: {
    label: "Waiting Confirmation",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  waiting_for_payment: {
    label: "Waiting Payment",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
};

export default function DashboardOverview() {
  const { dashboardData, isLoading, error } = useDashboardData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to create KPI cards from real data
  const createKPICards = (kpiData: DashboardKPIData) => {
    if (!kpiData) return [];

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(kpiData.totalRevenue),
        change: `${
          kpiData.revenueGrowth > 0 ? "+" : ""
        }${kpiData.revenueGrowth.toFixed(1)}%`,
        trend: kpiData.revenueGrowth >= 0 ? "up" : "down",
        icon: DollarSign,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Total Bookings",
        value: kpiData.totalBookings.toString(),
        change: `${
          kpiData.bookingGrowth > 0 ? "+" : ""
        }${kpiData.bookingGrowth.toFixed(1)}%`,
        trend: kpiData.bookingGrowth >= 0 ? "up" : "down",
        icon: Calendar,
        color: "from-green-500 to-green-600",
      },
      {
        title: "Total Transactions",
        value: kpiData.totalTransactions.toString(),
        change: `${
          kpiData.transactionGrowth > 0 ? "+" : ""
        }${kpiData.transactionGrowth.toFixed(1)}%`,
        trend: kpiData.transactionGrowth >= 0 ? "up" : "down",
        icon: BarChart3,
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Avg. Monthly Revenue",
        value: formatCurrency(kpiData.averageMonthlyRevenue),
        change: `${
          kpiData.monthlyRevenueGrowth > 0 ? "+" : ""
        }${kpiData.monthlyRevenueGrowth.toFixed(1)}%`,
        trend: kpiData.monthlyRevenueGrowth >= 0 ? "up" : "down",
        icon: ChevronUp,
        color: "from-rose-500 to-rose-600",
      },
    ];
  };

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="glass-card rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/2"></div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-12 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded mb-4"></div>
                <div className="h-8 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="glass-card rounded-xl p-8 animate-pulse">
            <div className="h-6 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-8"
        >
          <div className="">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Track your property rental business performance
            </p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dashboardData &&
            dashboardData.kpiData &&
            createKPICards(dashboardData.kpiData)
              .filter((kpi) => kpi != null)
              .map((kpi, index) => {
                return (
                  <motion.div
                    key={`kpi-${kpi.title}-${index}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card rounded-xl p-6 relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5`}
                    ></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}
                        >
                          <kpi.icon className="h-6 w-6 text-white" />
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-sm font-medium ${
                            kpi.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <ChevronUp
                            className={`h-4 w-4 ${
                              kpi.trend === "down" ? "rotate-180" : ""
                            }`}
                          />
                          <span>{kpi.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {kpi.value}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {kpi.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>

        {/* Monthly Revenue Trend - Full Width */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-xl p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Monthly Revenue Trend
            </h3>
            <p className="text-gray-600">
              Revenue performance over the last 6 months
            </p>
          </div>
          <div className="h-80">
            {dashboardData &&
            dashboardData.monthlyData &&
            Array.isArray(dashboardData.monthlyData) &&
            dashboardData.monthlyData.length > 0 ? (
              <ShadcnChart
                data={dashboardData.monthlyData}
                type="area"
                keys={[{ key: "Revenue", color: "#f43f5e" }]}
                height={320}
                animated={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No monthly data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Transactions & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <Link
                href="/dashboard/bookings"
                className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData &&
              dashboardData.recentTransactions &&
              dashboardData.recentTransactions.length > 0 ? (
                dashboardData.recentTransactions
                  .filter((transaction) => transaction != null)
                  .map((transaction, index) => {
                    const StatusIcon =
                      statusConfig[
                        transaction.status as keyof typeof statusConfig
                      ]?.icon || Clock;
                    const statusColor =
                      statusConfig[
                        transaction.status as keyof typeof statusConfig
                      ]?.color || "bg-gray-100 text-gray-800";
                    const statusLabel =
                      statusConfig[
                        transaction.status as keyof typeof statusConfig
                      ]?.label || transaction.status;

                    return (
                      <motion.div
                        key={`transaction-${transaction.id}-${index}`}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <StatusIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.guest} - {transaction.property}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span
                            className={clsx(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                              statusColor
                            )}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent transactions available
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={action.href}
                    className="block p-6 rounded-xl bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-200 border border-white/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`text-3xl flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}
                      >
                        <span className="text-white text-lg">
                          {action.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
