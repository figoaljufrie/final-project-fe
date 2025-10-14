"use client";

import { PropertyDetail } from "@/lib/types/inventory/property-types";
import { motion } from "framer-motion";
import { Globe2, MapPin, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import PropertyImageUploader from "./property-image-uploader";
import PropertyUpdateForm from "./property-update-form";
import { useUpdateProperty } from "@/hooks/Inventory/property/use-property-mutation";

export default function PropertyHeroSection({
  property,
  onUpdated,
}: {
  property: PropertyDetail;
  onUpdated?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateProperty, isPending } = useUpdateProperty();

  const handleTogglePublish = async () => {
    try {
      await updateProperty({
        propertyId: property.id,
        payload: { published: !property.published },
      });
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 rounded-xl space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {property.name}
            </h1>
            {property.published ? (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                <Eye className="w-4 h-4" />
                Published
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                <EyeOff className="w-4 h-4" />
                Draft
              </span>
            )}
          </div>
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
          <div className="flex gap-2">
            <button
              onClick={handleTogglePublish}
              disabled={isPending}
              className={`text-sm px-4 py-2 rounded-md transition-colors ${
                property.published
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              } disabled:opacity-50`}
            >
              {isPending ? "..." : property.published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-sm px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700"
            >
              {isEditing ? "Close Edit" : "Edit Property"}
            </button>
          </div>
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
