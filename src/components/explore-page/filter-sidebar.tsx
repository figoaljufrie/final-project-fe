"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExploreQuery } from "@/hooks/Inventory/property/use-explore-query";
import { PropertyCategory } from "@/lib/types/enums/enums-type";
import {
  PropertySortField,
  PriceSort,
} from "@/lib/types/inventory/property-types";

type ExpandedSections = {
  propertyType: boolean;
  guests: boolean;
  price: boolean;
  sortBy: boolean;
};

export default function FilterSidebar() {
  const { query, setQuery } = useExploreQuery();

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    propertyType: true,
    guests: true,
    price: true,
    sortBy: true,
  });

  const propertyTypes: { id: PropertyCategory; label: string }[] = [
    { id: PropertyCategory.HOUSE, label: "House" },
    { id: PropertyCategory.VILLA, label: "Villa" },
    { id: PropertyCategory.APARTMENT, label: "Apartment" },
  ];

  const guestOptions = [
    { id: "1-2", label: "1 - 2" },
    { id: "3-6", label: "3 - 6" },
    { id: "7-10", label: "7 - 10" },
    { id: "10+", label: "10+" },
  ];

  const priceOptions: { id: PriceSort; label: string }[] = [
    { id: PriceSort.ASC, label: "Lowest" },
    { id: PriceSort.DESC, label: "Highest" },
  ];

  const sortOptions: { id: PropertySortField; label: string }[] = [
    { id: PropertySortField.PRICE, label: "Price" },
    { id: PropertySortField.NAME, label: "Name" },
    { id: PropertySortField.CREATED_AT, label: "Created At" },
  ];

  const toggleSection = (key: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setQuery({ name: "" });
  };

  return (
    <aside className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#8B7355]">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[#8B7355] hover:bg-[#F2EEE3]"
        >
          Clear All
        </Button>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("propertyType")}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <h3 className="font-medium text-gray-800">Property Type</h3>
          {expandedSections.propertyType ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.propertyType && (
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <label key={type.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={query.category === type.id}
                  onChange={() =>
                    setQuery({
                      ...query,
                      category:
                        query.category === type.id ? undefined : type.id,
                    })
                  }
                  className="w-4 h-4 text-[#8B7355] rounded border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("guests")}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <h3 className="font-medium text-gray-800">Guests</h3>
          {expandedSections.guests ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.guests && (
          <div className="space-y-3">
            {guestOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="guests"
                  checked={query.guests === option.id}
                  onChange={() => setQuery({ ...query, guests: option.id })}
                  className="w-4 h-4 text-[#8B7355] border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <h3 className="font-medium text-gray-800">Price</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            {priceOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  checked={query.priceSort === option.id}
                  onChange={() => setQuery({ ...query, priceSort: option.id })}
                  className="w-4 h-4 text-[#8B7355] border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("sortBy")}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <h3 className="font-medium text-gray-800">Sort By</h3>
          {expandedSections.sortBy ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.sortBy && (
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortBy"
                  checked={query.sortBy === option.id}
                  onChange={() => setQuery({ ...query, sortBy: option.id })}
                  className="w-4 h-4 text-[#8B7355] border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
