"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  XCircle, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard,
  RefreshCw,
  MessageCircle,
  Home,
  AlertTriangle,
  Building2,
  Clock,
  HelpCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useBookingPaymentStatus } from "@/hooks/payment/use-payment-status";
import { toast } from "react-hot-toast";
import { 
  calculateTimeRemaining, 
  formatTimeRemaining, 
  getDeadlineText 
} from "@/lib/utils/payment-deadline";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

export default function PaymentError() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const params = useParams();
  const bookingId = params.id as string;

  const { bookingData, isLoading, error, reloadBooking } = useBookingPaymentStatus(Number(bookingId));

  // Update countdown timer every second - moved to top to avoid conditional hook
  useEffect(() => {
    if (!bookingData?.paymentDeadline) return;

    const updateTimer = () => {
      if (bookingData.paymentDeadline && typeof bookingData.paymentDeadline === 'string') {
        const result = calculateTimeRemaining(bookingData.paymentDeadline);
        setTimeRemaining(result);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [bookingData?.paymentDeadline]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const handleRetryPayment = async () => {
    if (!bookingData) return;
    
    setIsRetrying(true);
    try {
      // In real implementation, this would redirect to payment gateway
      const midtransPayment = bookingData.midtransPayment as { redirectUrl?: string } | undefined;
      if (midtransPayment?.redirectUrl) {
        window.open(midtransPayment.redirectUrl, '_blank');
      } else {
        toast.error('Payment URL not available');
      }
    } catch (error: unknown) {
      console.error('Retry payment error:', error);
      toast.error('Failed to retry payment');
    } finally {
    setIsRetrying(false);
    }
  };

  const handleContactSupport = () => {
    // In real implementation, this would open support chat or redirect to support page
    toast('Support contact feature coming soon!');
  };

  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading booking data"
        subMessage="Please wait while we fetch your payment information..."
      />
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
        </div>
      </div>
    );
  }

  // At this point, bookingData is guaranteed to be non-null due to the check above
  // Use type assertion with proper typing
  const safeBookingData = bookingData as {
    id: number;
    bookingNo: string;
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    totalAmount: number;
    paymentMethod: string;
    paymentDeadline?: string;
    items: Array<{ room?: { property?: Record<string, unknown> }; nights?: number }>;
    midtransPayment?: { redirectUrl?: string };
  };
  
  const items = safeBookingData.items;
  const property = items?.[0]?.room?.property;
  const nights = items?.[0]?.nights || 0;


  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Error Header */}
          <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-[#8B7355] mb-2"
            >
              Payment Failed
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              We encountered an issue processing your payment
            </motion.p>
          </div>

          {/* Error Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Failed</h3>
                  <p className="text-sm text-gray-600">Transaction could not be completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking No.</p>
                <p className="font-semibold text-[#8B7355]">{safeBookingData.bookingNo}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">What went wrong?</h4>
                  <p className="text-red-700 text-sm">
                    Your payment was declined or failed to process. This could be due to insufficient funds, 
                    incorrect card details, or network issues. Don&apos;t worry - your booking is still reserved.
                  </p>
                  </div>
                </div>
              </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="flex-1 bg-[#8B7355] hover:bg-[#7A6349] text-white"
              >
                {isRetrying ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="mr-2" />
                    Retry Payment
                  </>
                )}
              </Button>
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Support
              </Button>
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
                    src={(property?.images as Array<{ url?: string }> | undefined)?.[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={(property?.name as string) || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#8B7355] mb-2">{(property?.name as string) || "Property"}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={16} />
                    <span>{(property?.address as string) || "Address not available"}</span>
                    </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gray-500" />
                    <div>
                          <p className="text-sm font-medium">Check-in</p>
                          <p className="text-sm text-gray-600">{formatDate(safeBookingData.checkIn)}</p>
                    </div>
                    </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-gray-500" />
                    <div>
                          <p className="text-sm font-medium">Check-out</p>
                          <p className="text-sm text-gray-600">{formatDate(safeBookingData.checkOut)}</p>
                    </div>
                  </div>
                </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-gray-500" />
                    <div>
                          <p className="text-sm font-medium">Guests</p>
                          <p className="text-sm text-gray-600">{safeBookingData.totalGuests} guests</p>
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

              {/* Troubleshooting */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#8B7355] mb-4">Troubleshooting Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CreditCard size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Check Your Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        Ensure your card has sufficient funds and the details are correct. 
                        Try using a different payment method if available.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <RefreshCw size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Try Again</h4>
                      <p className="text-sm text-gray-600">
                        Sometimes payment failures are temporary. Wait a few minutes and try again.
                      </p>
                </div>
              </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle size={16} className="text-green-600" />
                    </div>
                <div>
                      <h4 className="font-semibold text-gray-900">Contact Support</h4>
                      <p className="text-sm text-gray-600">
                        If the problem persists, our support team is here to help you complete your booking.
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
                    <span className="font-medium">Rp {safeBookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">$0</span>
                    </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-bold text-[#8B7355]">Rp {safeBookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
              </div>
                  </div>
                </div>

              {/* Payment Deadline */}
              {safeBookingData.paymentDeadline && !timeRemaining.isExpired && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-orange-600" />
                    <h3 className="font-bold text-orange-800">Payment Deadline</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-800">
                      {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
                    </div>
                    <p className="text-sm text-orange-600">
                      Time remaining to complete payment
                    </p>
                    <p className="text-xs text-orange-500 mt-1">
                      Complete within {getDeadlineText(safeBookingData.paymentMethod)} from booking creation
                    </p>
                </div>
              </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#8B7355] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryPayment}
                    disabled={isRetrying}
                    className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Retry Payment
                      </>
                    )}
                  </Button>
                  
                  <Link href={`/bookings/${bookingId}?from=error`}>
                  <Button 
                    variant="outline" 
                      className="w-full justify-start"
                  >
                      <Building2 size={16} className="mr-2" />
                      View Booking Details
                  </Button>
                  </Link>
                  
                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <HelpCircle size={16} className="mr-2" />
                    Get Help
                  </Button>
                  
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Home size={16} className="mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
