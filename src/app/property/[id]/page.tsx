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

  if (isLoading)
    return (
      <p className="py-16 text-center text-gray-500">
        Loading property details...
      </p>
    );
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
    <main className="flex flex-col min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Property Name */}
        <h1 className="text-3xl font-bold text-[#8B7355] mb-6">
          {propertyData.name}
        </h1>

        {/* Gallery */}
        <div className="mb-6">
          <PropertyGallery propertyId={propertyId} />
        </div>

        {/* Property Info */}
        <div className="mb-6">
          <PropertyInfo propertyId={propertyId} />
        </div>

        {/* Host Info */}
        <div className="mb-6">
          {hostLoading ? (
            <p className="text-gray-500">Loading host info...</p>
          ) : (
            <PropertyHost
              host={host ?? { name: "Unknown", rating: 4.9, reviews: 0 }}
            />
          )}
        </div>

        {/* Rooms & Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RoomSelection
              propertyId={propertyId}
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingCard 
              selectedRooms={selectedRooms} 
              rooms={bookingRooms} 
              propertyId={propertyId}
            />
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {mockReviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {mockReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white rounded shadow-sm border"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{rev.userName}</span>
                    <span className="text-yellow-500">{rev.rating} ★</span>
                  </div>
                  <p className="text-gray-700">{rev.comment}</p>
                  <p className="text-gray-400 text-sm mt-1">{rev.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
