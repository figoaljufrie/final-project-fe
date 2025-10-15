"use client";

import { PropertyCategory } from "@/lib/types/enums/enums-type";
import {
  PriceSort,
  PropertySortField,
} from "@/lib/types/inventory/property-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePublicProperties } from "./use-public-properties";

export interface FilterState {
  propertyTypes: string[];
  guests: string;
  priceRange: string;
  sortBy: PropertySortField | "";
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
}

export const usePropertyFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from query params if any
  const initialCategory = searchParams.get("category") || "";
  const initialGuests = searchParams.get("guests") || "";
  const initialPrice = searchParams.get("priceRange") || "";
  const initialSortBy = (searchParams.get("sortBy") as PropertySortField) || "";
  const initialCheckIn = searchParams.get("checkInDate") || "";
  const initialCheckOut = searchParams.get("checkOutDate") || "";

  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: initialCategory ? [initialCategory] : [],
    guests: initialGuests,
    priceRange: initialPrice,
    sortBy: initialSortBy,
    checkInDate: initialCheckIn,
    checkOutDate: initialCheckOut,
  });

  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    guests: true,
    price: true,
    date: true,
    sortBy: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleGuestChange = (guest: string) => {
    setFilters((prev) => ({ ...prev, guests: guest }));
  };

  const handlePriceChange = (price: string) => {
    setFilters((prev) => ({ ...prev, priceRange: price }));
  };

  const handleSortChange = (sortBy: PropertySortField) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleCheckInChange = (date: string) => {
    setFilters((prev) => ({ ...prev, checkInDate: date }));
  };

  const handleCheckOutChange = (date: string) => {
    setFilters((prev) => ({ ...prev, checkOutDate: date }));
  };

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      guests: "",
      priceRange: "",
      sortBy: "",
      checkInDate: "",
      checkOutDate: "",
    });
  };

  // Build search query for back-end
  const query = {
    name: searchParams.get("name") || "",
    page: 1,
    limit: 10,
    category: filters.propertyTypes[0] as PropertyCategory | undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder:
      filters.priceRange === "highest" ? PriceSort.DESC : PriceSort.ASC,
    guests: filters.guests || undefined,
    checkInDate: filters.checkInDate || undefined,
    checkOutDate: filters.checkOutDate || undefined,
  };

  const { data, isLoading, refetch } = usePublicProperties(query);

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchParams.get("name")) params.set("name", searchParams.get("name")!);
    if (filters.propertyTypes.length > 0)
      params.set("category", filters.propertyTypes[0]);
    if (filters.guests) params.set("guests", filters.guests);
    if (filters.priceRange) params.set("priceRange", filters.priceRange);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.checkInDate) params.set("checkInDate", filters.checkInDate);
    if (filters.checkOutDate) params.set("checkOutDate", filters.checkOutDate);

    router.replace(`/explore?${params.toString()}`);
  }, [filters, searchParams, router]);

  // Refetch whenever query changes
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  return {
    filters,
    setFilters,
    expandedSections,
    toggleSection,
    togglePropertyType,
    handleGuestChange,
    handlePriceChange,
    handleSortChange,
    handleCheckInChange,
    handleCheckOutChange,
    clearFilters,
    searchResult: data,
    isLoading,
  };
};
