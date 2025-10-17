"use client";

import { useState, useEffect } from "react";
import { calculateTimeRemaining } from "@/lib/utils/payment-deadline";

export function usePaymentTimer(paymentDeadline?: string) {
  const [timeRemaining, setTimeRemaining] = useState({ 
    hours: 0, 
    minutes: 0, 
    seconds: 0, 
    isExpired: false 
  });

  useEffect(() => {
    if (!paymentDeadline) return;

    const updateTimer = () => {
      if (paymentDeadline && typeof paymentDeadline === 'string') {
        const result = calculateTimeRemaining(paymentDeadline);
        setTimeRemaining(result);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [paymentDeadline]);

  return timeRemaining;
}
