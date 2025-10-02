"use client";

import { useState } from "react";
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
  CheckCircle,
  Building2,
  ArrowRight,
  ExternalLink,
  Clock,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";

export default function PaymentError() {
  const [isRetrying, setIsRetrying] = useState(false);

  // Mock booking data - replace with actual data from props/API
  const bookingData = {
    id: 1,
    bookingNo: "BK-2024-001234",
    propertyName: "Ocean View Villa",
    propertyImage: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "Jl. Pantai Kuta No. 88, Seminyak, Bali",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    guests: 4,
    nights: 3,
    totalAmount: 960,
    paymentMethod: "payment_gateway",
    paymentType: "credit_card",
    transactionId: "TXN-2024-001234",
    errorCode: "PAYMENT_DECLINED",
    errorMessage: "Your payment was declined by your bank. Please check your card details or try a different payment method.",
    failedAt: "2024-03-08T14:30:00Z",
    tenant: {
      name: "Made Sutrisno",
      email: "made@example.com",
      phone: "+62 812-3456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  };

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

  const handleRetryPayment = async () => {
    setIsRetrying(true);
    // Simulate retry process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRetrying(false);
    // In real implementation, this would redirect to payment gateway
  };

  const handleTryDifferentMethod = () => {
    // In real implementation, this would redirect to payment method selection
    console.log("Try different payment method");
  };

  const getErrorIcon = (errorCode: string) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return <XCircle size={48} className="text-red-600" />;
      case 'INSUFFICIENT_FUNDS':
        return <AlertTriangle size={48} className="text-orange-600" />;
      case 'CARD_EXPIRED':
        return <Clock size={48} className="text-yellow-600" />;
      default:
        return <XCircle size={48} className="text-red-600" />;
    }
  };

  const getErrorColor = (errorCode: string) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'bg-red-100 text-red-600';
      case 'INSUFFICIENT_FUNDS':
        return 'bg-orange-100 text-orange-600';
      case 'CARD_EXPIRED':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-red-100 text-red-600';
    }
  };

  const getErrorSuggestions = (errorCode: string) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return [
          'Check your card details (number, expiry date, CVV)',
          'Ensure your card is not blocked or restricted',
          'Try a different payment method',
          'Contact your bank if the issue persists'
        ];
      case 'INSUFFICIENT_FUNDS':
        return [
          'Check your account balance',
          'Try a different payment method',
          'Contact your bank to increase your limit',
          'Consider using a different card'
        ];
      case 'CARD_EXPIRED':
        return [
          'Check your card expiry date',
          'Use a different card with valid expiry date',
          'Update your card information',
          'Contact your bank for a new card'
        ];
      default:
        return [
          'Try again with the same payment method',
          'Try a different payment method',
          'Contact support for assistance',
          'Check your internet connection'
        ];
    }
  };

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="text-center mb-8"
        >
          <div className={`w-24 h-24 ${getErrorColor(bookingData.errorCode)} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getErrorIcon(bookingData.errorCode)}
          </div>
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 mb-2">We couldn't process your payment</p>
          <p className="text-gray-500">Booking #{bookingData.bookingNo}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={bookingData.propertyImage}
                  alt={bookingData.propertyName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#8B7355]">{bookingData.propertyName}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{bookingData.address}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                    <Calendar size={20} />
                    Stay Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Check-in:</span>
                      <p className="font-medium">{formatDate(bookingData.checkIn)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Check-out:</span>
                      <p className="font-medium">{formatDate(bookingData.checkOut)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">{bookingData.nights} nights</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Guests:</span>
                      <p className="font-medium">{bookingData.guests} guests</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <p className="font-medium capitalize">{bookingData.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Type:</span>
                      <p className="font-medium capitalize">{bookingData.paymentType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Transaction ID:</span>
                      <p className="font-medium font-mono text-sm">{bookingData.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Failed At:</span>
                      <p className="font-medium">
                        {formatDate(bookingData.failedAt)} at {formatTime(bookingData.failedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-[#8B7355]">${bookingData.totalAmount}</span>
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Payment Error</h3>
                  <p className="text-red-700 mb-4">{bookingData.errorMessage}</p>
                  <div className="text-sm text-red-600">
                    <span className="font-medium">Error Code:</span> {bookingData.errorCode}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Troubleshooting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">Troubleshooting Steps</h3>
              <div className="space-y-4">
                {getErrorSuggestions(bookingData.errorCode).map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Host Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">Your Host</h3>
              <div className="flex items-center gap-4">
                <Image
                  src={bookingData.tenant.avatar}
                  alt={bookingData.tenant.name}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{bookingData.tenant.name}</h4>
                  <p className="text-gray-600">Property Host</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-sm font-medium text-green-600">Verified Host</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle size={16} className="mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryPayment}
                    disabled={isRetrying}
                    className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
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
                    onClick={handleTryDifferentMethod}
                    variant="outline" 
                    className="w-full"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Try Different Method
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle size={16} className="mr-2" />
                    Contact Host
                  </Button>
                  
                  <Link href="/dashboard/bookings" className="block">
                    <Button variant="outline" className="w-full">
                      <Building2 size={16} className="mr-2" />
                      My Bookings
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={20} className="text-red-600" />
                  <h3 className="font-semibold text-red-800">Payment Status</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Status:</span>
                    <span className="font-medium text-red-800">Failed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Error Code:</span>
                    <span className="font-medium text-red-800">{bookingData.errorCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Failed At:</span>
                    <span className="font-medium text-red-800">
                      {formatTime(bookingData.failedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Having trouble with your payment? Our support team is here to help you resolve this issue.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#8B7355] mb-4">Don't Give Up!</h3>
            <p className="text-gray-600 mb-6">
              Your booking is still available. Try again with a different payment method or contact support for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="bg-[#8B7355] hover:bg-[#7A6349] text-white px-8"
              >
                {isRetrying ? 'Retrying...' : 'Retry Payment'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button 
                onClick={handleTryDifferentMethod}
                variant="outline" 
                className="px-8"
              >
                Try Different Method
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
