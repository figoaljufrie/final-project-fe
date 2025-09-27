"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import PropertyCard from "./property-card";
import { propertyData, categories, Property } from "@/mock-data/landing-page/mock-landing-page";

export default function LocationGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [properties, setProperties] = useState<Property[]>(propertyData);

  const filteredProperties =
    selectedCategory === "All"
      ? properties
      : properties.filter((p) => p.category === selectedCategory);

  const toggleSave = (id: number) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#8B7355] mb-4">
            Explore by Category
          </h2>
          <p className="text-[#D6D5C9] text-lg max-w-2xl mx-auto">
            Find the perfect place to stay from our curated collection
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          layout
        >
          {filteredProperties.map((p) => (
            <PropertyCard key={p.id} {...p} onToggleSave={toggleSave} />
          ))}
        </motion.div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg">Load More Properties</Button>
        </div>
      </div>
    </section>
  );
}