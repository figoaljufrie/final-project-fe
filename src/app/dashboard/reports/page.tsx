"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReportData } from "@/hooks/report/use-report-data";
import ReportFilters from "@/components/dashboard/report/ReportFilters";
import ReportKPICards from "@/components/dashboard/report/ReportKPICards";
import ReportCharts from "@/components/dashboard/report/ReportCharts";
import PropertyPerformanceTable from "@/components/dashboard/report/PropertyPerformanceTable";
import PropertyAvailabilityCalendar from "@/components/dashboard/report/PropertyAvailabilityCalendar";
import {
  ReportService,
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

  const filters: ReportFiltersType = {
    startDate: dateRange.startDate?.toISOString().split("T")[0],
    endDate: dateRange.endDate?.toISOString().split("T")[0],
  };

  const { reportData, isLoading } = useReportData(filters);

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      if (format === "pdf") {
        // Export PDF by capturing the report content
        await ExportUtils.exportToPDF(
          "reports-content",
          `reports-${new Date().toISOString().split("T")[0]}.pdf`
        );
        toast.success("PDF report exported successfully");
      } else if (format === "excel") {
        // Export Excel with structured data
        const excelData = ExportUtils.prepareReportDataForExcel(reportData);
        ExportUtils.exportToExcel(
          excelData,
          `reports-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        toast.success("Excel report exported successfully");
      }
    } catch (error: any) {
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
      className="min-h-screen bg-gradient-to-br p-6"
    >
      <div id="reports-content" className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">
            Analyze your property performance and booking trends
          </p>
        </motion.div>

        <ReportFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExport={handleExport}
        />

        {/* KPI Cards - Always show */}
        <motion.div variants={itemVariants} className="mb-6">
          <ReportKPICards kpiData={reportData.kpiData} isLoading={isLoading} />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="mb-6">
              <ReportCharts
                monthlyData={reportData.monthlyData}
                bookingStatusData={reportData.bookingStatusData}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <PropertyPerformanceTable
                propertyPerformance={reportData.propertyPerformance}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PropertyAvailabilityCalendar
                propertyId={undefined}
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
