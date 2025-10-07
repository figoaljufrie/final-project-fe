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

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),
    onSuccess: () => {
      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
    },
    onError: (error) => {
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      payload,
    }: {
      propertyId: number;
      payload: UpdatePropertyPayload;
    }) => updateProperty(propertyId, payload),
    onSuccess: () => {
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
    },
    onError: (error) => {
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => deleteProperty(propertyId),
    onSuccess: () => {
      toast.success("Property deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenantProperties"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
}