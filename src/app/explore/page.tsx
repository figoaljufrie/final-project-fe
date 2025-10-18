"use client";

import { useExploreQuery } from "@/hooks/Inventory/property/ui-state/use-explore-query";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import FilterSidebar from "@/components/explore-page/filter-sidebar";
import PropertyList from "@/components/explore-page/property-list";
import MapSection from "@/components/explore-page/map-section";
import { useState, useEffect } from "react";
import { usePublicProperties } from "@/hooks/Inventory/property/query/use-public-properties";
import {
  PropertySortField,
  PriceSort,
} from "@/lib/types/inventory/property-types";
import type { NearbyProperty } from "@/lib/types/inventory/property-types";
import { PropertyCategory } from "@/lib/types/enums/enums-type";

export default function ExplorePage() {
  const { query } = useExploreQuery();
  const [mapProperties, setMapProperties] = useState<NearbyProperty[]>([]);

  // Fetch properties based on current filters
  const { data } = usePublicProperties({
    page: 1,
    limit: 50, // Get more for map display
    name: query.name || undefined,
    category: query.category,
    sortBy: query.sortBy,
    sortOrder:
      query.sortBy === PropertySortField.PRICE
        ? query.sortOrder ?? PriceSort.ASC
        : undefined,
    checkInDate: query.checkInDate,
    checkOutDate: query.checkOutDate,
  });

  // Update map properties when data changes
  useEffect(() => {
    if (data?.properties) {
      const mappedProperties: NearbyProperty[] = data.properties
        .filter((p) => p.latitude && p.longitude) // Only include properties with coordinates
        .map((p) => ({
          id: p.id,
          name: p.name,
          latitude: p.latitude!,
          longitude: p.longitude!,
          address: p.address || null,
          city: p.city || "Unknown",
          province: p.province || "Unknown", // ✅ add province
          minPrice: p.minPrice || 0,
          category: p.category as PropertyCategory,
          distance: 0, // Will be calculated if needed
          images: p.images || [], // ✅ add images
        }));

      setMapProperties(mappedProperties);
    }
  }, [data]);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Header initialQuery={query.name} />

      <div className="flex-1 max-w-[1800px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content - Split View */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Property List Section */}
            <div className="flex-1 min-h-[600px]">
              <PropertyList
                pageType="explore"
                itemsPerPage={6}
                showCategoryFilter={true}
                showPagination={true}
                searchQuery={query}
              />
            </div>

            {/* Map Section - Now with properties */}
            <div className="w-full">
              <MapSection properties={mapProperties} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
