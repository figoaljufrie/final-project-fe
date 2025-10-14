"use client";

import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import BookingCard from "@/components/property-detail/booking-card";
import PropertyGallery from "@/components/property-detail/property-gallery";
import PropertyHost from "@/components/property-detail/property-host";
import PropertyInfo from "@/components/property-detail/property-info";
import RoomSelection from "@/components/property-detail/room-selection";
import { useState, useEffect } from "react";
import { usePropertyDetail } from "@/hooks/Inventory/property/use-property-detail";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

// Host interface
interface Host {
  name: string;
  rating: number;
  reviews: number;
}

// Simple mock reviews
const mockReviews = [
  {
    id: 1,
    userName: "Alice",
    rating: 5,
    comment: "Amazing stay!",
    date: "2025-10-13",
  },
  {
    id: 2,
    userName: "Bob",
    rating: 4,
    comment: "Very comfortable",
    date: "2025-10-12",
  },
];

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = Number(params.id);

  const {
    data: propertyData,
    isLoading,
    isError,
    refetch,
  } = usePropertyDetail(propertyId);

  // Room selection state (lifted up)
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set());

  // Host state
  const [host, setHost] = useState<Host | null>(null);
  const [hostLoading, setHostLoading] = useState(false);

  // Fetch host info
  useEffect(() => {
    if (!propertyData?.tenantId) return;

    const fetchHost = async () => {
      try {
        setHostLoading(true);
        const res = await fetch(`/api/tenants/${propertyData.tenantId}`);
        if (!res.ok) throw new Error("Failed to fetch host info");
        const data = await res.json();
        setHost({
          name: data.name,
          rating: data.rating ?? 4.9,
          reviews: data.reviews ?? 0,
        });
      } catch {
        setHost({ name: "Unknown", rating: 4.9, reviews: 0 });
      } finally {
        setHostLoading(false);
      }
    };

    fetchHost();
  }, [propertyData?.tenantId]);

  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading property details"
        subMessage="Please wait while we fetch the property information..."
      />
    );
  }
  if (isError || !propertyData)
    return (
      <section className="py-16 text-center text-red-500">
        <p>Failed to load property details.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </section>
    );

  // Map rooms for BookingCard with required shape
  const bookingRooms =
    propertyData.rooms?.map(
      (r: { id: number; name?: string; basePrice?: number }) => ({
        id: r.id,
        name: r.name ?? `Room ${r.id}`,
        basePrice: r.basePrice ?? 0,
      })
    ) ?? [];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Gallery - Full width */}
        <div className="mb-8">
          <PropertyGallery propertyId={propertyId} />
        </div>
        
        {/* Content Grid - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Property Info & Rooms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Name */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {propertyData.name}
              </h1>
              <p className="text-gray-600">{propertyData.address}</p>
            </div>

            {/* Property Info */}
            <PropertyInfo propertyId={propertyId} />

            {/* Room Selection */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Rooms</h2>
              <RoomSelection
                propertyId={propertyId}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
              />
            </div>

            {/* Host Info */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Your Host</h2>
              {hostLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 text-sm">Loading host info...</p>
                  </div>
                </div>
              ) : (
                <PropertyHost
                  host={host ?? { name: "Unknown", rating: 4.9, reviews: 0 }}
                />
              )}
            </div>
            
            {/* Reviews Section */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
              {mockReviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet for this property.</p>
              ) : (
                <div className="space-y-4">
                  {mockReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">{rev.userName}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-700">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{rev.comment}</p>
                      <p className="text-gray-400 text-sm">{rev.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard 
                selectedRooms={selectedRooms}
                rooms={bookingRooms}
                propertyId={propertyId}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
