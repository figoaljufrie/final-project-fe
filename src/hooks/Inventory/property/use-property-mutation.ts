// lib/hooks/inventory/use-property-mutations.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/services/Inventory/property/property-service";
import type {
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "@/lib/types/inventory/property-types";

// ✅ CREATE
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),
    onSuccess: () => {
      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to create property: ${message}`);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      payload,
      files,
    }: {
      propertyId: number;
      payload: UpdatePropertyPayload;
      files?: File[];
    }) => updateProperty(propertyId, payload, files),
    onSuccess: (data, variables) => {
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
      queryClient.invalidateQueries({
        queryKey: ["property", variables.propertyId],
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to update property: ${message}`);
    },
  });
}

// ✅ DELETE
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => deleteProperty(propertyId),
    onSuccess: () => {
      toast.success("Property deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to delete property: ${message}`);
    },
  });
}
