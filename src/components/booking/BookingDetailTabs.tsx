"use client";

import { FileText, CreditCard } from "lucide-react";
import BookingDetailsTab from "./BookingDetailsTab";
import BookingPaymentTab from "./BookingPaymentTab";

interface BookingDetailTabsProps {
  activeTab: "details" | "payment";
  setActiveTab: (tab: "details" | "payment") => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    notes?: string;
    items: Array<{
      id: number;
      room: {
        name: string;
        property: {
          tenant: {
            name: string;
            email: string;
            phone?: string;
            avatarUrl?: string;
          };
        };
      };
      unitCount: number;
      unitPrice: number;
      nights: number;
      subTotal: number;
    }>;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    paymentDeadline?: string;
    paymentProofUrl?: string;
  };
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  bookingId: string;
  getDeadlineText: (method: string) => string;
  getDeadlineMessage: (method: string) => string;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export default function BookingDetailTabs({
  activeTab,
  setActiveTab,
  bookingData,
  showPaymentModal,
  setShowPaymentModal,
  bookingId,
  getDeadlineText,
  getDeadlineMessage,
  formatDate,
  formatTime,
}: BookingDetailTabsProps) {
  const tabs = [
    { id: "details", label: "Booking Details", icon: FileText },
    { id: "payment", label: "Payment Info", icon: CreditCard },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 mb-8">
      <div className="border-b border-gray-200/50">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'details' | 'payment')}
                className={`flex items-center gap-3 px-8 py-5 text-sm font-semibold border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "border-rose-500 text-rose-600 bg-rose-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-8">
        {activeTab === "details" && (
          <BookingDetailsTab
            bookingData={bookingData}
            formatDate={formatDate}
          />
        )}

        {activeTab === "payment" && (
          <BookingPaymentTab
            bookingData={bookingData}
            bookingId={bookingId}
            showPaymentModal={showPaymentModal}
            setShowPaymentModal={setShowPaymentModal}
            getDeadlineText={getDeadlineText}
            getDeadlineMessage={getDeadlineMessage}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
}
