// app/room/[id]/page.tsx
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import RoomGallery from "@/components/room-details/room-gallery";
import RoomInfo from "@/components/room-details/room-info";
import BookingCard from "@/components/room-details/booking-card";

export default function RoomDetailsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Room Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#8B7355] mb-2">Ocean View Villa</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Seminyak, Bali</span>
            <span>•</span>
            <span>8 guests</span>
            <span>•</span>
            <span>4.9 ★ (128 reviews)</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <RoomGallery />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Info */}
          <div className="lg:col-span-2">
            <RoomInfo />
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}