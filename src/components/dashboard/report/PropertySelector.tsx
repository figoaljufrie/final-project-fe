import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTenantProperties } from "@/hooks/report/use-tenant-properties";

interface PropertySelectorProps {
  selectedPropertyId?: number;
  onPropertyChange: (propertyId: number | undefined) => void;
  className?: string;
}

export default function PropertySelector({
  selectedPropertyId,
  onPropertyChange,
  className = "",
}: PropertySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { properties, isLoading } = useTenantProperties();

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handlePropertySelect = (propertyId: number | undefined) => {
    onPropertyChange(propertyId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
      >
        <span className="text-sm text-gray-700">
          {selectedProperty ? selectedProperty.name : "All Properties"}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div className="p-1">
            <button
              onClick={() => handlePropertySelect(undefined)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                !selectedPropertyId 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Properties
            </button>

            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => handlePropertySelect(property.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  selectedPropertyId === property.id 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{property.name}</div>
                <div className="text-xs text-gray-500">{property.address}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
