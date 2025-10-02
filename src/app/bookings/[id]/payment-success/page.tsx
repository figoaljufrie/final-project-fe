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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";

export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);

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
    confirmedAt: "2024-03-08T14:30:00Z",
    tenant: {
      name: "Made Sutrisno",
      email: "made@example.com",
      phone: "+62 812-3456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Animation */}
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
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-2">Your booking has been confirmed</p>
          <p className="text-gray-500">Booking #{bookingData.bookingNo}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Confirmation Card */}
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
                      <span className="text-sm text-gray-600">Confirmed At:</span>
                      <p className="font-medium">
                        {formatDate(bookingData.confirmedAt)} at {formatTime(bookingData.confirmedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Paid:</span>
                  <span className="text-2xl font-bold text-[#8B7355]">${bookingData.totalAmount}</span>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Check-in Instructions</h4>
                    <p className="text-sm text-gray-600">You'll receive detailed check-in instructions via email 24 hours before your arrival.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Contact Your Host</h4>
                    <p className="text-sm text-gray-600">Feel free to reach out to your host for any questions or special requests.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Enjoy Your Stay</h4>
                    <p className="text-sm text-gray-600">We hope you have an amazing time at your accommodation!</p>
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
              <h3 className="text-xl font-bold text-[#8B7355] mb-4">Meet Your Host</h3>
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
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-gray-500">(128 reviews)</span>
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
                  <Link href={`/bookings/${bookingData.id}`} className="block">
                    <Button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white">
                      View Booking Details
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full">
                    <Download size={16} className="mr-2" />
                    Download Receipt
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

              {/* Auto Redirect */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Auto Redirect</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  You'll be automatically redirected to your booking details in {countdown} seconds.
                </p>
                <Link href={`/bookings/${bookingData.id}`}>
                  <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                    Go Now
                  </Button>
                </Link>
              </div>

              {/* Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your booking, our support team is here to help.
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
            <h3 className="text-2xl font-bold text-[#8B7355] mb-4">Ready for Your Next Adventure?</h3>
            <p className="text-gray-600 mb-6">
              Discover more amazing properties and plan your next getaway.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore">
                <Button className="bg-[#8B7355] hover:bg-[#7A6349] text-white px-8">
                  Explore Properties
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
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
