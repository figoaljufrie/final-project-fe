import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Building } from "lucide-react";
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
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/95 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedProperty ? selectedProperty.name : "All Properties"}
              </h3>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedProperty ? selectedProperty.address : `${properties.length} properties`}
              </p>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </div>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-xl z-50 max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            <motion.button
              whileHover={{ backgroundColor: "rgba(244, 114, 182, 0.1)" }}
              onClick={() => handlePropertySelect(undefined)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                !selectedPropertyId 
                  ? "bg-rose-50 text-rose-700 border border-rose-200" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">All Properties</p>
                  <p className="text-sm text-gray-500">{properties.length} properties</p>
                </div>
              </div>
            </motion.button>

            {properties.map((property) => (
              <motion.button
                key={property.id}
                whileHover={{ backgroundColor: "rgba(244, 114, 182, 0.1)" }}
                onClick={() => handlePropertySelect(property.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedPropertyId === property.id 
                    ? "bg-rose-50 text-rose-700 border border-rose-200" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{property.name}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </p>
                  </div>
                </div>
              </motion.button>
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
