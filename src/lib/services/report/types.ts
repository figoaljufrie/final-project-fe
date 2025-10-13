// Backend DTOs (matching backend structure)
export interface SalesReportRequest {
  propertyId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "totalSales";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SalesReportResponse {
  totalSales: number;
  totalBookings: number;
  averageBookingValue: number;
  reports: SalesReportItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SalesReportItem {
  id: string;
  type: "property" | "transaction" | "user";
  name: string;
  totalSales: number;
  totalBookings: number;
  averageValue: number;
  date: string;
  details?: Record<string, unknown>;
}

export interface PropertyReportRequest {
  propertyId?: number;
  startDate?: string;
  endDate?: string;
}

export interface PropertyReportResponse {
  properties: PropertyReportItem[];
  calendar: CalendarAvailability[];
}

export interface PropertyReportItem {
  propertyId: number;
  propertyName: string;
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  occupancyRate: number;
  totalRevenue: number;
}

export interface CalendarAvailability {
  date: string;
  propertyId: number;
  propertyName: string;
  rooms: RoomAvailabilityItem[];
}

export interface RoomAvailabilityItem {
  roomId: number;
  roomName: string;
  totalUnits: number;
  bookedUnits: number;
  availableUnits: number;
  status: "available" | "fully_booked" | "partially_booked";
}

// Frontend-specific interfaces for UI
export interface SalesReportData {
  totalRevenue: number;
  totalBookings: number;
  totalGuests: number;
  averageOccupancy: number;
  revenueGrowth: number;
  bookingGrowth: number;
  guestGrowth: number;
  occupancyGrowth: number;
}

export interface PropertyPerformance {
  id: number;
  name: string;
  bookings: number;
  revenue: number;
  occupancy: number;
  trend: "up" | "down";
}

export interface BookingStatusData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface MonthlyData {
  name: string;
  value: number;
  bookings: number;
  guests: number;
  growth: number;
  [key: string]: unknown;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  propertyId?: number;
  reportType?: "sales" | "property" | "bookings" | "guests";
}
