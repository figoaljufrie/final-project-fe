"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  XCircle, 
  RefreshCw,
  MessageCircle,
  Home,
  AlertTriangle,
  Building2,
  HelpCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useBookingPaymentStatus } from "@/hooks/payment/use-payment-status";
import { toast } from "react-hot-toast";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentHeader } from "@/components/payment/payment-header";
import { PaymentCard } from "@/components/payment/payment-card";
import { PaymentPropertyCard } from "@/components/payment/payment-property-card";
import { PaymentTroubleshootingCard } from "@/components/payment/payment-troubleshooting-card";
import { PaymentSummaryCard } from "@/components/payment/payment-summary-card";
import { PaymentActionsCard } from "@/components/payment/payment-actions-card";
import { PaymentDeadlineCard } from "@/components/payment/payment-deadline-card";
import { usePaymentTimer } from "@/hooks/payment/use-payment-timer";
import { usePaymentActions } from "@/hooks/payment/use-payment-actions";

export default function PaymentError() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;

  const { bookingData, isLoading, error, reloadBooking } = useBookingPaymentStatus(Number(bookingId));
  const timeRemaining = usePaymentTimer(bookingData?.paymentDeadline as string);
  const { isRetrying, handleRetryPayment, handleContactSupport } = usePaymentActions(bookingData, bookingId);

  // Check if redirected from Midtrans
  useEffect(() => {
    const fromMidtrans = searchParams.get('from');
    if (fromMidtrans === 'error') {
      toast.error("Payment failed. Redirected from payment gateway.");
    }
  }, [searchParams]);

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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
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

  const items = bookingData.items as Array<{ room?: { property?: { name: string; address: string; images: Array<{ url: string }> } }; nights?: number }>;
  const property = items?.[0]?.room?.property;
  const nights = items?.[0]?.nights || 0;


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
            icon={XCircle}
            title="Payment Failed"
            subtitle="We encountered an issue processing your payment"
            iconBgColor="bg-gradient-to-br from-red-100 to-rose-100 border border-red-200/50"
            iconColor="text-red-600"
            titleColor="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent"
          />

          <PaymentCard delay={0.5} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center shadow-md">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Failed</h3>
                  <p className="text-sm text-gray-600">Transaction could not be completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Booking No.</p>
                <p className="font-semibold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{bookingData.bookingNo as string}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
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

            <div className="flex gap-3">
              <Button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                className="border-gray-300/50 text-gray-700 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Support
              </Button>
            </div>
          </PaymentCard>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PaymentPropertyCard
                property={property as { name: string; address: string; images: Array<{ url: string }> }}
                checkIn={bookingData.checkIn as string}
                checkOut={bookingData.checkOut as string}
                totalGuests={bookingData.totalGuests as number}
                nights={nights}
                delay={0.6}
              />

              <PaymentTroubleshootingCard delay={0.7} />
            </div>

            <div className="space-y-6">
              <PaymentSummaryCard delay={0.7}>
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rp {(bookingData.totalAmount as number).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Rp {(bookingData.totalAmount as number).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </PaymentSummaryCard>

              <PaymentDeadlineCard
                paymentDeadline={bookingData.paymentDeadline as string || ""}
                paymentMethod={bookingData.paymentMethod as string}
                timeRemaining={timeRemaining}
                delay={0.8}
              />

              <PaymentActionsCard delay={0.9}>
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryPayment}
                    disabled={isRetrying}
                    className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                      className="w-full justify-start border-gray-300/50 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Building2 size={16} className="mr-2" />
                      View Booking Details
                    </Button>
                  </Link>
                  
                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="w-full justify-start border-gray-300/50 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <HelpCircle size={16} className="mr-2" />
                    Get Help
                  </Button>
                  
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-300/50 hover:bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Home size={16} className="mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </PaymentActionsCard>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
