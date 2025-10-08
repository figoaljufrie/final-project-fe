import api from "../../api";
import {
  SalesReportRequest,
  SalesReportResponse,
  PropertyReportRequest,
  PropertyReportResponse,
  SalesReportData,
  MonthlyData,
  PropertyPerformance,
  BookingStatusData,
  ReportFilters,
} from "./types";
import { ReportTransformers } from "./transformers";

// Re-export types for external use
export type {
  SalesReportData,
  MonthlyData,
  PropertyPerformance,
  BookingStatusData,
  ReportFilters,
  PropertyReportResponse,
  CalendarAvailability,
  RoomAvailabilityItem,
} from "./types";

export class ReportService {
  // Get sales report data (matching backend endpoint)
  static async getSalesReport(
    filters: SalesReportRequest = {}
  ): Promise<SalesReportResponse> {
    const response = await api.get("/reports/sales", { params: filters });
    return response.data.data || response.data;
  }

  // Get property report data (matching backend endpoint)
  static async getPropertyReport(
    filters: PropertyReportRequest = {}
  ): Promise<PropertyReportResponse> {
    const response = await api.get("/reports/property", {
      params: filters,
    });
    return response.data.data || response.data;
  }

  // Transform backend data to frontend format
  static async getSalesReportForUI(filters: ReportFilters = {}) {
    try {
      const salesReport = await this.getSalesReport({
        propertyId: filters.propertyId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: "date",
        sortOrder: "desc",
      });

      const kpiData: SalesReportData = {
        totalRevenue: salesReport.totalSales || 0,
        totalBookings: salesReport.totalBookings || 0,
        totalGuests: salesReport.reports.reduce(
          (sum, item) => sum + (item.details?.totalGuests || 0),
          0
        ),
        averageOccupancy: 0,
        revenueGrowth: 0,
        bookingGrowth: 0,
        guestGrowth: 0,
        occupancyGrowth: 0,
      };

      const monthlyData = ReportTransformers.groupByMonth(salesReport.reports);
      const propertyPerformance =
        ReportTransformers.transformToPropertyPerformance(salesReport.reports);
      // Calculate booking status distribution properly
      const completedBookings = salesReport.reports.filter(
        (r) => r.type === "transaction"
      ).length;
      const totalBookings = salesReport.totalBookings || 0;

      const bookingStatusData: BookingStatusData[] = [
        {
          name: "Completed",
          value: completedBookings,
        },
        {
          name: "Confirmed",
          value: Math.max(0, totalBookings - completedBookings),
        },
        { name: "Pending", value: 0 },
        { name: "Cancelled", value: 0 },
      ];

      return { kpiData, monthlyData, propertyPerformance, bookingStatusData };
    } catch (error) {
      throw error;
    }
  }

  // Get property availability calendar using the new property calendar endpoint
  static async getPropertyAvailability(
    propertyId: number,
    startDate: string,
    endDate: string
  ) {
    try {
      const startDateObj = new Date(startDate);
      const month = startDateObj.getMonth() + 1;
      const year = startDateObj.getFullYear();

      const response = await api.get(`/properties/${propertyId}/calendar`, {
        params: { month, year },
      });

      const calendarData = response.data.data || response.data;
      return ReportTransformers.transformPropertyCalendarData(
        calendarData,
        startDate,
        endDate
      );
    } catch (error) {
      throw error;
    }
  }
}
