"use client";

import { useExploreQuery } from "@/hooks/Inventory/property/ui-state/use-explore-query"
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import FilterSidebar from "@/components/explore-page/filter-sidebar";
import PropertyList from "@/components/explore-page/property-list";
import MapSection from "@/components/explore-page/map-section";

export default function ExplorePage() {
  const { query } = useExploreQuery();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Header initialQuery={query.name} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Property List */}
            <div className="flex-1">
              <PropertyList
                pageType="explore"
                itemsPerPage={6}
                showCategoryFilter={true}
                showPagination={true}
                searchQuery={query} // pass full query object
              />
            </div>

            {/* Map Section */}
            <div className="h-[500px] md:h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <MapSection />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
