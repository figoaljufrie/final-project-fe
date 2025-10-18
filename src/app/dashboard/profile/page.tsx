// app/profile/home/page.tsx
"use client";

import { motion } from "framer-motion";
import UserProfileForm from "@/components/profile/user-profile-form";

export default function ProfileHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Profile Information
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your personal information and account settings
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <UserProfileForm />
        </div>
      </motion.div>
    </div>
  );
}