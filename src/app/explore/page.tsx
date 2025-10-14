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
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <Header initialQuery={query.name} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        <div className="flex gap-8 h-full">
          <div className="w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex-1">
              <PropertyList
                pageType="explore"
                itemsPerPage={6}
                showCategoryFilter={true}
                showPagination={true}
                searchQuery={query} // pass full query object
              />
            </div>

            <div className="h-96 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
              {/* <MapSection /> */}
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm">Coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
