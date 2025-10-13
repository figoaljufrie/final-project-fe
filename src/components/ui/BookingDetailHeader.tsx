"use client";

import { 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface BookingDetailHeaderProps {
  booking: {
    id: string;
    bookingNo: string;
    status: string;
    createdAt: string;
  };
  statusConfig: Record<string, {
    label: string;
    color: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }>;
  onBack: () => void;
  onConfirm: () => void;
  onReject: () => void;
  isLoading: boolean;
}

export default function BookingDetailHeader({
  booking,
  statusConfig,
  onBack,
  onConfirm,
  onReject,
  isLoading
}: BookingDetailHeaderProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusIcon = statusConfig[booking.status]?.icon || ClockIcon;

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking #{booking.bookingNo}
            </h1>
            <p className="text-sm text-gray-500">
              Created {formatDateTime(booking.createdAt)}
            </p>
          </div>
        </div>
    
        <div className="flex items-center space-x-3">
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
              statusConfig[booking.status]?.color
            )}
          >
            <StatusIcon className="h-4 w-4 mr-1.5" />
            {statusConfig[booking.status]?.label}
          </span>
          
          {booking.status === "waiting_for_confirmation" && (
            <div className="flex space-x-2">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-1.5" />
                Confirm
              </button>
              <button
                onClick={onReject}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4 mr-1.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
