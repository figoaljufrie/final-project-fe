"use client";

import { useExploreQuery } from "@/hooks/Inventory/property/use-explore-query";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import FilterSidebar from "@/components/explore-page/filter-sidebar";
import PropertyList from "@/components/explore-page/property-list";
// import MapSection from "@/components/explore-page/map-section";

export default function ExplorePage() {
  const { query } = useExploreQuery();

  return (
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header initialQuery={query.name} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex gap-6 h-full">
          <FilterSidebar />

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex-1">
              <PropertyList
                pageType="explore"
                itemsPerPage={6}
                showCategoryFilter={true}
                showPagination={true}
                searchQuery={query} // pass full query object
              />
            </div>

            <div className="h-96">
              {/* <MapSection /> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
