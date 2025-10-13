"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { ReviewService } from "@/lib/services/review/review-service";
import { toast } from "react-hot-toast";

interface BookingData {
  id: number;
  bookingNo: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  items: Array<{
    room: {
      name: string;
      property: {
        id: number;
        name: string;
        address: string;
        images: Array<{ url: string }>;
      };
    };
    nights: number;
  }>;
}

export default function ReviewPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));

        // Check if booking is completed
        if (data.status !== "completed") {
          toast.error("You can only review completed bookings");
          router.push(`/bookings/${bookingId}`);
          return;
        }

        // Note: completed status means 1 day AFTER checkout date (automatic via cron job)
        // So if status is completed, it's already past checkout + 1 day

        setBookingData(data);
      } catch (error: unknown) {
        console.error("Error loading booking data:", error);
        toast.error("Failed to load booking data");
        router.push(`/bookings/${bookingId}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId, router]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get property ID from booking data
      const propertyId = bookingData?.items[0]?.room?.property?.id;
      if (!propertyId) {
        toast.error("Property information not found");
        return;
      }

      // Submit review using ReviewService
      await ReviewService.submitReview(
        Number(bookingId),
        rating,
        comment
      );

      toast.success("Review submitted successfully!");
      router.push(`/bookings/${bookingId}`);
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4 text-[#8B7355]"
          />
          <p className="text-gray-600">Loading booking data...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
          <Link href="/" className="text-[#8B7355] hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const nights = bookingData.items[0]?.nights || 0;

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/bookings/${bookingId}`}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-[#8B7355]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#8B7355]">
                Write a Review
              </h1>
              <p className="text-gray-600">
                Share your experience and help other travelers
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Property Review */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#8B7355] mb-4">
                  How was your stay?
                </h2>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overall Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= (hoveredRating || rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {rating === 0 && "Click to rate"}
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tell us about your experience *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details about your stay, what you liked, and any suggestions for improvement..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {comment.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || rating === 0 || !comment.trim()}
                  className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Submitting Review...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>

              {/* Review Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Review Guidelines
                </h3>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Be honest and constructive in your feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      Focus on your actual experience during your stay
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      Avoid personal information or inappropriate content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      Your review will help other travelers make informed
                      decisions
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Property Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Property Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={
                      property?.images[0]?.url ||
                      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={property?.name || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#8B7355] mb-2">
                    {property?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="text-sm">{property?.address}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {formatDate(bookingData.checkIn)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {formatDate(bookingData.checkOut)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">
                        {bookingData.totalGuests} • {nights} nights
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-green-600" />
                  <h3 className="font-bold text-green-800">Stay Completed</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your stay has been completed (1 day after checkout). Thank you
                  for choosing our property! Your review will help future guests
                  make informed decisions.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
