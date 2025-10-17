"use client";

import { PaymentCard } from "./payment-card";

interface PaymentSummaryCardProps {
  children: React.ReactNode;
  delay?: number;
}

export function PaymentSummaryCard({ children, delay = 0 }: PaymentSummaryCardProps) {
  return (
    <PaymentCard delay={delay}>
      {children}
    </PaymentCard>
  );
}
