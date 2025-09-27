import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import HeroCarousel from "@/components/landing-page/hero-carousel";
import LocationGrid from "@/components/landing-page/location-grid";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header />
      <HeroCarousel />
      <LocationGrid />
      <Footer />
    </main>
  );
}
