"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PaymentCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function PaymentCard({ children, delay = 0, className = "" }: PaymentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
