"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard,
  Download,
  MessageCircle,
  Home,
  Star,
  Clock,
  Building2,
   ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { useBookingPaymentStatus } from "@/hooks/payment/use-payment-status";
import { toast } from "react-hot-toast";

export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { bookingData, isLoading, error, reloadBooking } = useBookingPaymentStatus(Number(bookingId));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/bookings/${bookingId}?from=success`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    // In real implementation, this would generate and download a PDF receipt
    toast('Receipt download feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-[#8B7355]" />
          <p className="text-gray-600">Loading booking data...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600 mb-4">{error || 'Booking not found'}</p>
          <Button onClick={reloadBooking} variant="outline">
            Try Again
          </Button>
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
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-[#8B7355] mb-2"
            >
              Payment Successful!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              Your booking has been confirmed and payment processed
            </motion.p>
          </div>

          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Confirmed</h3>
                  <p className="text-sm text-gray-600">Transaction completed successfully</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking No.</p>
                <p className="font-semibold text-[#8B7355]">{bookingData.bookingNo}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-green-600">Payment Method</p>
                <p className="font-semibold text-green-800 capitalize">
                  {bookingData.paymentMethod?.replace('_', ' ')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600">Amount Paid</p>
                <p className="font-semibold text-green-800">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600">Status</p>
                <p className="font-semibold text-green-800 capitalize">
                  {bookingData.status?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Property Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={property?.images[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={property?.name || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#8B7355] mb-2">{property?.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={16} />
                    <span>{property?.address}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Check-in</p>
                          <p className="text-sm text-gray-600">{formatDate(bookingData.checkIn)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Check-out</p>
                          <p className="text-sm text-gray-600">{formatDate(bookingData.checkOut)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Guests</p>
                          <p className="text-sm text-gray-600">{bookingData.totalGuests} guests</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-gray-600">{nights} nights</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#8B7355] mb-4">What's Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Confirmation Email</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive a confirmation email with all booking details within the next few minutes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Check-in Instructions</h4>
                      <p className="text-sm text-gray-600">
                        Detailed check-in instructions will be sent to your email 24 hours before your arrival.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Leave a Review</h4>
                      <p className="text-sm text-gray-600">
                        After your stay, help other travelers by leaving a review of your experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              {/* Payment Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#8B7355] mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Paid</span>
                      <span className="font-bold text-[#8B7355]">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#8B7355] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download size={16} className="mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Link href={`/bookings/${bookingId}?from=success`}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Building2 size={16} className="mr-2" />
                      View Booking Details
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button
                      className="w-full justify-start bg-[#8B7355] hover:bg-[#7A6349] text-white"
                    >
                      <Home size={16} className="mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Auto Redirect */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Auto Redirect</span>
                </div>
                <p className="text-sm text-blue-700">
                  Redirecting to booking details in {countdown} seconds...
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