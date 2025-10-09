"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Globe2 } from "lucide-react";
import { ImagePlus } from "lucide-react";
import PropertyUpdateForm from "./property-update-form";
import PropertyImageUploader from "./property-image-uploader";
import { PropertyDetail } from "@/lib/types/inventory/property-types";

export default function PropertyHeroSection({
  property,
  onUpdated,
}: {
  property: PropertyDetail;
  onUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 rounded-xl space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-gray-600 mt-1">
            {property.description || "No description yet."}
          </p>

          <div className="flex flex-col mt-3 space-y-1 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-500" />
              {property.city || "Unknown city"},{" "}
              {property.address || "No address"}
            </p>
            <p className="flex items-center gap-1">
              <Globe2 className="w-4 h-4 text-rose-500" />
              Lat: {property.latitude ?? "–"}, Lng: {property.longitude ?? "–"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-sm px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700"
          >
            {isEditing ? "Close Edit" : "Edit Property"}
          </button>
          <PropertyImageUploader
            propertyId={property.id}
            images={property.images.map((img, index) => ({
              id: index,
              url: img.url,
            }))}
          />
        </div>
      </div>

      {isEditing && (
        <PropertyUpdateForm
          property={property}
          onUpdated={() => {
            setIsEditing(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </motion.div>
  );
}
