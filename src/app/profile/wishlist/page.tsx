"use client";

import { motion } from "framer-motion";
import { LuHeart } from "react-icons/lu";

export default function WishlistPage() {
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
              My Wishlist
            </h1>
            <p className="text-gray-600 text-lg">
              Save your favorite properties for later
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <LuHeart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties in wishlist yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and add them to your wishlist to save them for later.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Explore Properties
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

