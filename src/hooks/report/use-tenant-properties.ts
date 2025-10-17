"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Property {
  id: number;
  name: string;
  address: string;
  description?: string;
  totalRooms?: number;
  basePrice?: number;
}

export function useTenantProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/tenant/properties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();
      setProperties(data.data || data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch properties";
      setError(errorMessage);
      console.error("Error fetching tenant properties:", err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties,
  };
}