import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortControlsProps {
  sortBy: "date" | "totalSales";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "date" | "totalSales", sortOrder: "asc" | "desc") => void;
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
}: SortControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "totalSales", label: "Total Sales" },
  ] as const;

  const handleSortByChange = (newSortBy: "date" | "totalSales") => {
    onSortChange(newSortBy, sortOrder);
    setIsOpen(false);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || "Date";

  return (
    <div className="flex items-center gap-2">
      {/* Sort By Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Sort by: {currentSortLabel}
          </span>
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]"
          >
            <div className="p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortByChange(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    sortBy === option.value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sort Order Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSortOrderToggle}
        className="p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
      >
        {sortOrder === "asc" ? (
          <ArrowUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-gray-500" />
        )}
      </motion.button>
    </div>
  );
}
