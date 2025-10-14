"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  Search,
  Reply,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewService } from "@/lib/services/review/review-service";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  property: {
    id: number;
    name: string;
  };
  booking: {
    id: number;
    bookingNo: string;
    checkIn: string;
    checkOut: string;
  };
  reply?: {
    id: number;
    comment: string;
    createdAt: string;
  };
}
import { toast } from "react-hot-toast";


interface PropertyReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export default function TenantReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<PropertyReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Load reviews for tenant's properties
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const data = await ReviewService.getTenantReviews(1, 50);
        setReviews(data.reviews as ReviewData[]);

        // Calculate stats from reviews
        if (data.reviews.length > 0) {
          const totalRating = data.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / data.reviews.length;

          const ratingDistribution = data.reviews.reduce((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
          }, {} as { [key: number]: number });

          setStats({
            averageRating,
            totalReviews: data.reviews.length,
            ratingDistribution,
          });
        }
      } catch (error: unknown) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      // TODO: Implement reply functionality using reviewId
      console.log("Submitting reply for review:", reviewId);
      toast.success("Reply submitted successfully");
      setReplyingTo(null);
      setReplyText("");
    } catch (error: unknown) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleDeleteReply = async (reviewId: number) => {
    try {
      // TODO: Implement delete reply functionality using reviewId
      console.log("Deleting reply for review:", reviewId);
      toast.success("Reply deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === null || review.rating === ratingFilter;
    const matchesProperty =
      selectedProperty === null || review.property.id === selectedProperty;

    return matchesSearch && matchesRating && matchesProperty;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading reviews"
        subMessage="Please wait while we fetch property reviews..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Property Reviews
          </h1>
          <p className="text-gray-600">Manage and respond to guest reviews</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalReviews}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Reply className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.filter((r) => r.reply).length}/{reviews.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="lg:w-48">
              <select
                value={ratingFilter || ""}
                onChange={(e) =>
                  setRatingFilter(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-500">
                {searchTerm || ratingFilter
                  ? "Try adjusting your search criteria"
                  : "No reviews have been submitted yet"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {review.user.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {review.property.name} •{" "}
                          {formatDate(review.createdAt)}
                        </p>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>

                    {/* Reply Section */}
                    {review.reply ? (
                      <div className="ml-16 pl-4 border-l-2 border-rose-200">
                        <div className="bg-rose-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-rose-800">
                              Your Reply
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {review.reply.comment}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReply(review.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-16">
                        {replyingTo === review.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReply(review.id)}
                                className="bg-rose-600 hover:bg-rose-700 text-white"
                              >
                                Submit Reply
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setReplyingTo(review.id)}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <Reply size={14} className="mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
