"use client";

import { useState } from "react";
import { useUpdateProperty } from "@/hooks/Inventory/property/use-property-mutation";
import type { PropertyDetail } from "@/lib/types/inventory/property-types";
import { Loader2 } from "lucide-react";

export default function PropertyUpdateForm({
  property,
  onUpdated,
}: {
  property: PropertyDetail;
  onUpdated?: () => void;
}) {
  const [formData, setFormData] = useState({
    name: property.name || "",
    description: property.description || "",
    category: property.category || "apartment",
    city: property.city || "",
    address: property.address || "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: updateProperty, isPending } = useUpdateProperty();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProperty({
      propertyId: property.id,
      payload: formData,
      files,
    });

    if (onUpdated) onUpdated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mt-4">
      {/* 🏠 Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Property Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          placeholder="e.g. Cozy Apartment"
        />
      </div>

      {/* 📝 Description */}
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          rows={3}
        />
      </div>

      {/* 🏷 Category */}
      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
        />
      </div>

      {/* 📍 City */}
      <div>
        <label className="text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
        />
      </div>

      {/* 🏘 Address */}
      <div>
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
        />
      </div>

      {/* 🖼 Optional Image Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Update Images
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full mt-1 text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
      >
        {isPending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
        Save Changes
      </button>
    </form>
  );
}
