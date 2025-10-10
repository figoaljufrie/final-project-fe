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
  BellIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { TenantApprovalService, TenantBooking } from "@/lib/services/tenant/tenant-approval-service";
import { toast } from "react-hot-toast";
import { getDeadlineText } from "@/lib/utils/payment-deadline";

export default function TenantBookingDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'contact'>('details');
  const [booking, setBooking] = useState<TenantBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingId = parseInt(params.id);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setIsLoading(true);
      const result = await TenantApprovalService.getBookingDetails(bookingId);
      setBooking(result);
    } catch (error: any) {
      console.error("Error loading booking details:", error);
      toast.error(error.response?.data?.message || "Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'waiting_for_payment':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'waiting_for_confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'waiting_for_payment':
        return <Clock size={16} className="text-red-600" />;
      case 'waiting_for_confirmation':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-gray-600" />;
      case 'expired':
        return <XCircle size={16} className="text-gray-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirmBooking = async () => {
    if (!booking) return;

    try {
      setIsProcessing(true);
      await TenantApprovalService.confirmPayment(booking.id, {
        confirmationNotes: "Payment confirmed by tenant",
      });
      
      toast.success("Booking confirmed successfully");
      await loadBookingDetails();
    } catch (error: any) {
      console.error("Error confirming booking:", error);
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!booking) return;

    const rejectionReason = prompt("Please provide a reason for rejection:");
    if (!rejectionReason) return;

    try {
      setIsProcessing(true);
      await TenantApprovalService.rejectPayment(booking.id, {
        rejectionReason,
      });
      
      toast.success("Booking rejected successfully");
      await loadBookingDetails();
    } catch (error: any) {
      console.error("Error rejecting booking:", error);
      toast.error(error.response?.data?.message || "Failed to reject booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReminder = async (reminderType: 'payment' | 'checkin' | 'checkout' = 'payment') => {
    if (!booking) return;

    try {
      await TenantApprovalService.sendReminder(booking.id, { reminderType });
      toast.success("Reminder sent successfully");
    } catch (error: any) {
      console.error("Error sending reminder:", error);
      toast.error(error.response?.data?.message || "Failed to send reminder");
    }
  };

  const tabs = [
    { id: 'details', label: 'Booking Details', icon: FileText },
    { id: 'payment', label: 'Payment Info', icon: CreditCard },
    { id: 'contact', label: 'Contact Guest', icon: MessageCircle }
  ];

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full text-center py-12">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Not Found</h3>
        <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/dashboard/tenant-approval">
          <Button>Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          href="/dashboard/tenant-approval"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Tenant Approval</span>
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 size={32} className="text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B7355]">{booking.property.name}</h1>
                <p className="text-gray-600">{booking.property.address}</p>
                <p className="text-sm text-gray-500">Booking #{booking.bookingNo}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-[#8B7355]">{formatCurrency(booking.totalAmount)}</div>
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
                            <p className="font-medium">{formatDate(booking.checkIn)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Check-out:</span>
                            <p className="font-medium">{formatDate(booking.checkOut)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Duration:</span>
                            <p className="font-medium">{booking.items[0]?.nights || 0} nights</p>
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
                            <p className="font-medium">{booking.totalGuests} guests</p>
                          </div>
                          {booking.notes && (
                            <div>
                              <span className="text-sm text-gray-600">Special Requests:</span>
                              <p className="font-medium">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#8B7355] mb-4">Room Details</h3>
                      <div className="space-y-3">
                        {booking.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.room.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.unitCount} unit{item.unitCount > 1 ? 's' : ''} × {item.nights} night{item.nights > 1 ? 's' : ''}
                                </p>
                                <p className="text-sm text-gray-600">Capacity: {item.room.capacity} guests</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(item.unitPrice)}/night</p>
                                <p className="text-sm text-gray-600">Subtotal: {formatCurrency(item.subTotal)}</p>
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
                            <p className="font-medium capitalize">{booking.paymentMethod?.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <p className="font-medium text-lg">{formatCurrency(booking.totalAmount)}</p>
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
                            <p className="font-medium capitalize">{booking.status.replace('_', ' ')}</p>
                          </div>
                          {booking.paymentDeadline && (
                            <div>
                              <span className="text-sm text-gray-600">Payment Deadline:</span>
                              <p className="font-medium">
                                {formatDate(booking.paymentDeadline)} at {formatTime(booking.paymentDeadline)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ({getDeadlineText(booking.paymentMethod)} from booking creation)
                              </p>
                            </div>
                          )}
                          {booking.confirmedAt && (
                            <div>
                              <span className="text-sm text-gray-600">Confirmed At:</span>
                              <p className="font-medium">
                                {formatDate(booking.confirmedAt)} at {formatTime(booking.confirmedAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {booking.paymentProofUrl && (
                      <div>
                        <h3 className="font-semibold text-[#8B7355] mb-4">Payment Proof</h3>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src={booking.paymentProofUrl}
                              alt="Payment Proof"
                              width={100}
                              height={100}
                              className="w-24 h-24 object-cover rounded-lg"
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
                    {booking.status === 'waiting_for_confirmation' && (
                      <div className="pt-6 border-t">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-[#8B7355]">Payment Confirmation</h4>
                          <p className="text-sm text-gray-600">
                            Review the payment proof and confirm or reject this booking.
                          </p>
                          
                          <div className="flex gap-4">
                            <Button
                              onClick={handleConfirmBooking}
                              disabled={isProcessing}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckIcon size={16} className="mr-2" />
                              {isProcessing ? 'Confirming...' : 'Confirm Payment'}
                            </Button>
                            
                            <Button
                              onClick={handleRejectBooking}
                              disabled={isProcessing}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XMarkIcon size={16} className="mr-2" />
                              {isProcessing ? 'Rejecting...' : 'Reject Payment'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Contact Guest Tab */}
                {activeTab === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-15 h-15 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#8B7355]">{booking.user.name || 'Guest'}</h3>
                        <p className="text-sm text-gray-600">Booking Guest</p>
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
                            <span className="text-sm">{booking.user.phoneNumber || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-500" />
                            <span className="text-sm">{booking.user.email}</span>
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
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleSendReminder('payment')}
                          >
                            <BellIcon size={16} className="mr-2" />
                            Send Payment Reminder
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleSendReminder('checkin')}
                          >
                            <BellIcon size={16} className="mr-2" />
                            Send Check-in Reminder
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
                  {booking.status === 'waiting_for_confirmation' && (
                    <>
                      <Button
                        onClick={handleConfirmBooking}
                        disabled={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckIcon size={16} className="mr-2" />
                        Confirm Payment
                      </Button>
                      
                      <Button
                        onClick={handleRejectBooking}
                        disabled={isProcessing}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XMarkIcon size={16} className="mr-2" />
                        Reject Payment
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSendReminder('payment')}
                  >
                    <BellIcon size={16} className="mr-2" />
                    Send Reminder
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Download size={16} className="mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle size={16} className="mr-2" />
                    Contact Guest
                  </Button>
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
                      <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                  
                  {booking.status === 'waiting_for_confirmation' && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm font-medium">Waiting for Confirmation</p>
                        <p className="text-xs text-gray-500">Payment proof uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.confirmedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.confirmedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Check-in</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.checkIn)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
