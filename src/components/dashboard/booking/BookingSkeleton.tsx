"use client";

import { motion } from "framer-motion";

export default function BookingSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
