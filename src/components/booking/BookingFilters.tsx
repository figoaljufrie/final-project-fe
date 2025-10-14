import { Search } from "lucide-react";
import { FilterStatus, FilterOption } from "@/types/booking";

interface BookingFiltersProps {
  searchTerm: string;
  activeFilter: FilterStatus;
  filterOptions: FilterOption[];
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: FilterStatus) => void;
}

export default function BookingFilters({
  searchTerm,
  activeFilter,
  filterOptions,
  onSearchChange,
  onFilterChange,
}: BookingFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by booking number or property name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="lg:w-64">
          <select
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

