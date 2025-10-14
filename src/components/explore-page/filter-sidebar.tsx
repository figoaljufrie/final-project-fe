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
    <aside className="w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-fit border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 font-medium"
        >
          Clear All
        </Button>
      </div>

      {/* Property Type */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("propertyType")}
          className="flex items-center justify-between w-full mb-4 text-left p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <h3 className="font-semibold text-gray-800">Property Type</h3>
          {expandedSections.propertyType ? (
            <ChevronUp className="w-5 h-5 text-rose-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.propertyType && (
          <div className="space-y-3 pl-2">
            {propertyTypes.map((type) => (
              <label key={type.id} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
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
                  className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{type.label}</span>
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
                  className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
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
                  className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
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
                  className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
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
