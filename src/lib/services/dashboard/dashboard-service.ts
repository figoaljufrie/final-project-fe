import api from "@/lib/api";

export interface DashboardKPIData {
  totalRevenue: number;
  totalBookings: number;
  totalGuests: number;
  averageOccupancy: number;
  totalTransactions: number;
  averageMonthlyRevenue: number;
  revenueGrowth: number;
  bookingGrowth: number;
  guestGrowth: number;
  occupancyGrowth: number;
  transactionGrowth: number;
  monthlyRevenueGrowth: number;
}

export interface MonthlyRevenueData {
  name: string;
  revenue: number;
  bookings: number;
  transactions: number;
  [key: string]: string | number | undefined;
}

export interface RecentTransaction {
  id: string;
  property: string;
  guest: string;
  amount: number;
  status: string;
  date: string;
}

export interface DashboardData {
  kpiData: DashboardKPIData;
  monthlyData: MonthlyRevenueData[];
  recentTransactions: RecentTransaction[];
}

// Backend booking interface
interface BackendBooking {
  id: number;
  bookingNumber: string;
  totalAmount: number;
  totalGuests?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  checkIn: string;
  checkOut: string;
  user: {
    name: string;
    email: string;
  };
  property: {
    name: string;
    city: string;
    province: string;
  } | null;
  items: Array<{
    room: {
      property: {
        name: string;
        city: string;
        province: string;
      };
    };
  }>;
}

interface BackendBookingsResponse {
  bookings: BackendBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class DashboardService {
  // Get dashboard overview data from tenant bookings
  static async getDashboardData(): Promise<DashboardData> {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      // Get all bookings for the tenant (using max allowed limit of 100)
      const response = await api.get("/tenant/bookings?limit=100");

      // Check if response has the expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure from backend");
      }

      const bookingsData: BackendBookingsResponse = response.data.data;

      // Transform backend data to dashboard format
      return this.transformBookingsToDashboardData(bookingsData.bookings);
    } catch (error: any) {
      // If authentication error, return empty dashboard data
      if (error.response?.status === 401 || error.response?.status === 403) {
        return this.getEmptyDashboardData();
      }

      // If 400 error, might be validation issue
      if (error.response?.status === 400) {
        return this.getEmptyDashboardData();
      }

      throw error;
    }
  }

  // Get empty dashboard data as fallback
  private static getEmptyDashboardData(): DashboardData {
    return {
      kpiData: {
        totalRevenue: 0,
        totalBookings: 0,
        totalGuests: 0,
        averageOccupancy: 0,
        totalTransactions: 0,
        averageMonthlyRevenue: 0,
        revenueGrowth: 0,
        bookingGrowth: 0,
        guestGrowth: 0,
        occupancyGrowth: 0,
        transactionGrowth: 0,
        monthlyRevenueGrowth: 0,
      },
      monthlyData: [
        { name: "Jan", revenue: 0, bookings: 0, transactions: 0 },
        { name: "Feb", revenue: 0, bookings: 0, transactions: 0 },
        { name: "Mar", revenue: 0, bookings: 0, transactions: 0 },
        { name: "Apr", revenue: 0, bookings: 0, transactions: 0 },
        { name: "May", revenue: 0, bookings: 0, transactions: 0 },
        { name: "Jun", revenue: 0, bookings: 0, transactions: 0 },
      ],
      recentTransactions: [],
    };
  }

  // Calculate average occupancy based on room capacity and booking duration
  private static calculateAverageOccupancy(bookings: BackendBooking[]): number {
    if (bookings.length === 0) return 0;

    let totalOccupiedDays = 0;
    let totalAvailableDays = 0;

    bookings.forEach((booking) => {
      if (booking.status === "confirmed" || booking.status === "completed") {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate occupied days for this booking
        const occupiedDays = nights * (booking.totalGuests || 1);
        totalOccupiedDays += occupiedDays;

        // Assume average room capacity of 2 guests per room
        // This could be improved by fetching actual room capacity from backend
        const roomCapacity = 2;
        const availableDays = nights * roomCapacity;
        totalAvailableDays += availableDays;
      }
    });

    return totalAvailableDays > 0
      ? Math.min((totalOccupiedDays / totalAvailableDays) * 100, 100)
      : 0;
  }

  // Transform backend bookings to dashboard data
  private static transformBookingsToDashboardData(
    bookings: BackendBooking[]
  ): DashboardData {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Filter bookings from last 6 months
    const recentBookings = bookings.filter(
      (booking) => new Date(booking.createdAt) >= sixMonthsAgo
    );

    // Calculate KPI data - only include confirmed and completed bookings for revenue
    const revenueBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" || booking.status === "completed"
    );

    const totalRevenue = revenueBookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    const totalBookings = bookings.length;
    const totalTransactions = bookings.length; // Same as bookings for now

    // Calculate total guests from all bookings
    const totalGuests = bookings.reduce((sum, booking) => {
      // Assuming each booking has totalGuests field, if not available, use a default
      return sum + (booking.totalGuests || 1);
    }, 0);

    // Calculate average occupancy based on actual room capacity and booking duration
    const averageOccupancy = this.calculateAverageOccupancy(bookings);

    const averageMonthlyRevenue = totalRevenue / 6; // Last 6 months average

    // Calculate growth (mock for now - would need historical data)
    const revenueGrowth = 12.5;
    const bookingGrowth = 8.2;
    const guestGrowth = 5.5;
    const occupancyGrowth = 3.2;
    const transactionGrowth = 15.3;
    const monthlyRevenueGrowth = 7.8;

    // Group by month for chart data
    const monthlyData = this.groupBookingsByMonth(recentBookings);

    // Get recent transactions (last 4)
    const recentTransactions = this.transformToRecentTransactions(
      bookings.slice(0, 4)
    );

    return {
      kpiData: {
        totalRevenue,
        totalBookings,
        totalGuests,
        averageOccupancy,
        totalTransactions,
        averageMonthlyRevenue,
        revenueGrowth,
        bookingGrowth,
        guestGrowth,
        occupancyGrowth,
        transactionGrowth,
        monthlyRevenueGrowth,
      },
      monthlyData,
      recentTransactions,
    };
  }

  // Group bookings by month
  private static groupBookingsByMonth(
    bookings: BackendBooking[]
  ): MonthlyRevenueData[] {
    const monthMap = new Map<
      string,
      { revenue: number; bookings: number; transactions: number }
    >();

    // Initialize last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });
      months.push(monthKey);
      monthMap.set(monthKey, { revenue: 0, bookings: 0, transactions: 0 });
    }

    // Aggregate data by month
    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });

      if (monthMap.has(monthKey)) {
        const data = monthMap.get(monthKey)!;
        data.revenue += booking.totalAmount;
        data.bookings += 1;
        data.transactions += 1;
      }
    });

    // Convert to array format
    return months.map((month) => {
      const data = monthMap.get(month)!;
      return {
        name: month,
        revenue: data.revenue,
        bookings: data.bookings,
        transactions: data.transactions,
      };
    });
  }

  // Transform bookings to recent transactions format
  private static transformToRecentTransactions(
    bookings: BackendBooking[]
  ): RecentTransaction[] {
    return bookings.map((booking) => ({
      id: booking.bookingNumber,
      property:
        booking.property?.name ||
        booking.items[0]?.room?.property?.name ||
        "Unknown Property",
      guest: booking.user.name,
      amount: booking.totalAmount,
      status: booking.status,
      date: booking.createdAt,
    }));
  }

  // Get KPI data only
  static async getKPIData(): Promise<DashboardKPIData> {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.kpiData;
    } catch (error) {
      throw error;
    }
  }

  // Get monthly revenue data
  static async getMonthlyRevenueData(): Promise<MonthlyRevenueData[]> {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.monthlyData;
    } catch (error) {
      throw error;
    }
  }

  // Get recent transactions
  static async getRecentTransactions(): Promise<RecentTransaction[]> {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.recentTransactions;
    } catch (error) {
      throw error;
    }
  }
}
