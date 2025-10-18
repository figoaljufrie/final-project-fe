"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReportService,
  ReportFilters,
  SalesReportData,
  MonthlyData,
  PropertyPerformance,
  BookingStatusData,
} from "@/lib/services/report/report-service";
import { toast } from "react-hot-toast";

export function useReportData(filters: ReportFilters = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<{
    kpiData: SalesReportData;
    monthlyData: MonthlyData[];
    propertyPerformance: PropertyPerformance[];
    bookingStatusData: BookingStatusData[];
  }>({
    kpiData: {
      totalRevenue: 0,
      totalBookings: 0,
      totalGuests: 0,
      averageOccupancy: 0,
      revenueGrowth: 0,
      bookingGrowth: 0,
      guestGrowth: 0,
      occupancyGrowth: 0,
    },
    monthlyData: [],
    propertyPerformance: [],
    bookingStatusData: [],
  });

  // Stabilize filters to prevent infinite re-renders
  const stableFilters = useMemo(() => filters, [filters]);

  const loadReportData = useCallback(async () => {
    try {
      console.log("🔄 Loading report data with filters:", stableFilters);
      setIsLoading(true);
      const data = await ReportService.getSalesReportForUI(stableFilters);
      console.log("✅ Report data loaded successfully:", data);
      setReportData(data);
    } catch (error: unknown) {
      console.error("Report data loading error:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load report data"
      );
      // Set fallback data to prevent infinite loading
      setReportData({
        kpiData: {
          totalRevenue: 0,
          totalBookings: 0,
          totalGuests: 0,
          averageOccupancy: 0,
          revenueGrowth: 0,
          bookingGrowth: 0,
          guestGrowth: 0,
          occupancyGrowth: 0,
        },
        monthlyData: [],
        propertyPerformance: [],
        bookingStatusData: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  return {
    reportData,
    isLoading,
    refetch: loadReportData,
  };
}
