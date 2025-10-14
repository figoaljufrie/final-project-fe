import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { BookingData } from "@/types/booking";
import {
  getStatusConfig,
  formatDate,
  canReviewBooking,
} from "@/lib/utils/booking-utils";

interface BookingCardProps {
  booking: BookingData;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const statusConfig = getStatusConfig(booking.status);
  const property = booking.items[0]?.room?.property;
  const nights = booking.items[0]?.nights || 0;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Property Image */}
          <div className="xl:w-56 flex-shrink-0">
            <div className="relative h-40 xl:h-48 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={
                  property?.images[0]?.url ||
                  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }
                alt={property?.name || "Property"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Header with Property Name and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {property?.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0`}
                  >
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={16} className="text-rose-500 flex-shrink-0" />
                  <span className="text-sm truncate">{property?.address}</span>
                </div>

                {/* Booking Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs uppercase font-medium">Check-in</p>
                      <p className="font-semibold text-gray-800 truncate">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs uppercase font-medium">Check-out</p>
                      <p className="font-semibold text-gray-800 truncate">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs uppercase font-medium">Guests</p>
                      <p className="font-semibold text-gray-800">
                        {booking.totalGuests} • {nights} nights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs uppercase font-medium">Booking No</p>
                      <p className="font-semibold text-gray-800 font-mono text-xs">
                        {booking.bookingNo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Action Section */}
              <div className="xl:w-56 flex-shrink-0">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200/50">
                  {/* Price */}
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Rp {booking.totalAmount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.paymentMethod === "manual_transfer"
                        ? "Manual Transfer"
                        : "Payment Gateway"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href={`/bookings/${booking.id}`}>
                      <Button
                        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </Link>

                    {/* Review Button - Only show for eligible bookings */}
                    {canReviewBooking(booking) && (
                      <Link href={`/bookings/${booking.id}/review`}>
                        <Button
                          variant="outline"
                          className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-xl font-semibold transition-all duration-200"
                        >
                          <Star size={16} className="mr-2" />
                          Write Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



