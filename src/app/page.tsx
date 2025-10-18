"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyList from "@/components/explore-page/property-list";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import HeroCarousel from "@/components/landing-page/hero-carousel";
import TopLocations from "@/components/landing-page/top-location";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle Midtrans redirects
    const from = searchParams.get("from");
    const orderId = searchParams.get("order_id");

    if (from && orderId) {
      // Extract booking ID from order_id: "BOOKING-21-1234567890"
      const bookingIdMatch = orderId.match(/BOOKING-(\d+)-\d+/);
      if (bookingIdMatch) {
        const bookingId = bookingIdMatch[1];

        if (from === "success") {
          router.replace(`/bookings/${bookingId}/payment-success?from=success`);
          return;
        }

        if (from === "error") {
          router.replace(`/bookings/${bookingId}/payment-error?from=error`);
          return;
        }

        if (from === "pending") {
          router.replace(`/bookings/${bookingId}/payment-pending?from=pending`);
          return;
        }
      }
    }
  }, [router, searchParams]);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <HeroCarousel />

      <TopLocations />

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
