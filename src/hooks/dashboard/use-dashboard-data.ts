import { useState, useEffect } from "react";
import {
  DashboardService,
  DashboardData,
  DashboardKPIData,
  MonthlyRevenueData,
  RecentTransaction,
} from "@/lib/services/dashboard/dashboard-service";

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await DashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      DashboardService.getDashboardData()
        .then(setDashboardData)
        .catch((err) => {
          setError(err.message || "Failed to load dashboard data");
        })
        .finally(() => setIsLoading(false));
    },
  };
}

export function useKPIData() {
  const [kpiData, setKpiData] = useState<DashboardKPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await DashboardService.getKPIData();
        setKpiData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load KPI data");
      } finally {
        setIsLoading(false);
      }
    };

    loadKPIData();
  }, []);

  return { kpiData, isLoading, error };
}

export function useMonthlyRevenueData() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await DashboardService.getMonthlyRevenueData();
        setMonthlyData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load monthly revenue data");
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyData();
  }, []);

  return { monthlyData, isLoading, error };
}

export function useRecentTransactions() {
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await DashboardService.getRecentTransactions();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Failed to load recent transactions");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return { transactions, isLoading, error };
}
