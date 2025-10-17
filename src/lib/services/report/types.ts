// Backend DTOs (matching backend structure)
export interface SalesReportRequest {
  propertyId?: number;
  userId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "totalSales";
  sortOrder?: "asc" | "desc";
  includeGrowth?: boolean;
}

export interface SalesReportResponse {
  totalSales: number;
  totalBookings: number;
  totalGuests: number;
  averageBookingValue: number;
  reports: SalesReportItem[];
  growthMetrics?: {
    revenueGrowth: number;
    bookingGrowth: number;
    guestGrowth: number;
  };
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
  totalGuests: number;
  averageValue: number;
  date: string;
  details?: {
    propertyId?: number;
    propertyName?: string;
    userId?: number;
    userName?: string;
    userEmail?: string;
    bookingId?: number;
    bookingNo?: string;
    totalGuests?: number;
    nights?: number;
    items?: BookingItemDetail[];
  };
}

export interface PropertyReportRequest {
  propertyId?: number;
  startDate?: string;
  endDate?: string;
  includeCalendar?: boolean;
  includeOccupancy?: boolean;
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
  averageDailyRate: number;
  revenuePerAvailableRoom: number;
  totalGuests: number;
  averageStayDuration: number;
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
  status: "available" | "fully_booked" | "partially_booked" | "unavailable";
  reason?: string | null;
  bookings?: BookingItem[];
  isAvailable?: boolean;
  customPrice?: number | null;
  priceModifier?: number | null;
}

export interface BookingItem {
  unitCount: number;
  status: string;
  bookingNo: string;
  totalGuests: number;
}

export interface BookingItemDetail {
  id: number;
  roomId: number;
  unitCount: number;
  unitPrice: number;
  nights: number;
  subTotal: number;
  room: {
    id: number;
    name: string;
    property: {
      id: number;
      name: string;
    };
  };
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
  userId?: number;
  sortBy?: "date" | "totalSales";
  sortOrder?: "asc" | "desc";
  reportType?: "sales" | "property";
}
