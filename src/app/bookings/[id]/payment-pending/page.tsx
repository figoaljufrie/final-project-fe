"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  CreditCard,
  RefreshCw,
  MessageCircle,
  Home,
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { formatTimeRemaining, getDeadlineText } from "@/lib/utils/payment-deadline";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentHeader } from "@/components/payment/payment-header";
import { PaymentCard } from "@/components/payment/payment-card";
import { PaymentPropertyCard } from "@/components/payment/payment-property-card";
import { PaymentSummaryCard } from "@/components/payment/payment-summary-card";
import { usePaymentTimer } from "@/hooks/payment/use-payment-timer";
import { usePaymentActions } from "@/hooks/payment/use-payment-actions";

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
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;

  const timeRemaining = usePaymentTimer(bookingData?.paymentDeadline);
  const { isChecking, handleCompletePayment, handleCheckStatus } = usePaymentActions(bookingData, bookingId);

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        console.log('Loaded booking data:', data);
        setBookingData(data);
        
        // Check if redirected from Midtrans
        const fromMidtrans = searchParams.get('from');
        if (fromMidtrans === 'pending') {
          toast("Payment is still being processed. Please wait for confirmation.");
        }
      } catch (error: unknown) {
        console.error('Error loading booking data:', error);
        toast.error('Failed to load booking data');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId, searchParams]);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading booking data"
        subMessage="Please wait while we fetch your payment information..."
      />
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
          <Link href="/" className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent hover:from-amber-700 hover:to-rose-700 transition-all duration-300">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const nights = bookingData.items[0]?.nights || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <PaymentHeader
            icon={Clock}
            title="Payment Pending"
            subtitle="Complete your payment to confirm your booking"
            iconBgColor="bg-gradient-to-br from-yellow-100 to-amber-100 border border-yellow-200/50"
            iconColor="text-yellow-600"
            titleColor="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent"
          />

          <PaymentCard delay={0.1} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center shadow-md">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Gateway</h3>
                  <p className="text-sm text-gray-600">Waiting for payment completion</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking No.</p>
                <p className="font-semibold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{bookingData.bookingNo}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Time Elapsed</span>
                </div>
                <div className="text-2xl font-mono font-bold text-yellow-800">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
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

            <div className="flex gap-3">
              <Button
                onClick={handleCompletePayment}
                disabled={!bookingData?.midtransPayment?.redirectUrl}
                className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <ExternalLink size={16} className="mr-2" />
                Complete Payment
              </Button>
              <Button
                onClick={handleCheckStatus}
                disabled={isChecking}
                variant="outline"
                className="border-gray-300/50 text-gray-700 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isChecking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
            </div>
          </PaymentCard>

          <div className="grid md:grid-cols-2 gap-6">
            <PaymentPropertyCard
              property={property}
              checkIn={bookingData.checkIn}
              checkOut={bookingData.checkOut}
              totalGuests={bookingData.totalGuests}
              nights={nights}
              delay={0.2}
            />

            <PaymentSummaryCard delay={0.3}>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-4">Payment Summary</h3>
              
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
                    <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Payment Gateway</p>
                    <p className="text-sm text-gray-600">Credit Card, Bank Transfer, E-wallet</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={20} className="text-blue-600" />
                  <h4 className="font-medium text-blue-900">Need Help?</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  If you&apos;re having trouble with payment, contact our support team.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300/50 text-blue-700 hover:bg-blue-100/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Contact Support
                </Button>
              </div>
            </PaymentSummaryCard>
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent hover:from-amber-700 hover:to-rose-700 transition-all duration-300"
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
