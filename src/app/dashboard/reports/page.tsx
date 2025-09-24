"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar,
  DollarSign,
  Users,
  Building,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ShadcnChart from "@/components/ui/ShadcnChart";
import DateRangePicker from "@/components/ui/DateRangePicker";
import ShadcnSelect from "@/components/ui/ShadcnSelect";

// Enhanced mock data with trends
const salesData = [
  { name: "Jan", value: 12500000, bookings: 25, guests: 78, growth: 12 },
  { name: "Feb", value: 15200000, bookings: 32, guests: 96, growth: 21.6 },
  { name: "Mar", value: 18300000, bookings: 38, guests: 124, growth: 20.4 },
  { name: "Apr", value: 22100000, bookings: 45, guests: 145, growth: 20.8 },
  { name: "May", value: 19800000, bookings: 42, guests: 138, growth: -10.4 },
  { name: "Jun", value: 25600000, bookings: 52, guests: 167, growth: 29.3 },
];

const chartData = {
  revenue: salesData,
  bookings: salesData.map(item => ({ name: item.name, value: item.bookings })),
  guests: salesData.map(item => ({ name: item.name, value: item.guests }))
};

const propertyPerformance = [
  { id: 1, name: "Villa Sunset Bali", bookings: 45, revenue: 67500000, occupancy: 85, trend: "up" },
  { id: 2, name: "Beach House Lombok", bookings: 32, revenue: 48000000, occupancy: 78, trend: "up" },
  { id: 3, name: "Mountain Cabin Bandung", bookings: 28, revenue: 33600000, occupancy: 72, trend: "down" },
  { id: 4, name: "City Apartment Jakarta", bookings: 38, revenue: 57000000, occupancy: 82, trend: "up" },
  { id: 5, name: "Lake House Toba", bookings: 25, revenue: 37500000, occupancy: 68, trend: "down" },
];

const bookingStatusData = [
  { name: "Completed", value: 156 },
  { name: "Confirmed", value: 43 },
  { name: "Pending", value: 12 },
  { name: "Cancelled", value: 8 },
];

const kpiData = [
  {
    title: "Total Revenue",
    value: "Rp 113.400.000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Total Bookings", 
    value: "192",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Total Guests",
    value: "579", 
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Avg. Occupancy",
    value: "75%",
    change: "-2.1%", 
    trend: "down",
    icon: Building,
    color: "from-rose-500 to-rose-600"
  }
];

const reportTypeOptions = [
  { value: "sales", label: "Sales Report", icon: "💰" },
  { value: "property", label: "Property Performance", icon: "🏠" },
  { value: "bookings", label: "Booking Analysis", icon: "📅" },
  { value: "guests", label: "Guest Analytics", icon: "👥" }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [reportType, setReportType] = useState("sales");
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting ${format} report...`);
    // TODO: Implement actual export functionality
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                Reports & Analytics
              </h2>
              <p className="mt-2 text-gray-600">
                Feature 2: Comprehensive reports for tenant transaction management and property performance
              </p>
            </div>
            <div className="mt-6 flex md:ml-4 md:mt-0 space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => exportReport("pdf")}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => exportReport("excel")}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Excel
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
                  <ShadcnSelect
                    options={reportTypeOptions}
                    value={reportType}
                    onChange={setReportType}
                    placeholder="Select report type"
                  />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <div className="flex space-x-2">
                {(['area', 'line', 'bar'] as const).map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                      chartType === type
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => (
            <motion.div
              key={kpi.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl p-6 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{kpi.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Chart */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Trend Analysis</h3>
            <p className="text-gray-600">Monthly revenue performance over the last 6 months</p>
          </div>
          <div className="h-80">
            <ShadcnChart
              data={chartData.revenue}
              type={chartType}
              keys={[{ key: "value", color: "#f43f5e" }, { key: "bookings", color: "#3b82f6" }]}
              height={320}
              animated={true}
            />
          </div>
        </motion.div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Status Distribution */}
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
            <div className="h-64">
              <ShadcnChart
                data={bookingStatusData}
                type="pie"
                keys={[{ key: "value", color: "" }]}
                height={256}
                animated={true}
              />
            </div>
          </motion.div>

          {/* Bookings Trend */}
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bookings</h3>
            <div className="h-64">
              <ShadcnChart
                data={chartData.bookings}
                type="bar"
                keys={[{ key: "value", color: "#3b82f6" }]}
                height={256}
                animated={true}
              />
            </div>
          </motion.div>
        </div>

        {/* Property Performance Table */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Property Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {propertyPerformance.map((property) => (
                  <motion.tr
                    key={property.id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.bookings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(property.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${property.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{property.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.trend === 'up'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.trend === 'up' ? (
                          <ChevronUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ChevronDown className="h-3 w-3 mr-1" />
                        )}
                        {property.trend === 'up' ? 'Growing' : 'Declining'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}