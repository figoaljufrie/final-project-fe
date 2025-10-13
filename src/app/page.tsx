"use client";

import PropertyList from "@/components/explore-page/property-list";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import HeroCarousel from "@/components/landing-page/hero-carousel";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header />

      <HeroCarousel />

      <PropertyList
        pageType="landing"
        itemsPerPage={20}
        showCategoryFilter={true}
        showPagination={true}
      />

      <Footer />
    </main>
  );
}
