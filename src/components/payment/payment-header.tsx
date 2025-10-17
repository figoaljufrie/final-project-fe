"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PaymentHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconBgColor: string;
  iconColor: string;
  titleColor: string;
}

export function PaymentHeader({
  icon: Icon,
  title,
  subtitle,
  iconBgColor,
  iconColor,
  titleColor,
}: PaymentHeaderProps) {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-opacity-50`}
      >
        <Icon className={`w-12 h-12 ${iconColor}`} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-4xl font-bold ${titleColor} mb-2`}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
