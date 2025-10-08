"use client";

import { useState, useEffect } from "react";
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

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      const data = await ReportService.getSalesReportForUI(filters);
      setReportData(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load report data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [filters.startDate, filters.endDate, filters.propertyId]);

  return {
    reportData,
    isLoading,
    refetch: loadReportData,
  };
}
