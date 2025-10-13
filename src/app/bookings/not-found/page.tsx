"use client";

import { motion } from "framer-motion";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookingNotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Error Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={64} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              The booking you're looking for doesn't exist
            </p>
            <p className="text-gray-500">
              The booking may have been removed, cancelled, or you may not have
              permission to view it.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Button>

            <Link href="/bookings">
              <Button
                variant="outline"
                className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
              >
                View My Bookings
              </Button>
            </Link>

            <Link href="/">
              <Button className="bg-[#8B7355] hover:bg-[#7A6349] text-white">
                <Home size={16} className="mr-2" />
                Back to Homepage
              </Button>
            </Link>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-white rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you believe this is an error, please check:
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] font-bold">•</span>
                <span>Make sure you're logged in with the correct account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] font-bold">•</span>
                <span>Check if the booking number is correct</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] font-bold">•</span>
                <span>Verify the booking hasn't been cancelled or expired</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B7355] font-bold">•</span>
                <span>Contact support if the issue persists</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

