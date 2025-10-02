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
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";

export default function PaymentPending() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

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
    paymentType: "bank_transfer",
    transactionId: "TXN-2024-001234",
    paymentUrl: "https://payment.midtrans.com/...",
    createdAt: "2024-03-08T14:30:00Z",
    expiresAt: "2024-03-08T16:30:00Z",
    tenant: {
      name: "Made Sutrisno",
      email: "made@example.com",
      phone: "+62 812-3456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsChecking(false);
    // In real implementation, this would check payment status and redirect accordingly
  };

  const handleCompletePayment = () => {
    // In real implementation, this would redirect to payment gateway
    window.open(bookingData.paymentUrl, '_blank');
  };

  const timeRemaining = Math.max(0, Math.floor((new Date(bookingData.expiresAt).getTime() - new Date().getTime()) / 1000));
  const hoursRemaining = Math.floor(timeRemaining / 3600);
  const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Pending Animation */}
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
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock size={48} className="text-yellow-600" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4">Payment Pending</h1>
          <p className="text-xl text-gray-600 mb-2">We're waiting for your payment to be processed</p>
          <p className="text-gray-500">Booking #{bookingData.bookingNo}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Status Card */}
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
                      <span className="text-sm text-gray-600">Started At:</span>
                      <p className="font-medium">
                        {formatDate(bookingData.createdAt)} at {formatTimeOnly(bookingData.createdAt)}
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

            {/* Payment Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">Payment Instructions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Complete Your Payment</h4>
                    <p className="text-sm text-gray-600">Click the button below to complete your payment through our secure payment gateway.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Wait for Confirmation</h4>
                    <p className="text-sm text-gray-600">Your payment will be processed automatically. This usually takes a few minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Receive Confirmation</h4>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation once your payment is successful.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Host Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
              {/* Payment Timer */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Payment Timer</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-800 mb-2">
                    {hoursRemaining > 0 ? `${hoursRemaining}h ${minutesRemaining}m` : `${minutesRemaining}m`}
                  </div>
                  <p className="text-sm text-orange-700">
                    Time remaining to complete payment
                  </p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.max(0, (timeRemaining / (2 * 3600)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleCompletePayment}
                    className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Complete Payment
                  </Button>
                  
                  <Button 
                    onClick={handleCheckStatus}
                    disabled={isChecking}
                    variant="outline" 
                    className="w-full"
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Check Status
                      </>
                    )}
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
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Payment Status</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className="font-medium text-blue-800">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Time Elapsed:</span>
                    <span className="font-medium text-blue-800">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Expires:</span>
                    <span className="font-medium text-blue-800">
                      {formatTimeOnly(bookingData.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Having trouble with your payment? Our support team is here to help.
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
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#8B7355] mb-4">Complete Your Payment</h3>
            <p className="text-gray-600 mb-6">
              Don't miss out on your booking! Complete your payment to secure your stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleCompletePayment}
                className="bg-[#8B7355] hover:bg-[#7A6349] text-white px-8"
              >
                Complete Payment Now
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Link href="/dashboard/bookings">
                <Button variant="outline" className="px-8">
                  View My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
