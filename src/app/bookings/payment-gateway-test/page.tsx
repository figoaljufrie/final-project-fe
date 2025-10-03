"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  MessageCircle,
  Star,
  Building2,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import PaymentMethodModal from "@/components/payment/PaymentMethodModal";
import Link from "next/link";
import Image from "next/image";

export default function PaymentGatewayTest() {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'contact'>('details');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock booking data for payment gateway testing
  const bookingData = {
    id: 1,
    bookingNo: "BK-2024-001234",
    status: "waiting_for_payment" as const,
    propertyName: "Ocean View Villa",
    propertyImage: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "Jl. Pantai Kuta No. 88, Seminyak, Bali",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    guests: 4,
    nights: 3,
    totalAmount: 960,
    paymentMethod: "payment_gateway" as const, // Payment gateway for testing
    paymentProofUrl: null,
    paymentDeadline: "2024-03-10T14:30:00Z",
    createdAt: "2024-03-08T10:30:00Z",
    notes: "Please prepare early check-in if possible",
    items: [
      {
        id: 1,
        roomName: "Deluxe Ocean View Room",
        unitCount: 1,
        unitPrice: 320,
        nights: 3,
        subTotal: 960
      }
    ],
    tenant: {
      name: "Made Sutrisno",
      email: "made@example.com",
      phone: "+62 812-3456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'waiting_for_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'waiting_for_confirmation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'waiting_for_payment':
        return <Clock size={16} className="text-yellow-600" />;
      case 'waiting_for_confirmation':
        return <AlertCircle size={16} className="text-blue-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
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

  const tabs = [
    { id: 'details', label: 'Booking Details', icon: FileText },
    { id: 'payment', label: 'Payment Info', icon: CreditCard },
    { id: 'contact', label: 'Contact Host', icon: MessageCircle }
  ];

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to My Bookings</span>
        </Link>

        {/* Test Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">🧪 Testing: Payment Gateway (Midtrans)</h3>
          <p className="text-sm text-green-700">
            This page shows the booking details with <strong>payment gateway</strong> payment method. 
            You should see "Pay with Payment Gateway" button instead of "Upload Payment Proof".
          </p>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={bookingData.propertyImage}
                  alt={bookingData.propertyName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -right-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bookingData.status)}`}>
                    {getStatusIcon(bookingData.status)}
                    {bookingData.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B7355]">{bookingData.propertyName}</h1>
                <p className="text-gray-600">{bookingData.address}</p>
                <p className="text-sm text-gray-500">Booking #{bookingData.bookingNo}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-[#8B7355]">${bookingData.totalAmount}</div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-[#8B7355] text-[#8B7355]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Payment Info Tab */}
                {activeTab === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                          <CreditCard size={20} />
                          Payment Method
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-600">Method:</span>
                            <p className="font-medium capitalize">{bookingData.paymentMethod.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <p className="font-medium text-lg">${bookingData.totalAmount}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                          <Clock size={20} />
                          Payment Status
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <p className="font-medium capitalize">{bookingData.status.replace('_', ' ')}</p>
                          </div>
                          {bookingData.paymentDeadline && (
                            <div>
                              <span className="text-sm text-gray-600">Payment Deadline:</span>
                              <p className="font-medium">
                                {formatDate(bookingData.paymentDeadline)} at {formatTime(bookingData.paymentDeadline)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {bookingData.status === 'waiting_for_payment' && !bookingData.paymentProofUrl && (
                      <div className="pt-6 border-t">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-[#8B7355]">Complete Your Payment</h4>
                          
                          {bookingData.paymentMethod === 'manual_transfer' ? (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                Upload your bank transfer receipt to complete the payment.
                              </p>
                              <Link href={`/bookings/${bookingData.id}/upload-payment`}>
                                <Button className="bg-[#8B7355] hover:bg-[#7A6349] text-white">
                                  Upload Payment Proof
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                Complete your payment securely through our payment gateway.
                              </p>
                              <Button 
                                className="bg-[#8B7355] hover:bg-[#7A6349] text-white"
                                onClick={() => {
                                  // In real implementation, this would call the Midtrans API
                                  console.log('Redirecting to Midtrans payment gateway...');
                                  window.location.href = '/bookings/1/payment-pending';
                                }}
                              >
                                Pay with Payment Gateway
                              </Button>
                            </div>
                          )}
                          
                          {/* Alternative Payment Method */}
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 mb-3">
                              Want to use a different payment method?
                            </p>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setShowPaymentModal(true)}
                            >
                              Change Payment Method
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {bookingData.status === 'waiting_for_payment' && !bookingData.paymentProofUrl && (
                    <>
                      {bookingData.paymentMethod === 'manual_transfer' ? (
                        <Link href={`/bookings/${bookingData.id}/upload-payment`} className="block">
                          <Button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white">
                            Upload Payment Proof
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                          onClick={() => {
                            console.log('Redirecting to Midtrans payment gateway...');
                            window.location.href = '/bookings/1/payment-pending';
                          }}
                        >
                          Pay with Payment Gateway
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Download size={16} className="mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle size={16} className="mr-2" />
                    Contact Host
                  </Button>
                  
                  {bookingData.status === 'waiting_for_payment' && (
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectMethod={(method) => {
          console.log('Selected payment method:', method);
          setShowPaymentModal(false);
          if (method === 'payment_gateway') {
            window.location.href = '/bookings/1/payment-pending';
          } else {
            window.location.href = '/bookings/1/upload-payment';
          }
        }}
        totalAmount={bookingData.totalAmount}
        bookingData={{
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          nights: bookingData.nights
        }}
      />
    </main>
  );
}
