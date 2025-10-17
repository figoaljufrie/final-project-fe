"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";

interface BookingData {
  midtransPayment?: {
    redirectUrl?: string;
    token?: string;
    orderId?: string;
  };
}

export function usePaymentActions(bookingData: BookingData | null, bookingId: string) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleRetryPayment = async () => {
    if (!bookingData) return;
    
    setIsRetrying(true);
    try {
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

  const handleCompletePayment = () => {
    console.log('Complete Payment clicked');
    console.log('Booking data:', bookingData);
    
    const redirectUrl = bookingData?.midtransPayment?.redirectUrl;
    
    console.log('Redirect URL found:', redirectUrl);
    
    if (redirectUrl) {
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    } else {
      const token = bookingData?.midtransPayment?.token;
      if (token) {
        const constructedUrl = `https://app.sandbox.midtrans.com/snap/v4/redirection/${token}`;
        console.log('Constructed redirect URL:', constructedUrl);
        window.location.href = constructedUrl;
      } else {
        console.error('No payment URL or token available');
        toast.error('Payment URL not available. Please refresh the page.');
      }
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const orderId = bookingData?.midtransPayment?.orderId;
      if (orderId) {
        const status = await PaymentService.checkPaymentStatus(orderId);
        
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
    } catch (error: unknown) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
    } finally {
      setIsChecking(false);
    }
  };

  const handleContactSupport = () => {
    toast('Support contact feature coming soon!');
  };

  return {
    isRetrying,
    isChecking,
    handleRetryPayment,
    handleCompletePayment,
    handleCheckStatus,
    handleContactSupport,
  };
}
