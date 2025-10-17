"use client";

import { Clock } from "lucide-react";
import { formatTimeRemaining, getDeadlineText } from "@/lib/utils/payment-deadline";
import { PaymentCard } from "./payment-card";

interface PaymentDeadlineCardProps {
  paymentDeadline: string;
  paymentMethod: string;
  timeRemaining: { hours: number; minutes: number; seconds: number; isExpired: boolean };
  delay?: number;
}

export function PaymentDeadlineCard({
  paymentDeadline,
  paymentMethod,
  timeRemaining,
  delay = 0,
}: PaymentDeadlineCardProps) {
  if (!paymentDeadline || timeRemaining.isExpired) return null;

  return (
    <PaymentCard delay={delay}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-orange-600" />
        <h3 className="font-bold text-orange-800">Payment Deadline</h3>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-800">
          {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
        </div>
        <p className="text-sm text-orange-600">
          Time remaining to complete payment
        </p>
        <p className="text-xs text-orange-500 mt-1">
          Complete within {getDeadlineText(paymentMethod)} from booking creation
        </p>
      </div>
    </PaymentCard>
  );
}
