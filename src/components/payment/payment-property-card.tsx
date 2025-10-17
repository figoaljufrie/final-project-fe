"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface Property {
  name: string;
  address: string;
  images: Array<{ url: string }>;
}

interface PaymentPropertyCardProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  nights: number;
  delay?: number;
}

export function PaymentPropertyCard({
  property,
  checkIn,
  checkOut,
  totalGuests,
  nights,
  delay = 0,
}: PaymentPropertyCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      <div className="relative h-64">
        <Image
          src={property.images[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
          alt={property.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-2">
          {property.name}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin size={16} />
          <span>{property.address}</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-sm text-gray-600">{formatDate(checkIn)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium">Check-out</p>
                <p className="text-sm text-gray-600">{formatDate(checkOut)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium">Guests</p>
                <p className="text-sm text-gray-600">{totalGuests} guests</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-gray-600">{nights} nights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
