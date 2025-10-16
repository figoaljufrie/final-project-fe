"use client";

import { Button } from "@/components/ui/button";
import { CardLoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ExploreQueryState,
  useExploreQuery,
} from "@/hooks/Inventory/property/ui-state/use-explore-query";
import { usePublicProperties } from "@/hooks/Inventory/property/query/use-public-properties";
import { PropertyCategory } from "@/lib/types/enums/enums-type";
import {
  PriceSort,
  PropertySortField,
} from "@/lib/types/inventory/property-types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../landing-page/property-card";

interface PropertyListProps {
  pageType?: "landing" | "explore";
  itemsPerPage?: number;
  showCategoryFilter?: boolean;
  showPagination?: boolean;
  searchQuery?: ExploreQueryState; // <-- accept query from parent
}

export default function PropertyList({
  pageType = "explore",
  itemsPerPage = 6,
  showCategoryFilter = true,
  showPagination = true,
  searchQuery,
}: PropertyListProps) {
  const router = useRouter();
  const { query: internalQuery, setQuery } = useExploreQuery();
  const query = searchQuery ?? internalQuery; // <-- prioritize prop if provided
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch properties from backend, now including guests, priceSort, and dates
  const { data, isLoading, isError, refetch } = usePublicProperties({
    page: currentPage,
    limit: itemsPerPage,
    name: pageType === "explore" ? query.name || undefined : undefined,
    category: query.category,
    sortBy: query.sortBy,
    sortOrder:
      query.sortBy === PropertySortField.PRICE
        ? query.sortOrder ?? PriceSort.ASC
        : undefined, // <-- pass sortBy as well
    checkInDate: query.checkInDate,
    checkOutDate: query.checkOutDate,
  });

  const properties = useMemo(() => data?.properties ?? [], [data]);
  const pagination = data?.pagination ?? {
    page: 1,
    limit: itemsPerPage,
    total: 0,
    totalPages: 1,
  };

  // Generate categories dynamically
  const categories = useMemo(() => {
    if (properties.length === 0) return ["All"];
    return ["All", ...Array.from(new Set(properties.map((p) => p.category)))];
  }, [properties]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    query.name,
    query.category,
    query.guests,
    query.sortOrder,
    query.checkInDate,
    query.checkOutDate,
  ]);

  // Refetch properties whenever the query or current page changes
  useEffect(() => {
    refetch();
  }, [
    query.name,
    query.category,
    query.guests,
    query.sortOrder,
    query.checkInDate,
    query.checkOutDate,
    currentPage,
    refetch,
  ]);

  const toggleSave = (id: number) => {
    console.log("Saved toggled:", id);
  };

  if (isLoading) {
    return (
      <section className="py-16 flex items-center justify-center">
        <CardLoadingSpinner
          message="Loading properties"
          subMessage="Please wait while we fetch available properties..."
        />
      </section>
    );
  }

  if (isError)
    return (
      <section className="py-16 text-center text-red-500">
        <p>Failed to load properties.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </section>
    );

  if (properties.length === 0)
    return (
      <section className="py-16 text-center text-gray-500">
        <p>No properties available at the moment.</p>
      </section>
    );

  return (
    <section
      className={
        pageType === "landing"
          ? "py-16 px-4"
          : "p-6 bg-white rounded-lg shadow-lg"
      }
    >
      {/* Landing page header */}
      {pageType === "landing" && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect place to stay from our curated collection
          </p>
        </div>
      )}

      {/* Category Filter */}
      {showCategoryFilter && (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((cat) => {
            const categoryValue: "All" | PropertyCategory =
              cat === "All" ? "All" : (cat as PropertyCategory);

            return (
              <Button
                key={cat}
                variant={
                  query.category === categoryValue ||
                  (categoryValue === "All" && !query.category)
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setQuery({
                    ...query,
                    category:
                      categoryValue === "All" ? undefined : categoryValue,
                  });
                  setCurrentPage(1);
                }}
              >
                {cat}
              </Button>
            );
          })}
        </div>
      )}

      {/* Property Grid */}
      <motion.div
        className={
          pageType === "landing"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        }
        layout
      >
        {properties.map((p) => {
          const primaryImage =
            p.images?.find((img) => img.isPrimary)?.url ||
            p.images?.[0]?.url ||
            "https://via.placeholder.com/400x300?text=No+Image";

          const minPrice = p.minPrice ?? 0;
          const city = p.city ?? "Unknown Location";

          return (
            <PropertyCard
              key={p.id}
              id={p.id}
              name={p.name}
              location={city}
              price={minPrice}
              rating={4.8}
              reviews={120}
              image={primaryImage}
              saved={false}
              category={p.category}
              onToggleSave={toggleSave}
              onView={(id) => router.push(`/property/${id}`)}
              onClick={() => router.push(`/property/${p.id}`)}
            />
          );
        })}
      </motion.div>

      {/* Pagination */}
      {showPagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 gap-2">
          <Button
            onClick={() =>
              currentPage > 1 && setCurrentPage((prev) => prev - 1)
            }
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="px-2">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            onClick={() =>
              currentPage < pagination.totalPages &&
              setCurrentPage((prev) => prev + 1)
            }
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
