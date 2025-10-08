import {
  SalesReportItem,
  MonthlyData,
  PropertyPerformance,
  BookingStatusData,
} from "./types";

export class ReportTransformers {
  // Group reports by month for chart data
  static groupByMonth(reports: SalesReportItem[]): MonthlyData[] {
    const monthlyMap = new Map<string, MonthlyData>();

    reports.forEach((report) => {
      const month = new Date(report.date).toLocaleDateString("en-US", {
        month: "short",
      });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          name: month,
          value: 0,
          bookings: 0,
          guests: 0,
          growth: 0,
        });
      }

      const monthData = monthlyMap.get(month)!;
      monthData.value += report.totalSales;
      monthData.bookings += report.totalBookings;
    });

    return Array.from(monthlyMap.values());
  }

  // Transform reports to property performance data
  static transformToPropertyPerformance(
    reports: SalesReportItem[]
  ): PropertyPerformance[] {
    const propertyMap = new Map<number, PropertyPerformance>();

    reports
      .filter((report) => report.type === "property")
      .forEach((report) => {
        const propertyId = report.details?.propertyId;
        if (propertyId) {
          if (!propertyMap.has(propertyId)) {
            propertyMap.set(propertyId, {
              id: propertyId,
              name: report.name,
              bookings: 0,
              revenue: 0,
              occupancy: 0,
              trend: "up",
            });
          }

          const property = propertyMap.get(propertyId)!;
          property.bookings += report.totalBookings;
          property.revenue += report.totalSales;
        }
      });

    return Array.from(propertyMap.values());
  }

  // Transform property calendar data to match our interface
  static transformPropertyCalendarData(
    calendarData: any,
    startDate: string,
    endDate: string
  ) {
    const { property, calendar } = calendarData;

    // Filter dates within the requested range
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredCalendar = calendar.map((room: any) => {
      const filteredDailyPrices = room.dailyPrices.filter((day: any) => {
        const dayDate = new Date(day.date);
        return dayDate >= start && dayDate <= end;
      });

      return {
        roomId: room.roomId,
        roomName: room.roomName,
        dailyPrices: filteredDailyPrices,
      };
    });

    // Group by date for our calendar format
    const dateMap = new Map();

    filteredCalendar.forEach((room: any) => {
      room.dailyPrices.forEach((day: any) => {
        const dateStr = day.date;
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, {
            date: dateStr,
            propertyId: property.id,
            propertyName: property.name,
            rooms: [],
          });
        }

        const dateEntry = dateMap.get(dateStr);
        dateEntry.rooms.push({
          roomId: room.roomId,
          roomName: room.roomName,
          totalUnits: 1,
          bookedUnits: day.available ? 0 : 1,
          availableUnits: day.available ? 1 : 0,
          status: day.available ? "available" : "fully_booked",
        });
      });
    });

    return {
      properties: [
        {
          propertyId: property.id,
          propertyName: property.name,
          totalRooms: filteredCalendar.length,
          availableRooms: 0,
          bookedRooms: 0,
          occupancyRate: 0,
          totalRevenue: 0,
        },
      ],
      calendar: Array.from(dateMap.values()),
    };
  }
}
