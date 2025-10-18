"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useReportData } from "@/hooks/report/use-report-data";
import ReportKPICards from "@/components/dashboard/report/ReportKPICards";
import ReportCharts from "@/components/dashboard/report/ReportCharts";
import PropertyPerformanceTable from "@/components/dashboard/report/PropertyPerformanceTable";
import PropertyAvailabilityCalendar from "@/components/dashboard/report/PropertyAvailabilityCalendar";
import PropertySelector from "@/components/dashboard/report/PropertySelector";
import UserSelector from "@/components/dashboard/report/UserSelector";
import SortControls from "@/components/dashboard/report/SortControls";
import DateRangePicker from "@/components/ui/DateRangePicker";
import {
  ReportFilters as ReportFiltersType,
} from "@/lib/services/report/report-service";
import { toast } from "react-hot-toast";
import { ExportUtils } from "@/lib/utils/export-utils";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"date" | "totalSales">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Stabilize filters to prevent infinite re-renders
  const filters: ReportFiltersType = useMemo(() => ({
    startDate: dateRange.startDate?.toISOString().split("T")[0],
    endDate: dateRange.endDate?.toISOString().split("T")[0],
    propertyId: selectedPropertyId,
    userId: selectedUserId,
    sortBy: sortBy,
    sortOrder: sortOrder,
  }), [dateRange.startDate, dateRange.endDate, selectedPropertyId, selectedUserId, sortBy, sortOrder]);

  const { reportData, isLoading, refetch } = useReportData(filters);

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      if (format === "pdf") {
        await ExportUtils.exportToPDF(
          "reports-content",
          `reports-${new Date().toISOString().split("T")[0]}.pdf`
        );
        toast.success("PDF report exported successfully");
      } else if (format === "excel") {
        const excelData = ExportUtils.prepareReportDataForExcel(reportData);
        ExportUtils.exportToExcel(
          excelData,
          `reports-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        toast.success("Excel report exported successfully");
      }
    } catch (error: unknown) {
      console.error("Export error:", error);
      toast.error(`Failed to export ${format.toUpperCase()} report`);
    }
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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 p-6"
    >
      <div id="reports-content" className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Analyze your property performance and booking trends
              </p>
            </div>
          </div>
        </motion.div>

        {/* Report Configuration - Simplified Design */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Report Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            
            {/* Property Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Property</label>
              <PropertySelector
                selectedPropertyId={selectedPropertyId}
                onPropertyChange={setSelectedPropertyId}
              />
            </div>

            {/* User Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">User</label>
              <UserSelector
                selectedUserId={selectedUserId}
                onUserChange={setSelectedUserId}
              />
            </div>
            
            {/* Sort Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(newSortBy, newSortOrder) => {
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
          </div>
          <ReportKPICards kpiData={reportData.kpiData} isLoading={isLoading} />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">Loading reports...</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Charts Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Trends</h2>
              </div>
              <ReportCharts
                monthlyData={reportData.monthlyData}
                bookingStatusData={reportData.bookingStatusData}
              />
            </motion.div>

            {/* Property Performance Table */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Property Performance</h2>
              </div>
              <PropertyPerformanceTable
                propertyPerformance={reportData.propertyPerformance}
              />
            </motion.div>

            {/* Property Availability Calendar */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Property Availability Calendar</h2>
              </div>
              <PropertyAvailabilityCalendar
                propertyId={selectedPropertyId}
                startDate={dateRange.startDate?.toISOString().split("T")[0]}
                endDate={dateRange.endDate?.toISOString().split("T")[0]}
              />
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
