// lib/hooks/inventory/use-tenant-properties.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenantProperties } from "@/lib/services/Inventory/property/property-service";

export function useTenantProperties() {
  return useQuery({
    queryKey: ["tenantProperties"],
    queryFn: getTenantProperties,
  });
}