import api from "../../api";

export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

export interface SubmitReviewRequest {
  bookingId: number;
  rating: number;
  comment: string;
}

export interface SubmitReviewResponse {
  review: ReviewData;
  message: string;
}

export interface PropertyReviewsResponse {
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export class ReviewService {
  // Submit a review for a completed booking
  static async submitReview(
    bookingId: number,
    rating: number,
    comment: string
  ): Promise<SubmitReviewResponse> {
    try {
      const response = await api.post("/reviews", {
        bookingId,
        rating,
        comment,
      });

      return response.data.data;
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      throw new Error(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }

  // Get reviews for a specific property
  static async getPropertyReviews(
    propertyId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PropertyReviewsResponse> {
    try {
      const response = await api.get(
        `/reviews/property/${propertyId}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching property reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }

  // Get user's reviews
  static async getUserReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: ReviewData[]; pagination: Record<string, unknown> }> {
    try {
      const response = await api.get(
        `/reviews/user/my-reviews?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching user reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user reviews"
      );
    }
  }

  // Check if user can review a booking
  static async canReviewBooking(bookingId: number): Promise<boolean> {
    try {
      const response = await api.get(
        `/reviews/eligibility/booking/${bookingId}`
      );
      return response.data.data.canReview;
    } catch (error: unknown) {
      console.error("Error checking review eligibility:", error);
      return false;
    }
  }

  // Get tenant's property reviews
  static async getTenantReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<{ reviews: ReviewData[]; pagination: Record<string, unknown> }> {
    try {
      const response = await api.get(
        `/reviews/tenant/my-reviews?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching tenant reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch tenant reviews"
      );
    }
  }

  // Get review statistics for a property
  static async getPropertyReviewStats(propertyId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      const response = await api.get(`/reviews/property/${propertyId}/stats`);
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching review stats:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch review statistics"
      );
    }
  }
}
