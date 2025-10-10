"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard,
  RefreshCw,
  MessageCircle,
  Home,
  AlertCircle,
  CheckCircle,
  Building2,
  ArrowRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { 
  calculateTimeRemaining, 
  formatTimeRemaining, 
  getDeadlineText,
  getDeadlineMessage 
} from "@/lib/utils/payment-deadline";

interface BookingData {
  id: number;
  bookingNo: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentDeadline?: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  items: Array<{
    room: {
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
      };
    };
    nights: number;
  }>;
  user: {
    name: string;
    email: string;
  };
  // Midtrans data can be in different structures
  midtransPayment?: {
    orderId: string;
    redirectUrl: string;
    token: string;
  };
  // Alternative structure from backend
  midtransToken?: string;
  midtransOrderId?: string;
  midtransStatus?: string;
}

export default function PaymentPending() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        console.log('Loaded booking data:', data);
        setBookingData(data);
        
        // Don't start automatic polling - let user manually check status
        // if (data.midtransPayment?.orderId) {
        //   startPaymentStatusPolling(data.midtransPayment.orderId);
        // }
      } catch (error: any) {
        console.error('Error loading booking data:', error);
        toast.error('Failed to load booking data');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId]);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update countdown timer every second
  useEffect(() => {
    if (!bookingData?.paymentDeadline) return;

    const updateTimer = () => {
      const result = calculateTimeRemaining(bookingData.paymentDeadline!);
      setTimeRemaining(result);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [bookingData?.paymentDeadline]);

  // Start payment status polling
  const startPaymentStatusPolling = async (orderId: string) => {
    try {
      const status = await PaymentService.pollPaymentStatus(orderId, 30, 3000);
      setPaymentStatus(status.transaction_status);
      
      // Redirect based on payment status
      if (status.transaction_status === 'settlement' || status.transaction_status === 'capture') {
        router.push(`/bookings/${bookingId}/payment-success`);
      } else if (['cancel', 'deny', 'expire', 'failure'].includes(status.transaction_status)) {
        router.push(`/bookings/${bookingId}/payment-error`);
      }
    } catch (error) {
      console.error('Payment status polling error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeOnly = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const orderId = bookingData?.midtransPayment?.orderId || (bookingData as any)?.midtransOrderId;
      if (orderId) {
        const status = await PaymentService.checkPaymentStatus(orderId);
        setPaymentStatus(status.transaction_status);
        
        // Only redirect if payment is actually completed
        if (status.transaction_status === 'settlement' || status.transaction_status === 'capture') {
          toast.success('Payment completed successfully!');
          router.push(`/bookings/${bookingId}/payment-success`);
        } else if (['cancel', 'deny', 'expire', 'failure'].includes(status.transaction_status)) {
          toast.error('Payment failed or was cancelled');
          router.push(`/bookings/${bookingId}/payment-error`);
        } else {
          toast('Payment is still pending');
        }
      } else {
        toast('Payment is still pending');
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCompletePayment = () => {
    console.log('Complete Payment clicked');
    console.log('Booking data:', bookingData);
    
    // Check for redirectUrl in different possible locations
    const redirectUrl = bookingData?.midtransPayment?.redirectUrl || 
                       (bookingData as any)?.redirectUrl ||
                       (bookingData as any)?.midtransRedirectUrl;
    
    console.log('Redirect URL found:', redirectUrl);
    
    if (redirectUrl) {
      console.log('Redirecting to:', redirectUrl);
      // Use window.location.href instead of window.open for better compatibility
      window.location.href = redirectUrl;
    } else {
      // Try to construct redirect URL from token
      const token = bookingData?.midtransPayment?.token || (bookingData as any)?.midtransToken;
      if (token) {
        const constructedUrl = `https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`;
        console.log('Constructed redirect URL:', constructedUrl);
        window.location.href = constructedUrl;
      } else {
        console.error('No payment URL or token available');
        console.log('Available data:', {
          bookingData: !!bookingData,
          midtransPayment: !!bookingData?.midtransPayment,
          redirectUrl: bookingData?.midtransPayment?.redirectUrl,
          token: bookingData?.midtransPayment?.token || (bookingData as any)?.midtransToken
        });
        toast.error('Payment URL not available. Please refresh the page.');
      }
    }
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

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Clock className="w-8 h-8 text-yellow-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[#8B7355] mb-2">Payment Pending</h1>
            <p className="text-gray-600">Complete your payment to confirm your booking</p>
          </div>

          {/* Payment Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Gateway</h3>
                  <p className="text-sm text-gray-600">Waiting for payment completion</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking No.</p>
                <p className="font-semibold text-[#8B7355]">{bookingData.bookingNo}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Time Elapsed</span>
                </div>
                <div className="text-2xl font-mono font-bold text-yellow-800">
                  {formatTime(timeElapsed)}
                </div>
              </div>
              
              {!timeRemaining.isExpired && (
                <div className="mt-2 pt-2 border-t border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">Time Remaining</span>
                    <span className="text-sm font-medium text-yellow-800">
                      {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-yellow-600">
                      Deadline: {getDeadlineText(bookingData.paymentMethod)} from booking creation
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCompletePayment}
                disabled={!bookingData?.midtransPayment?.redirectUrl && !(bookingData as any)?.midtransToken}
                className="flex-1 bg-[#8B7355] hover:bg-[#7A6349] text-white disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <ExternalLink size={16} className="mr-2" />
                Complete Payment
              </Button>
              <Button
                onClick={handleCheckStatus}
                disabled={isChecking}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {isChecking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
            </div>
          </motion.div>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={property?.images[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={property?.name || "Property"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#8B7355] mb-2">{property?.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={16} />
                  <span className="text-sm">{property?.address}</span>
                </div>
                
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
                  
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Guests</p>
                      <p className="text-sm text-gray-600">{bookingData.totalGuests} guests • {nights} nights</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">Payment Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">Rp 0</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-[#8B7355]">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Payment Gateway</p>
                    <p className="text-sm text-gray-600">Credit Card, Bank Transfer, E-wallet</p>
                  </div>
                </div>
              </div>

              {/* Contact Host */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={20} className="text-blue-600" />
                  <h4 className="font-medium text-blue-900">Need Help?</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  If you're having trouble with payment, contact our support team.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Contact Support
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors"
            >
              <Home size={16} />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}