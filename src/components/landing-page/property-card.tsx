"use client";

import { motion } from "framer-motion";
import { Heart, Star, MapPin, Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  onClick?: () => void;
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover group-hover:scale-110 transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Loading Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(id);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg z-10 transition-all duration-300"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              saved 
                ? "fill-rose-500 text-rose-500 scale-110" 
                : "text-gray-600 group-hover:text-rose-500"
            }`}
          />
        </motion.button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {category}
          </motion.div>
        </div>

        {/* View Count (appears on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full"
        >
          <Eye size={14} className="text-white" />
          <span className="text-white text-xs font-medium">{reviews} views</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-rose-500 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">{location}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                ${price}
              </span>
              <span className="text-sm text-gray-500">/ night</span>
            </div>
          </div>

          {onView && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onView(id);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              View
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}