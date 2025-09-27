// app/explore/page.tsx
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import FilterSidebar from "@/components/explore-page/filter-sidebar";
import PropertyGrid from "@/components/explore-page/property-grid";
import MapSection from "@/components/explore-page/map-section";

export default function ExplorePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex gap-6 h-full">
          {/* Sidebar Filters */}
          <FilterSidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Property Grid */}
            <div className="flex-1">
              <PropertyGrid />
            </div>
            
            {/* Map Section */}
            <div className="h-96">
              <MapSection />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}