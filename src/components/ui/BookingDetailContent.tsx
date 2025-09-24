"use client";

import Image from "next/image";
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface BookingDetailContentProps {
  booking: {
    guest: {
      name: string;
      email: string;
      phone: string;
    };
    property: {
      name: string;
      location: string;
      address: string;
      images: string[];
    };
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    paymentMethod: string;
    totalAmount: number;
    paymentDeadline?: string;
    status: string;
    notes?: string;
    rooms: Array<{
      id: number;
      name: string;
      unitCount: number;
      unitPrice: number;
      nights: number;
      subTotal: number;
    }>;
  };
}

export default function BookingDetailContent({ booking }: BookingDetailContentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Guest Information */}
      <div className="glass-card rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
            Guest Information
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-rose-500 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {booking.guest.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">
                {booking.guest.name}
              </h4>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500">{booking.guest.email}</p>
                <p className="text-sm text-gray-500">{booking.guest.phone}</p>
              </div>
            </div>
          </div>
          
          {booking.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Guest Notes</p>
                  <p className="text-sm text-blue-700 mt-1">{booking.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Information */}
      <div className="glass-card rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
            Property Details
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Image
                src={booking.property.images[0] || "/api/placeholder/100/80"}
                alt={booking.property.name}
                width={100}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">
                {booking.property.name}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {booking.property.location}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {booking.property.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="glass-card rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />
            Booking Details
          </h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Check-in</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(booking.checkIn)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Check-out</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(booking.checkOut)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Guests</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.totalGuests} guests
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.paymentMethod === "manual_transfer" ? "Manual Transfer" : "Payment Gateway"}
              </dd>
            </div>
          </dl>

          {/* Room Details */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Room Details</h4>
            <div className="space-y-2">
              {booking.rooms.map((room) => (
                <div key={room.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{room.name}</p>
                    <p className="text-xs text-gray-500">
                      {room.unitCount} room × {room.nights} nights
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(room.subTotal)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(room.unitPrice)}/night
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
