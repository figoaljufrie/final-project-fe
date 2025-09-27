"use client";

import { Button } from "@/components/ui/button";
import {
  Property,
  exploreProperties,
} from "@/mock-data/explore/mock-properties";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  MapPin,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import { useState } from "react";
export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>(exploreProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Pagination
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = properties.slice(
    startIndex,
    startIndex + propertiesPerPage
  );

  const toggleSave = (id: number) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id ? { ...prop, saved: !prop.saved } : prop
      )
    );
  };

  const goToPage = (page: number) => setCurrentPage(page);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#8B7355]">
          {properties.length} Properties Found
        </h2>

        {/* Sort Dropdown */}
        <select className="px-4 py-2 border border-[#D6D5C9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]">
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Property Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        layout
      >
        {currentProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#D6D5C9] group cursor-pointer"
          >
            {/* Property Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Save Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(property.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                <Heart
                  size={16}
                  className={`${
                    property.saved ? "fill-red-500 text-red-500" : "text-white"
                  } transition-colors`}
                />
              </button>

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-medium bg-[#8B7355] text-white rounded-full">
                  {property.category}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              {/* Rating & Reviews */}
              <div className="flex items-center gap-1 mb-2">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{property.rating}</span>
                <span className="text-xs text-gray-500">
                  ({property.reviews} reviews)
                </span>
              </div>

              {/* Property Name & Location */}
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 mb-3">
                <MapPin size={12} className="text-gray-400" />
                <span className="text-sm text-gray-500 line-clamp-1">
                  {property.location}
                </span>
              </div>

              {/* Guests & Amenities */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {property.guests} guests
                  </span>
                </div>
                <div className="flex gap-1">
                  {property.amenities.includes("wifi") && (
                    <Wifi size={12} className="text-gray-400" />
                  )}
                  {property.amenities.includes("coffee") && (
                    <Coffee size={12} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#8B7355]">
                    ${property.price}
                  </span>
                  <span className="text-sm text-gray-500"> / night</span>
                </div>
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all bg-[#8B7355] hover:bg-[#7A6349]"
                >
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-
          {Math.min(startIndex + propertiesPerPage, properties.length)} of{" "}
          {properties.length} properties
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="border-[#D6D5C9]"
          >
            <ChevronLeft size={16} />
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className={`w-8 h-8 p-0 ${
                  page === currentPage
                    ? "bg-[#8B7355] text-white"
                    : "border-[#D6D5C9] hover:bg-[#F2EEE3]"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="border-[#D6D5C9]"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
