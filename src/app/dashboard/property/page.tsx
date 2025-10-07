// app/dashboard/properties/page.tsx
"use client";

import {
  useCreateProperty
} from "@/hooks/Inventory/property/use-property-mutation";
import { useTenantProperties } from "@/hooks/Inventory/property/use-tenant-properties";
import { PropertyCategory } from "@/lib/types/enums/enums-type";
import type {
  CreatePropertyPayload,
  PropertyListItem,
} from "@/lib/types/inventory/property-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Home,
  Hotel,
  Loader2,
  MoreVertical,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
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
        {properties.map((property) => (
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

function PropertyCard({
  property,
  variants,
}: {
  property: PropertyListItem;
  variants: any;
}) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      variants={variants}
      className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {property.image ? (
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-600 capitalize">
              {property.category.toLowerCase()}
            </p>
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500">
              {property.city || "No location set"}
            </p>
          </div>
          {/* Placeholder for future dropdown */}
          <button className="p-2 text-gray-500 hover:text-gray-800">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200/60 flex-grow flex flex-col justify-end">
          <p className="text-sm text-gray-600">Starts From</p>
          <p className="text-xl font-semibold text-gray-800">
            {formatCurrency(property.minPrice)}
            <span className="text-sm font-normal text-gray-500">/night</span>
          </p>
        </div>
        <div className="mt-4">
          <Link
            href={`/dashboard/properties/${property.id}`}
            className="block w-full text-center bg-white/50 hover:bg-white/80 border border-gray-300/80 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Manage Property
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CreatePropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PropertyCategory>(
    PropertyCategory.VILLA
  );

  const { mutate: createProperty, isPending } = useCreateProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreatePropertyPayload = { name, description, category };
    createProperty(payload, {
      onSuccess: () => {
        onClose();
        setName("");
        setDescription("");
        setCategory(PropertyCategory.VILLA);
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/80 border border-white/30 rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Property
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  placeholder="e.g., Sunset Villa"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  placeholder="A beautiful place to stay..."
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PropertyCategory)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  required
                >
                  {Object.values(PropertyCategory).map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Property
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
