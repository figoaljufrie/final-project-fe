"use client";

import { CreditCard, RefreshCw, MessageCircle } from "lucide-react";
import { PaymentCard } from "./payment-card";

export function PaymentTroubleshootingCard({ delay = 0 }: { delay?: number }) {
  return (
    <PaymentCard delay={delay}>
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-4">
        Troubleshooting Tips
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
            <CreditCard size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Check Your Payment Method</h4>
            <p className="text-sm text-gray-600">
              Ensure your card has sufficient funds and the details are correct. 
              Try using a different payment method if available.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
            <RefreshCw size={16} className="text-yellow-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Try Again</h4>
            <p className="text-sm text-gray-600">
              Sometimes payment failures are temporary. Wait a few minutes and try again.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
            <MessageCircle size={16} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Contact Support</h4>
            <p className="text-sm text-gray-600">
              If the problem persists, our support team is here to help you complete your booking.
            </p>
          </div>
        </div>
      </div>
    </PaymentCard>
  );
}
