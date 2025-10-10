"use client";

import { useState, useEffect } from "react";
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
  Mail,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import PaymentMethodModal from "@/components/payment/PaymentMethodModal";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { getDeadlineText, getDeadlineMessage } from "@/lib/utils/payment-deadline";

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
  notes?: string;
  createdAt: string;
  paymentProofUrl?: string;
  items: Array<{
    id: number;
    room: {
      name: string;
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
        tenant: {
          name: string;
          email: string;
          phone?: string;
          avatarUrl?: string;
        };
      };
    };
    unitCount: number;
    unitPrice: number;
    nights: number;
    subTotal: number;
  }>;
  user: {
    name: string;
    email: string;
  };
}

export default function BookingDetails() {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'contact'>('details');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Handle redirects based on booking status
  const handleStatusBasedRedirect = (bookingData: any) => {
    if (!bookingData) return;

    const { status, paymentMethod } = bookingData;

    // If payment is confirmed, show success message and redirect
    if (status === 'confirmed') {
      toast.success('Payment confirmed! Your booking is now confirmed.');
      // Redirect to booking details after 3 seconds
      setTimeout(() => {
        router.push(`/bookings/${bookingId}`);
      }, 3000);
      return;
    }

    // If payment is completed, show completion message
    if (status === 'completed') {
      toast.success('Booking completed! Thank you for your stay.');
      return;
    }

    // If booking is cancelled, show cancellation message
    if (status === 'cancelled') {
      toast.error('This booking has been cancelled.');
      // Redirect to bookings list after 3 seconds
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
      return;
    }

    // If payment is still pending, check if we should redirect to payment pages
    if (status === 'waiting_for_payment') {
      // Check if user came from payment success/error pages
      const urlParams = new URLSearchParams(window.location.search);
      const fromPayment = urlParams.get('from');
      
      if (fromPayment === 'success') {
        toast.success('Payment successful! Your booking is being processed.');
        // Remove the 'from' parameter to prevent infinite loop
        setTimeout(() => {
          router.replace(`/bookings/${bookingId}`);
        }, 2000);
      } else if (fromPayment === 'error') {
        toast.error('Payment failed. Please try again.');
        // Redirect to appropriate payment page based on payment method
        setTimeout(() => {
          if (paymentMethod === 'payment_gateway') {
            router.push(`/bookings/${bookingId}/payment-pending`);
          } else {
            router.push(`/bookings/${bookingId}/upload-payment`);
          }
        }, 2000);
      }
    }
  };

  // Load booking data from API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        console.log('Loaded booking data:', data);
        setBookingData(data);
        
        // Handle redirects based on booking status
        handleStatusBasedRedirect(data);
      } catch (error: any) {
        console.error('Error loading booking data:', error);
        
        // Handle different error types
        if (error.response?.status === 403) {
          toast.error('Access denied. You may not have permission to view this booking.');
          // Redirect to bookings list after 2 seconds
          setTimeout(() => {
            router.push('/bookings');
          }, 2000);
        } else if (error.response?.status === 404) {
          toast.error('Booking not found.');
          // Redirect to bookings list after 2 seconds
          setTimeout(() => {
            router.push('/bookings');
          }, 2000);
        } else if (error.response?.status === 401) {
          toast.error('Please login to view your bookings.');
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          toast.error('Failed to load booking data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId, router]);

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

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await PaymentService.cancelBooking(Number(bookingId), cancelReason);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      // Reload booking data to reflect the cancellation
      const data = await PaymentService.getBookingDetails(Number(bookingId));
      setBookingData(data);
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const tabs = [
    { id: 'details', label: 'Booking Details', icon: FileText },
    { id: 'payment', label: 'Payment Info', icon: CreditCard },
    { id: 'contact', label: 'Contact Host', icon: MessageCircle }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EEE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-[#8B7355]" />
          <p className="text-gray-600">Loading booking details...</p>
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
          <Link href="/dashboard/bookings" className="text-[#8B7355] hover:underline">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const tenant = property?.tenant;

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
                  src={property?.images[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={property?.name || "Property"}
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
                <h1 className="text-2xl font-bold text-[#8B7355]">{property?.name || "Property"}</h1>
                <p className="text-gray-600">{property?.address || "Address not available"}</p>
                <p className="text-sm text-gray-500">Booking #{bookingData.bookingNo}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-[#8B7355]">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</div>
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
                {/* Booking Details Tab */}
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                          <Calendar size={20} />
                          Check-in & Check-out
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
                            <p className="font-medium">{bookingData.items[0]?.nights || 0} nights</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#8B7355] flex items-center gap-2">
                          <Users size={20} />
                          Guest Information
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-600">Number of Guests:</span>
                            <p className="font-medium">{bookingData.totalGuests} guests</p>
                          </div>
                          {bookingData.notes && (
                            <div>
                              <span className="text-sm text-gray-600">Special Requests:</span>
                              <p className="font-medium">{bookingData.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#8B7355] mb-4">Room Details</h3>
                      <div className="space-y-3">
                        {bookingData.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.room.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.unitCount} unit{item.unitCount > 1 ? 's' : ''} × {item.nights} night{item.nights > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">Rp {item.unitPrice.toLocaleString('id-ID')}/night</p>
                                <p className="text-sm text-gray-600">Subtotal: Rp {item.subTotal.toLocaleString('id-ID')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

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
                            <p className="font-medium text-lg">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</p>
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
                              <p className="text-xs text-gray-500 mt-1">
                                ({getDeadlineText(bookingData.paymentMethod)} from booking creation)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {bookingData.paymentProofUrl && (
                      <div>
                        <h3 className="font-semibold text-[#8B7355] mb-4">Payment Proof</h3>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src={bookingData.paymentProofUrl}
                              alt="Payment Proof"
                              width={100}
                              height={100}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Failed to load payment proof image:', e);
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium">Payment proof uploaded</p>
                              <p className="text-sm text-gray-600">Waiting for verification</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download size={16} className="mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {bookingData.status === 'waiting_for_payment' && !bookingData.paymentProofUrl && (
                      <div className="pt-6 border-t">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-[#8B7355]">Complete Your Payment</h4>
                          
                          {bookingData.paymentMethod === 'manual_transfer' ? (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                {getDeadlineMessage(bookingData.paymentMethod)}
                              </p>
                              <Link href={`/bookings/${bookingId}/upload-payment`}>
                          <Button className="bg-[#8B7355] hover:bg-[#7A6349] text-white">
                            Upload Payment Proof
                          </Button>
                        </Link>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                {getDeadlineMessage(bookingData.paymentMethod)}
                              </p>
                              <Button 
                                className="bg-[#8B7355] hover:bg-[#7A6349] text-white"
                                onClick={() => {
                                  // Redirect to payment pending page
                                  window.location.href = `/bookings/${bookingId}/payment-pending`;
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

                {/* Contact Host Tab */}
                {activeTab === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={tenant?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                        alt={tenant?.name || "Host"}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#8B7355]">{tenant?.name || "Host"}</h3>
                        <p className="text-sm text-gray-600">Property Host</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.9</span>
                          <span className="text-sm text-gray-500">(128 reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#8B7355] flex items-center gap-2">
                          <Phone size={20} />
                          Contact Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Phone size={16} className="text-gray-500" />
                            <span className="text-sm">{tenant?.phone || "Phone not available"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-500" />
                            <span className="text-sm">{tenant?.email || "Email not available"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-[#8B7355]">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <MessageCircle size={16} className="mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Phone size={16} className="mr-2" />
                            Call Host
                          </Button>
                        </div>
                      </div>
                    </div>
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
                        <Link href={`/bookings/${bookingId}/upload-payment`} className="block">
                      <Button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white">
                        Upload Payment Proof
                      </Button>
                    </Link>
                      ) : (
                        <Button 
                          className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                          onClick={() => {
                            // Redirect to payment pending page
                            window.location.href = `/bookings/${bookingId}/payment-pending`;
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
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Booking Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-gray-500">{formatDate(bookingData.createdAt)}</p>
                    </div>
                  </div>
                  
                  {bookingData.status === 'waiting_for_payment' && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm font-medium">Waiting for Payment</p>
                        <p className="text-xs text-gray-500">Upload proof to continue</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Check-in</p>
                      <p className="text-xs text-gray-500">{formatDate(bookingData.checkIn)}</p>
                    </div>
                  </div>
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
          // Redirect based on selected method
          if (method === 'payment_gateway') {
            // Redirect to payment gateway
            window.location.href = `/bookings/${bookingId}/payment-pending`;
          } else {
            // Redirect to upload payment proof
            window.location.href = `/bookings/${bookingId}/upload-payment`;
          }
        }}
        totalAmount={bookingData.totalAmount}
        bookingId={bookingData.id}
        bookingNo={bookingData.bookingNo}
        bookingData={{
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.totalGuests,
          nights: bookingData.items[0]?.nights || 0
        }}
      />

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[#8B7355] mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this booking..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1"
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleCancelBooking}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
