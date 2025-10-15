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
  date: boolean;
  sortBy: boolean;
};

export default function FilterSidebar() {
  const { query, setQuery } = useExploreQuery();

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    propertyType: true,
    date: true,
    sortBy: true,
  });

  const propertyTypes: { id: PropertyCategory; label: string }[] = [
    { id: PropertyCategory.HOUSE, label: "House" },
    { id: PropertyCategory.VILLA, label: "Villa" },
    { id: PropertyCategory.APARTMENT, label: "Apartment" },
  ];

  // Removed CREATED_AT option
  const sortOptions: { id: PropertySortField; label: string }[] = [
    { id: PropertySortField.PRICE, label: "Price" },
    { id: PropertySortField.NAME, label: "Name" },
  ];

  const toggleSection = (key: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setQuery({
      name: "",
      category: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      checkInDate: undefined,
      checkOutDate: undefined,
    });
  };

  return (
    <aside className="w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-fit border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
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
      <div className="mb-6">
        <button
          onClick={() => toggleSection("propertyType")}
          className="flex items-center justify-between w-full mb-4 text-left"
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
              <label
                key={type.id}
                className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
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
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date (Check-in/Check-out) */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("date")}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <h3 className="font-medium text-gray-800">Dates</h3>
          {expandedSections.date ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.date && (
          <div className="flex flex-col space-y-3">
            <input
              type="date"
              value={query.checkInDate || ""}
              onChange={(e) =>
                setQuery({ ...query, checkInDate: e.target.value })
              }
              className="border p-2 rounded-lg text-gray-700"
            />
            <input
              type="date"
              value={query.checkOutDate || ""}
              onChange={(e) =>
                setQuery({ ...query, checkOutDate: e.target.value })
              }
              className="border p-2 rounded-lg text-gray-700"
            />
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
                  onChange={() =>
                    setQuery({
                      ...query,
                      sortBy: option.id,
                      sortOrder:
                        option.id === PropertySortField.PRICE
                          ? PriceSort.ASC
                          : undefined,
                    })
                  }
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
