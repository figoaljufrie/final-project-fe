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

// Import ReviewService
import { ReviewService, ReviewData } from "@/lib/services/review/review-service";

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

  // Reviews state
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          ReviewService.getPropertyReviews(propertyId, 1, 10),
          ReviewService.getPropertyReviewStats(propertyId)
        ]);
        setReviews(reviewsData.reviews);
        setReviewStats({
          averageRating: statsData.averageRating,
          totalReviews: statsData.totalReviews
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to empty state
        setReviews([]);
        setReviewStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setReviewsLoading(false);
      }
    };

    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Reviews
                </h2>
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-800">{reviewStats.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{reviewStats.totalReviews} reviews</span>
                  </div>
                )}
              </div>
              
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 text-sm">Loading reviews...</p>
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-gray-500">No reviews yet for this property.</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {review.user.name[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{review.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-yellow-500" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
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
