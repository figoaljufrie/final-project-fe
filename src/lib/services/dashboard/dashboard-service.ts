import api from "@/lib/api";

export interface DashboardKPIData {
  totalRevenue: number;
  totalBookings: number;
  totalTransactions: number;
  averageMonthlyRevenue: number;
  revenueGrowth: number;
  bookingGrowth: number;
  transactionGrowth: number;
  monthlyRevenueGrowth: number;
}

export interface MonthlyRevenueData {
  name: string;
  Revenue: number;
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
  status: string;
  createdAt: string;
  updatedAt: string;
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
        totalTransactions: 0,
        averageMonthlyRevenue: 0,
        revenueGrowth: 0,
        bookingGrowth: 0,
        transactionGrowth: 0,
        monthlyRevenueGrowth: 0,
      },
      monthlyData: [
        { name: "Jan", Revenue: 0, bookings: 0, transactions: 0 },
        { name: "Feb", Revenue: 0, bookings: 0, transactions: 0 },
        { name: "Mar", Revenue: 0, bookings: 0, transactions: 0 },
        { name: "Apr", Revenue: 0, bookings: 0, transactions: 0 },
        { name: "May", Revenue: 0, bookings: 0, transactions: 0 },
        { name: "Jun", Revenue: 0, bookings: 0, transactions: 0 },
      ],
      recentTransactions: [],
    };
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
    const averageMonthlyRevenue = totalRevenue / 6; // Last 6 months average

    // Calculate growth (mock for now - would need historical data)
    const revenueGrowth = 12.5;
    const bookingGrowth = 8.2;
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
        totalTransactions,
        averageMonthlyRevenue,
        revenueGrowth,
        bookingGrowth,
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
        Revenue: data.revenue,
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
