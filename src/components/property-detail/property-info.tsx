"use client";

import { MapPin, Home } from "lucide-react";
import { usePropertyDetail } from "@/hooks/Inventory/property/use-property-detail";

interface PropertyInfoProps {
  propertyId: number;
}

export default function PropertyInfo({ propertyId }: PropertyInfoProps) {
  const { data, isLoading, isError, refetch } = usePropertyDetail(propertyId);

  if (isLoading)
    return <p className="text-gray-500">Loading property info...</p>;
  if (isError || !data)
    return (
      <div className="text-red-500">
        Failed to load property info.{" "}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  const { description, city, province, address, category } = data;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#D6D5C9] p-6">
      <h2 className="text-xl font-bold text-[#8B7355] mb-4">
        About this property
      </h2>

      {/* Location & Category Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#D6D5C9]">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">
              City
            </div>
            <div className="text-sm font-semibold text-gray-800">{city}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">
              Province
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {province}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Home className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">
              Category
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {category}
            </div>
          </div>
        </div>
      </div>

      {/* Full Address */}
      {address && (
        <div className="mb-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">
              Address
            </div>
            <div className="text-sm text-gray-700">{address}</div>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Description
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
