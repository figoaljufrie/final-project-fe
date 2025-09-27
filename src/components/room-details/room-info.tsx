// app/components/room-details/room-info.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wifi, 
  Car, 
  Coffee, 
  Tv, 
  Wind, 
  Waves, 
  Star,
  MapPin,
  Users,
  Home,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomInfo() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const amenities = [
    { icon: Wifi, label: "Free Wi-Fi" },
    { icon: Car, label: "Free Parking" },
    { icon: Coffee, label: "Coffee Machine" },
    { icon: Tv, label: "Smart TV" },
    { icon: Wind, label: "Air Conditioning" },
    { icon: Waves, label: "Pool Access" },
  ];

  const hostInfo = {
    name: "Made Sutrisno",
    joined: "2019",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    verified: true
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      date: "March 2024",
      rating: 5,
      comment: "Amazing villa with breathtaking ocean views! The host was incredibly responsive and helpful. The amenities were exactly as described.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
    },
    {
      id: 2,
      name: "David Chen",
      date: "February 2024",
      rating: 5,
      comment: "Perfect location and stunning property. The infinity pool overlooking the ocean was the highlight of our stay.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
    },
    {
      id: 3,
      name: "Emma Wilson",
      date: "January 2024",
      rating: 4,
      comment: "Beautiful villa with excellent facilities. Minor issue with hot water but the host resolved it quickly.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Property Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#8B7355] mb-2">Luxury Ocean View Villa</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Home size={16} />
                <span>Entire villa</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>8 guests</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Seminyak, Bali</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">4.9</span>
            <span className="text-gray-500">(128 reviews)</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700 leading-relaxed">
          <p className={`${showFullDescription ? '' : 'line-clamp-3'}`}>
            Experience luxury living in this stunning oceanfront villa located in the heart of Seminyak. 
            This contemporary 4-bedroom villa offers breathtaking panoramic views of the Indian Ocean 
            and direct beach access. The open-plan living area seamlessly blends indoor and outdoor 
            living with floor-to-ceiling windows and sliding doors that open onto the expansive terrace.
            
            {showFullDescription && (
              <>
                <br /><br />
                The villa features a private infinity pool that appears to merge with the horizon, 
                creating an unforgettable visual experience. Each bedroom is air-conditioned and 
                includes en-suite bathrooms with rain showers. The master suite boasts a private 
                balcony with unobstructed ocean views.
                
                <br /><br />
                Located just minutes from Seminyak's renowned beach clubs, world-class restaurants, 
                and boutique shopping, this villa offers the perfect blend of tranquility and 
                accessibility to Bali's vibrant culture.
              </>
            )}
          </p>
          
          <Button
            variant="ghost"
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-[#8B7355] p-0 h-auto hover:bg-transparent"
          >
            {showFullDescription ? (
              <>Show less <ChevronUp size={16} className="ml-1" /></>
            ) : (
              <>Show more <ChevronDown size={16} className="ml-1" /></>
            )}
          </Button>
        </div>
      </motion.section>

      {/* Amenities */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-[#8B7355] mb-4">What this place offers</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <amenity.icon size={20} className="text-[#8B7355]" />
              <span className="text-gray-700">{amenity.label}</span>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="mt-4 border-[#8B7355] text-[#8B7355] hover:bg-[#F2EEE3]">
          Show all amenities
        </Button>
      </motion.section>

      {/* Host Information */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-[#8B7355] mb-4">Meet your host</h3>
        
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={hostInfo.avatar}
              alt={hostInfo.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {hostInfo.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8B7355] rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-lg">{hostInfo.name}</h4>
              <span className="text-sm text-gray-500">• Host since {hostInfo.joined}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Superhost • 4.9 ★ rating • 200+ reviews
            </p>
            <p className="text-gray-700 text-sm">
              Hi there! I'm Made, a local Balinese host passionate about sharing the beauty of my island 
              with travelers from around the world. I've been hosting for over 5 years and love helping 
              guests discover hidden gems in Seminyak.
            </p>
            <Button variant="outline" size="sm" className="mt-3 border-[#8B7355] text-[#8B7355] hover:bg-[#F2EEE3]">
              Contact host
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Reviews */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#8B7355]">Reviews (128)</h3>
          <div className="flex items-center gap-1">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold">4.9</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold">{review.name}</h5>
                    <span className="text-sm text-gray-500">• {review.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="mt-6 border-[#8B7355] text-[#8B7355] hover:bg-[#F2EEE3]">
          Show all 128 reviews
        </Button>
      </motion.section>
    </div>
  );
}