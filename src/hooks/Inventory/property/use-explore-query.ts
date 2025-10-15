import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  PropertySortField,
  PriceSort,
} from "@/lib/types/inventory/property-types";
import { PropertyCategory } from "@/lib/types/enums/enums-type";

// Updated ExploreQueryState to use PriceSort enum
export interface ExploreQueryState {
  name: string;
  category?: PropertyCategory;
  guests?: string;
  sortBy?: PropertySortField;
  sortOrder?: PriceSort
  checkInDate?: string;
  checkOutDate?: string;
}

export const useExploreQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const mapPriceSort = (value: string | null): PriceSort | undefined => {
    if (!value) return undefined;
    if (value.toLowerCase() === "asc") return PriceSort.ASC;
    if (value.toLowerCase() === "desc") return PriceSort.DESC;
    return undefined;
  };

  const [query, setQuery] = useState<ExploreQueryState>({
    name: searchParams.get("name") || "",
    category: (searchParams.get("category") as PropertyCategory) || undefined,
    guests: searchParams.get("guests") || undefined,
    sortOrder: mapPriceSort(
      searchParams.get("priceSort") || searchParams.get("priceRange")
    ),
    sortBy: (searchParams.get("sortBy") as PropertySortField) || undefined,
    checkInDate: searchParams.get("checkInDate") || undefined,
    checkOutDate: searchParams.get("checkOutDate") || undefined,
  });

  useEffect(() => {
    setQuery({
      name: searchParams.get("name") || "",
      category: (searchParams.get("category") as PropertyCategory) || undefined,
      guests: searchParams.get("guests") || undefined,
      sortOrder: mapPriceSort(
        searchParams.get("priceSort") || searchParams.get("priceRange")
      ),
      sortBy: (searchParams.get("sortBy") as PropertySortField) || undefined,
      checkInDate: searchParams.get("checkInDate") || undefined,
      checkOutDate: searchParams.get("checkOutDate") || undefined,
    });
  }, [searchParams]);

  useEffect(() => {
    if (!pathname?.startsWith("/explore")) return;

    const params = new URLSearchParams();
    if (query.name) params.set("name", query.name);
    if (query.category) params.set("category", query.category);
    if (query.guests) params.set("guests", query.guests);
    if (query.sortOrder) params.set("priceSort", query.sortOrder);
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.checkInDate) params.set("checkInDate", query.checkInDate);
    if (query.checkOutDate) params.set("checkOutDate", query.checkOutDate);

    router.replace(`/explore?${params.toString()}`);
  }, [query, router, pathname]);

  return { query, setQuery };
};
