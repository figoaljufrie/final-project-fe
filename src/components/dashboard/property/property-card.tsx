"use client";

import type { PropertyListItem } from "@/lib/types/inventory/property-types";
import { motion, Variants } from "framer-motion";
import { Home, MoreVertical, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyCardProps {
  property: PropertyListItem;
  variants: Variants;
}

export default function PropertyCard({
  property,
  variants,
}: PropertyCardProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "Not set";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const primaryImageUrl =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.isPrimary)?.url ||
        property.images[0].url
      : null;

  return (
    <motion.div
      variants={variants}
      className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image Section */}
      <div className="h-40 bg-gray-200 flex items-center justify-center relative">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Home className="w-12 h-12 text-gray-400" />
        )}

        {/* Publish Status Badge */}
        <div className="absolute top-2 right-2">
          {property.published ? (
            <div className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <Eye className="w-3 h-3" />
              <span>Published</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
              <EyeOff className="w-3 h-3" />
              <span>Draft</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-600 capitalize">
              {property.category.toLowerCase()}
            </p>
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500">
              {property.city || "No location provided"}
            </p>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-800">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-4 border-t border-gray-200/60">
          <p className="text-sm text-gray-600">Starts From</p>
          {property.minPrice !== null &&
          property.minPrice !== undefined &&
          !isNaN(property.minPrice) ? (
            <p className="text-xl font-semibold text-gray-800">
              {formatCurrency(property.minPrice)}
              <span className="text-sm font-normal text-gray-500">/night</span>
            </p>
          ) : (
            <p className="text-sm text-amber-600 italic">
              ⚠️ Add rooms to set pricing
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            href={`/dashboard/property/${property.id}`}
            className="block w-full text-center bg-white/50 hover:bg-white/80 border border-gray-300/80 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Manage Property
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
