"use client";

import { usePropertyUpdate } from "@/hooks/Inventory/property/ui-state/use-property-update";
import type { PropertyDetail } from "@/lib/types/inventory/property-types";
import { Loader2 } from "lucide-react";
import FormInputGroup from "./form-update";

export default function PropertyUpdateForm({
  property,
  onUpdated,
}: {
  property: PropertyDetail;
  onUpdated?: () => void;
}) {
  const {
    formData,
    isPending,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = usePropertyUpdate({ property, onUpdated });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mt-4">
      <FormInputGroup
        label="Property Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Cozy Apartment"
      />

      <FormInputGroup
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        type="textarea"
        rows={3}
      />

      <FormInputGroup
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />

      <FormInputGroup
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
      />

      <FormInputGroup
        label="Province"
        name="province"
        value={formData.province}
        onChange={handleChange}
      />

      <FormInputGroup
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

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
