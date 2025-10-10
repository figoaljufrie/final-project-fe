import { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentService, PaymentStatusResponse } from '@/lib/services/payment/payment-service';
import { toast } from 'react-hot-toast';

interface UsePaymentStatusOptions {
  orderId?: string;
  enabled?: boolean;
  maxAttempts?: number;
  intervalMs?: number;
  onStatusChange?: (status: PaymentStatusResponse) => void;
  onSuccess?: (status: PaymentStatusResponse) => void;
  onError?: (status: PaymentStatusResponse) => void;
  onTimeout?: () => void;
}

interface UsePaymentStatusReturn {
  status: PaymentStatusResponse | null;
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  checkStatus: () => Promise<void>;
}

export function usePaymentStatus({
  orderId,
  enabled = true,
  maxAttempts = 30,
  intervalMs = 3000,
  onStatusChange,
  onSuccess,
  onError,
  onTimeout
}: UsePaymentStatusOptions): UsePaymentStatusReturn {
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const isPollingRef = useRef(false);

  const checkStatus = useCallback(async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const paymentStatus = await PaymentService.checkPaymentStatus(orderId);
      setStatus(paymentStatus);
      
      // Call status change callback
      onStatusChange?.(paymentStatus);
      
      // Check if payment is completed
      if (['settlement', 'capture'].includes(paymentStatus.transaction_status)) {
        onSuccess?.(paymentStatus);
        stopPolling();
        return;
      }
      
      // Check if payment failed
      if (['cancel', 'deny', 'expire', 'failure'].includes(paymentStatus.transaction_status)) {
        onError?.(paymentStatus);
        stopPolling();
        return;
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to check payment status';
      setError(errorMessage);
      console.error('Payment status check error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, onStatusChange, onSuccess, onError]);

  const startPolling = useCallback(() => {
    if (!orderId || isPollingRef.current) return;
    
    setIsPolling(true);
    isPollingRef.current = true;
    attemptsRef.current = 0;
    
    const poll = async () => {
      if (!isPollingRef.current) return;
      
      attemptsRef.current++;
      
      try {
        await checkStatus();
        
        // Continue polling if not final status and within max attempts
        if (isPollingRef.current && attemptsRef.current < maxAttempts) {
          intervalRef.current = setTimeout(poll, intervalMs);
        } else if (attemptsRef.current >= maxAttempts) {
          onTimeout?.();
          stopPolling();
        }
      } catch (err) {
        console.error('Polling error:', err);
        if (attemptsRef.current >= maxAttempts) {
          onTimeout?.();
          stopPolling();
        } else {
          intervalRef.current = setTimeout(poll, intervalMs);
        }
      }
    };
    
    // Start polling immediately
    poll();
  }, [orderId, maxAttempts, intervalMs, checkStatus, onTimeout]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    isPollingRef.current = false;
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-start polling when enabled and orderId is available
  useEffect(() => {
    if (enabled && orderId && !isPollingRef.current) {
      startPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [enabled, orderId, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    isLoading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    checkStatus
  };
}

// Hook for booking payment status
export function useBookingPaymentStatus(bookingId: number) {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookingData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await PaymentService.getBookingDetails(bookingId);
      setBookingData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load booking data');
      console.error('Error loading booking data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBookingData();
  }, [loadBookingData]);

  const paymentStatus = usePaymentStatus({
    orderId: bookingData?.midtransPayment?.orderId,
    enabled: !!bookingData?.midtransPayment?.orderId && bookingData?.status === 'waiting_for_payment',
    onSuccess: (status) => {
      toast.success('Payment completed successfully!');
      // Reload booking data to get updated status
      loadBookingData();
    },
    onError: (status) => {
      toast.error('Payment failed or was cancelled');
      // Reload booking data to get updated status
      loadBookingData();
    },
    onTimeout: () => {
        toast('Payment status check timeout');
    }
  });

  return {
    bookingData,
    isLoading,
    error,
    paymentStatus,
    reloadBooking: loadBookingData
  };
}
