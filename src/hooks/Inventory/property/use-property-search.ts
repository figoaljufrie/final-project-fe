import { useState } from "react";
import { useRouter } from "next/navigation";
import * as propertyService from "@/lib/services/Inventory/property/property-service";
import type {
  PropertySearchQuery,
  PropertyListItem,
} from "@/lib/types/inventory/property-types";

interface UsePropertySearchOptions {
  /** Redirect to search page instead of returning results */
  redirectToPage?: boolean;
  /** Optional: initial query */
  initialQuery?: string;
}

export const usePropertySearch = ({
  redirectToPage = true,
  initialQuery = "",
}: UsePropertySearchOptions = {}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    const query: PropertySearchQuery = {
      name: searchQuery.trim(),
      page: 1,
      limit: 10,
    };

    try {
      if (redirectToPage) {
        // Redirect to search page with query param
        router.push(`/explore?name=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // Fetch results and store in state
        const res = await propertyService.searchProperties(query);
        setResults(res.properties); // assuming res.properties is PropertyListItem[]
      }
    } catch (err: unknown) {
      console.error("Property search error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to search properties";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    error,
    handleSearch,
  };
};
