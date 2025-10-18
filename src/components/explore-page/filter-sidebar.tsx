"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExploreQuery } from "@/hooks/Inventory/property/ui-state/use-explore-query";
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

  const propertyTypes: {
    id: PropertyCategory;
    label: string;
    emoji: string;
  }[] = [
    { id: PropertyCategory.HOUSE, label: "House", emoji: "🏠" },
    { id: PropertyCategory.VILLA, label: "Villa", emoji: "🏡" },
    { id: PropertyCategory.APARTMENT, label: "Apartment", emoji: "🏢" },
  ];

  const sortOptions: { id: PropertySortField; label: string; desc: string }[] =
    [
      { id: PropertySortField.PRICE, label: "Price", desc: "Sort by price" },
      {
        id: PropertySortField.NAME,
        label: "Name",
        desc: "Sort alphabetically",
      },
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

  const hasActiveFilters = !!(
    query.category ||
    query.checkInDate ||
    query.checkOutDate ||
    query.sortBy
  );

  return (
    <aside className="w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-rose-600" />
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <span className="bg-rose-100 text-rose-600 text-xs font-semibold px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("propertyType")}
          className="flex items-center justify-between w-full mb-4 text-left group"
        >
          <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
            Property Type
          </h3>
          {expandedSections.propertyType ? (
            <ChevronUp className="w-5 h-5 text-rose-600 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-all" />
          )}
        </button>

        {expandedSections.propertyType && (
          <div className="space-y-2">
            {propertyTypes.map((type) => {
              const isSelected = query.category === type.id;
              return (
                <label
                  key={type.id}
                  className={`flex items-center cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-50 to-rose-100 border-2 border-rose-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      setQuery({
                        ...query,
                        category: isSelected ? undefined : type.id,
                      })
                    }
                    className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 focus:ring-2"
                  />
                  <span className="ml-3 text-xl">{type.emoji}</span>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isSelected ? "text-rose-700" : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("date")}
          className="flex items-center justify-between w-full mb-4 text-left group"
        >
          <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
            Availability
          </h3>
          {expandedSections.date ? (
            <ChevronUp className="w-5 h-5 text-rose-600 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-all" />
          )}
        </button>

        {expandedSections.date && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={query.checkInDate || ""}
                onChange={(e) =>
                  setQuery({ ...query, checkInDate: e.target.value })
                }
                className="w-full border-2 border-gray-200 p-3 rounded-xl text-gray-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={query.checkOutDate || ""}
                onChange={(e) =>
                  setQuery({ ...query, checkOutDate: e.target.value })
                }
                min={query.checkInDate || undefined}
                className="w-full border-2 border-gray-200 p-3 rounded-xl text-gray-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("sortBy")}
          className="flex items-center justify-between w-full mb-4 text-left group"
        >
          <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
            Sort By
          </h3>
          {expandedSections.sortBy ? (
            <ChevronUp className="w-5 h-5 text-rose-600 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-all" />
          )}
        </button>

        {expandedSections.sortBy && (
          <div className="space-y-2">
            {sortOptions.map((option) => {
              const isSelected = query.sortBy === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex items-start cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-50 to-rose-100 border-2 border-rose-300"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={isSelected}
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
                    className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500 focus:ring-2 mt-0.5"
                  />
                  <div className="ml-3">
                    <span
                      className={`text-sm font-medium block ${
                        isSelected ? "text-rose-700" : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500">{option.desc}</span>
                  </div>
                </label>
              );
            })}

            {/* Price Sort Direction */}
            {query.sortBy === PropertySortField.PRICE && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Price Order
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setQuery({ ...query, sortOrder: PriceSort.ASC })
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      query.sortOrder === PriceSort.ASC
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Low to High
                  </button>
                  <button
                    onClick={() =>
                      setQuery({ ...query, sortOrder: PriceSort.DESC })
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      query.sortOrder === PriceSort.DESC
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    High to Low
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
