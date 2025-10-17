"use client";

import { PaymentCard } from "./payment-card";

interface PaymentActionsCardProps {
  children: React.ReactNode;
  delay?: number;
}

export function PaymentActionsCard({ children, delay = 0 }: PaymentActionsCardProps) {
  return (
    <PaymentCard delay={delay}>
      {children}
    </PaymentCard>
  );
}
