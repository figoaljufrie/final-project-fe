"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export interface TenantProperty {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useTenantProperties() {
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/tenant/properties");
      const data = response.data.data || response.data;
      setProperties(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load properties";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    refetch: loadProperties,
  };
}
