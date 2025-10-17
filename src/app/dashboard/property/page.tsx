"use client";

import CreatePropertyModal from "@/components/dashboard/property/create-property/create-modal";
import PropertyCard from "@/components/dashboard/property/property-card";
import { useTenantProperties } from "@/hooks/Inventory/property/query/use-tenant-properties";
import type { PropertyListItem } from "@/lib/types/inventory/property-types";
import { motion } from "framer-motion";
import { AlertTriangle, Hotel, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function PropertiesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { data: properties, isLoading, isError } = useTenantProperties();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-1/2 mb-6"></div>
              <div className="h-10 bg-gradient-to-r from-rose-100/40 via-rose-50/60 to-rose-100/40 bg-[length:200%_100%] animate-shimmer rounded w-full"></div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Failed to load properties
          </h3>
          <p className="text-gray-600 mt-2">
            There was an error fetching your properties. Please try again later.
          </p>
        </div>
      );
    }

    if (!properties || properties.length === 0) {
      return (
        <div className="text-center glass-card rounded-xl p-12 border-2 border-dashed border-gray-300">
          <Hotel className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            No properties found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first property.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Create Property
          </button>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {properties.map((property: PropertyListItem) => (
          <PropertyCard
            key={property.id}
            property={property}
            variants={itemVariants}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage all your properties in one place.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-600 text-white hover:bg-rose-700 h-10 px-4 py-2"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          New Property
        </button>
      </div>

      {renderContent()}

      <CreatePropertyModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </motion.div>
  );
}
