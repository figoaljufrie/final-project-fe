"use client";

import api from "@/lib/api"; // assuming your api wrapper types response
import { useEffect, useState } from "react";
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

interface TenantPropertiesResponse {
  data: TenantProperty[];
}

export function useTenantProperties() {
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<TenantPropertiesResponse>(
        "/tenant/properties"
      );
      const data = response.data?.data ?? [];
      setProperties(data);
    } catch (err: unknown) {
      let errorMessage = "Failed to load properties";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message === "string"
      ) {
        errorMessage = (err as { response?: { data?: { message: string } } })
          .response!.data!.message;
      }

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
