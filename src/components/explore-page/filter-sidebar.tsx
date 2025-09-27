// app/components/explore/filter-sidebar.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterState {
  propertyTypes: string[];
  guests: string;
  priceRange: string;
}

export default function FilterSidebar() {
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    guests: "",
    priceRange: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    guests: true,
    price: true,
  });

  const propertyTypes = [
    { id: "house", label: "House" },
    { id: "hotel", label: "Hotel" },
    { id: "apartment", label: "Apartment" },
    { id: "guesthouse", label: "GuestHouse" },
  ];

  const guestOptions = [
    { id: "1-2", label: "1 - 2" },
    { id: "3-6", label: "3 - 6" },
    { id: "7-10", label: "7 - 10" },
    { id: "10+", label: "10+" },
  ];

  const priceOptions = [
    { id: "lowest", label: "Lowest" },
    { id: "highest", label: "Highest" },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const handleGuestChange = (guest: string) => {
    setFilters(prev => ({ ...prev, guests: guest }));
  };

  const handlePriceChange = (price: string) => {
    setFilters(prev => ({ ...prev, priceRange: price }));
  };

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      guests: "",
      priceRange: "",
    });
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

      {/* Property Type Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('propertyType')}
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
                  checked={filters.propertyTypes.includes(type.id)}
                  onChange={() => togglePropertyType(type.id)}
                  className="w-4 h-4 text-[#8B7355] rounded border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Guests Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('guests')}
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
              <label key={option.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="guests"
                  value={option.id}
                  checked={filters.guests === option.id}
                  onChange={() => handleGuestChange(option.id)}
                  className="w-4 h-4 text-[#8B7355] border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
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
              <label key={option.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={option.id}
                  checked={filters.priceRange === option.id}
                  onChange={() => handlePriceChange(option.id)}
                  className="w-4 h-4 text-[#8B7355] border-[#D6D5C9] focus:ring-[#8B7355]"
                />
                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Show Filter Button */}
      <Button 
        className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
        size="lg"
      >
        Show Filter
      </Button>

      {/* Active Filters Summary */}
      {(filters.propertyTypes.length > 0 || filters.guests || filters.priceRange) && (
        <div className="mt-6 p-4 bg-[#F2EEE3] rounded-lg">
          <h4 className="font-medium text-sm text-[#8B7355] mb-2">Active Filters:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            {filters.propertyTypes.length > 0 && (
              <div>Property: {filters.propertyTypes.join(", ")}</div>
            )}
            {filters.guests && <div>Guests: {filters.guests}</div>}
            {filters.priceRange && <div>Price: {filters.priceRange}</div>}
          </div>
        </div>
      )}
    </aside>
  );
}