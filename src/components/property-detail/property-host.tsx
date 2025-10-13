"use client";

import { Star } from "lucide-react";

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
    <div className="flex items-center gap-3">
      {/* Host Avatar */}
      <div className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white font-semibold text-lg">
        {host.name[0]}
      </div>
      
      {/* Host Info */}
      <div>
        <div className="font-semibold text-[#8B7355]">
          Host: {host.name}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{host.rating}</span>
          <span>•</span>
          <span>{host.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}