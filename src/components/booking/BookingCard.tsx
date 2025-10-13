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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link href={`/bookings/${booking.id}`}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Property Image */}
            <div className="lg:w-48 flex-shrink-0">
              <div className="relative h-32 lg:h-40 rounded-lg overflow-hidden">
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
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#8B7355]">
                      {property?.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                    >
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="text-sm">{property?.address}</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Guests</p>
                        <p className="font-medium">
                          {booking.totalGuests} • {nights} nights
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Booking No</p>
                        <p className="font-medium font-mono">
                          {booking.bookingNo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="lg:w-48 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#8B7355]">
                      Rp {booking.totalAmount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {booking.paymentMethod === "manual_transfer"
                        ? "Manual Transfer"
                        : "Payment Gateway"}
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
                      >
                        View Details
                      </Button>

                      {/* Review Button - Only show for eligible bookings */}
                      {canReviewBooking(booking) && (
                        <Link href={`/bookings/${booking.id}/review`}>
                          <Button
                            variant="outline"
                            className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
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
      </Link>
    </motion.div>
  );
}



