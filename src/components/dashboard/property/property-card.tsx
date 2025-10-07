"use client";

import type { PropertyListItem } from "@/lib/types/inventory/property-types";
import { motion } from "framer-motion";
import { Home, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function ({
  property,
  variants,
}: {
  property: PropertyListItem;
  variants: any;
}) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      variants={variants}
      className="glass-card rounded-xl overflow-hidden shadow-sm howver:shadow-lg transition-shadow duration-300 flex-col"
    >
      <div className="h-40 bg-g4qy-200 flex items-center justify-center">
        {property.image ? (
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-md text-rose-600 capitalize">
              {property.category.toLowerCase()}
            </p>
            <h3 className=" text-lg font-bold text-gray-900 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500">
              {property.city || "No location provided."}
            </p>
            <button className="p-2 text-gray-500 hover:text-gray-800">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/60 flex grow flex flex-col justify-end">
            <p className="text-sm text-gray-600">Starts From</p>
            <p className="text-xl font-semibold text-gray-800">
              {formatCurrency(property.minPrice)}
              <span className="text-sm font-normal text-gray-500">/night</span>
            </p>
          </div>
          <div className="mt-4">
            <Link
              href={`/dashboard/property/${property.id}`}
              className="block w-full text-center bg-white/50 hover:bg-white/80 border border-gray-300/80 text-gray-800 font semibold py-2 px-4 rounded-lg transition-colors"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
