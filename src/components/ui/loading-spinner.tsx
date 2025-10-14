"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subTextClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Loading...",
  subMessage = "Please wait a moment.",
  className,
  iconClassName,
  textClassName,
  subTextClassName,
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      icon: "h-8 w-8",
      text: "text-lg",
      subText: "text-sm",
    },
    md: {
      container: "w-20 h-20",
      icon: "h-10 w-10",
      text: "text-xl",
      subText: "text-sm",
    },
    lg: {
      container: "w-24 h-24",
      icon: "h-12 w-12",
      text: "text-2xl",
      subText: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative flex items-center justify-center ${currentSize.container} rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 shadow-xl mb-4 ${iconClassName}`}
      >
        <Loader2 className={`${currentSize.icon} text-white animate-spin`} />
      </motion.div>
      <h2 className={`${currentSize.text} font-semibold text-gray-800 mb-1 ${textClassName}`}>
        {message}
      </h2>
      <p className={`${currentSize.subText} text-gray-500 ${subTextClassName}`}>
        {subMessage}
      </p>
    </div>
  );
}

// Full screen loading component
export function FullScreenLoadingSpinner({
  message = "Loading...",
  subMessage = "Please wait a moment.",
  className,
}: Omit<LoadingSpinnerProps, "size">) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative">
        <LoadingSpinner
          message={message}
          subMessage={subMessage}
          size="md"
          className={className}
        />
      </div>
    </div>
  );
}

// Card loading component
export function CardLoadingSpinner({
  message = "Loading...",
  subMessage = "Please wait a moment.",
  className,
}: Omit<LoadingSpinnerProps, "size">) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200/50 w-full max-w-md text-center">
      <LoadingSpinner
        message={message}
        subMessage={subMessage}
        size="md"
        className={className}
      />
    </div>
  );
}
