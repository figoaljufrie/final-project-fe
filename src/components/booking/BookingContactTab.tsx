"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BookingContactTabProps {
  bookingData: {
    items: Array<{
      room: {
        property: {
          tenant: {
            name: string;
            email: string;
            phone?: string;
            avatarUrl?: string;
          };
        };
      };
    }>;
  };
}

export default function BookingContactTab({
  bookingData,
}: BookingContactTabProps) {
  const tenant = bookingData.items[0]?.room?.property?.tenant;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Image
          src={
            tenant?.avatarUrl ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
          }
          alt={tenant?.name || "Host"}
          width={60}
          height={60}
          className="w-15 h-15 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-[#8B7355]">
            {tenant?.name || "Host"}
          </h3>
          <p className="text-sm text-gray-600">Property Host</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.9</span>
            <span className="text-sm text-gray-500">(128 reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-[#8B7355] flex items-center gap-2">
            <Phone size={20} />
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-500" />
              <span className="text-sm">
                {tenant?.phone || "Phone not available"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <span className="text-sm">
                {tenant?.email || "Email not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-[#8B7355]">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle size={16} className="mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone size={16} className="mr-2" />
              Call Host
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
