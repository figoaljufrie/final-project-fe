"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Upload, 
  X, 
  CheckCircle, 
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "react-hot-toast";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: 'manual_transfer' | 'payment_gateway') => void;
  totalAmount: number;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
  bookingId?: number;
  bookingNo?: string;
}

export default function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  onSelectMethod, 
  totalAmount,
  bookingData,
  bookingId,
  bookingNo
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'manual_transfer' | 'payment_gateway' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthStore();

  const paymentMethods = [
    {
      id: 'payment_gateway' as const,
      name: 'Payment Gateway',
      description: 'Credit Card, Bank Transfer, E-wallet',
      icon: CreditCard,
      features: ['Instant confirmation', 'Secure payment', 'Multiple options'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      id: 'manual_transfer' as const,
      name: 'Manual Transfer',
      description: 'Bank transfer with proof upload',
      icon: Upload,
      features: ['Bank transfer', 'Upload proof', 'Manual verification'],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-50'
    }
  ];

  const handleMethodSelect = (method: 'manual_transfer' | 'payment_gateway') => {
    setSelectedMethod(method);
  };

  const handleConfirm = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    try {
      if (selectedMethod === 'payment_gateway') {
        // Create payment gateway payment
        if (bookingId && bookingNo && user) {
          const paymentData = await PaymentService.createPaymentGatewayPayment({
            bookingId,
            bookingNo,
            totalAmount,
            userEmail: user.email,
            userName: user.name
          });
          
          // Redirect to Midtrans payment page
          if (paymentData.redirectUrl) {
            window.location.href = paymentData.redirectUrl;
            return;
          }
        }
        
        // Fallback to old method if no booking data
        onSelectMethod(selectedMethod);
      } else {
        // Manual transfer - just redirect to upload page
        onSelectMethod(selectedMethod);
      }
    } catch (error: unknown) {
      console.error('Payment creation error:', error);
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-[#8B7355]">Choose Payment Method</h3>
                <p className="text-sm text-gray-600 mt-1">Select your preferred payment option</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Booking Summary */}
            <div className="p-6 bg-[#F2EEE3] border-b border-gray-100">
              <h4 className="font-semibold text-[#8B7355] mb-3">Booking Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Check-in:</span>
                  <span className="ml-2 font-medium">{bookingData.checkIn || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Check-out:</span>
                  <span className="ml-2 font-medium">{bookingData.checkOut || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Guests:</span>
                  <span className="ml-2 font-medium">{bookingData.guests} guests</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{bookingData.nights} nights</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <h4 className="font-semibold text-[#8B7355] mb-4">Available Payment Methods</h4>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? `${method.borderColor} ${method.bgColor} ring-2 ring-offset-2 ring-current` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMethodSelect(method.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${method.bgColor}`}>
                          <Icon size={24} className={method.color} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{method.name}</h5>
                            {isSelected && (
                              <CheckCircle size={16} className="text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {method.features.map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Payment Security Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <p className="text-sm text-gray-600">Including taxes and fees</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#8B7355]">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedMethod || isProcessing}
                  className="flex-1 bg-[#8B7355] hover:bg-[#7A6349] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
