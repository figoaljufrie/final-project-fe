"use client";

import { Star, User, MessageCircle } from "lucide-react";

interface HostInfo {
  name: string;
  rating: number;
  reviews: number;
}

interface PropertyHostProps {
  host: HostInfo;
}

export default function PropertyHost({ host }: PropertyHostProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200/50">
      <div className="flex items-center gap-4">
        {/* Host Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {host.name[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Host Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-rose-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {host.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-800">{host.rating}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-600">{host.reviews} reviews</span>
            </div>
          </div>
          
          <div className="mt-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              <MessageCircle size={16} />
              Contact Host
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}