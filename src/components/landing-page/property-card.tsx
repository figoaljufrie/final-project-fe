"use client";

import { motion } from "framer-motion";
import { Heart, Star, MapPin } from "lucide-react";
import Image from "next/image";

interface CardProps {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  saved: boolean;
  category: string;
  onToggleSave: (id: number) => void;
  onView?: (id: number) => void;
  onClick?: () => void; // New prop for card-level click
}

export default function PropertyCard({
  id,
  name,
  location,
  price,
  rating,
  reviews,
  image,
  saved,
  category,
  onToggleSave,
  onView,
  onClick,
}: CardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={onClick} // Clicking anywhere triggers card click
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority={false}
        />

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <Heart
            size={16}
            className={`${
              saved ? "fill-red-500 text-red-500" : "text-white"
            } transition-colors`}
          />
        </button>

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-[#8B7355] text-white rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Title & location */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-gray-400" />
          <span className="text-sm text-gray-500 line-clamp-1">{location}</span>
        </div>

        {/* Price + View */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Starts from</span>
            <span className="text-lg font-bold text-[#8B7355]">${price}</span>
            <span className="text-sm text-gray-500">/ night</span>
          </div>

          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                onView(id);
              }}
              className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#7a6348] transition"
            >
              View
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
