import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingEmptyStateProps {
  searchTerm: string;
  activeFilter: string;
}

export default function BookingEmptyState({
  searchTerm,
  activeFilter,
}: BookingEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-12 text-center"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {searchTerm || activeFilter !== "all"
          ? "No bookings found"
          : "No bookings yet"}
      </h3>
      <p className="text-gray-500 mb-6">
        {searchTerm || activeFilter !== "all"
          ? "Try adjusting your search or filter criteria"
          : "Start exploring properties and make your first booking"}
      </p>
      {!searchTerm && activeFilter === "all" && (
        <Link href="/explore">
          <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white">
            Explore Properties
          </Button>
        </Link>
      )}
    </motion.div>
  );
}



