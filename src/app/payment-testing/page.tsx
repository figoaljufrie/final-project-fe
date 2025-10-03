"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  Upload, 
  CheckCircle, 
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Building2,
  Calendar,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";

export default function PaymentTestingPage() {
  const testScenarios = [
    {
      id: 'manual-transfer',
      title: 'Manual Transfer Payment',
      description: 'Test the manual bank transfer payment flow with proof upload',
      icon: Upload,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
      features: [
        'Upload payment proof (JPG/PNG)',
        'Bank transfer details',
        'Payment deadline timer',
        'Manual verification process'
      ],
      url: '/bookings/manual-transfer-test',
      status: 'Ready for Testing'
    },
    {
      id: 'payment-gateway',
      title: 'Payment Gateway (Midtrans)',
      description: 'Test the automated payment gateway integration',
      icon: CreditCard,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600',
      features: [
        'Credit card payment',
        'Bank transfer options',
        'E-wallet integration',
        'Instant confirmation'
      ],
      url: '/bookings/payment-gateway-test',
      status: 'Ready for Testing'
    },
    {
      id: 'payment-success',
      title: 'Payment Success Page',
      description: 'View the success page after successful payment',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
      features: [
        'Payment confirmation',
        'Booking details',
        'Host information',
        'Next steps guidance'
      ],
      url: '/bookings/1/payment-success',
      status: 'Ready for Testing'
    },
    {
      id: 'payment-pending',
      title: 'Payment Pending Page',
      description: 'View the pending page while payment is being processed',
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-600',
      features: [
        'Payment timer',
        'Status checking',
        'Payment instructions',
        'Auto-refresh functionality'
      ],
      url: '/bookings/1/payment-pending',
      status: 'Ready for Testing'
    },
    {
      id: 'payment-error',
      title: 'Payment Error Page',
      description: 'View the error page when payment fails',
      icon: AlertCircle,
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-600',
      features: [
        'Error details',
        'Troubleshooting steps',
        'Retry options',
        'Support contact'
      ],
      url: '/bookings/1/payment-error',
      status: 'Ready for Testing'
    },
    {
      id: 'upload-payment',
      title: 'Upload Payment Proof',
      description: 'Test the file upload interface for payment proof',
      icon: Upload,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      iconColor: 'text-purple-600',
      features: [
        'Drag & drop upload',
        'File validation',
        'Bank details display',
        'Upload progress'
      ],
      url: '/bookings/1/upload-payment',
      status: 'Ready for Testing'
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/bookings',
      description: 'Create new booking',
      body: {
        roomId: 'number',
        checkIn: 'string',
        checkOut: 'string',
        totalGuests: 'number',
        unitCount: 'number',
        paymentMethod: "'manual_transfer' | 'payment_gateway'",
        notes: 'string (optional)'
      }
    },
    {
      method: 'POST',
      endpoint: '/bookings/{id}/midtrans-payment',
      description: 'Create Midtrans payment',
      body: 'No body required'
    },
    {
      method: 'POST',
      endpoint: '/bookings/{id}/upload-payment',
      description: 'Upload payment proof',
      body: 'FormData with image file'
    },
    {
      method: 'GET',
      endpoint: '/bookings/{id}',
      description: 'Get booking details',
      body: 'No body required'
    },
    {
      method: 'GET',
      endpoint: '/payment/payment-status/{orderId}',
      description: 'Check payment status',
      body: 'No body required'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4">Payment System Testing</h1>
          <p className="text-xl text-gray-600 mb-6">
            Test all payment flows and UI components for the booking system
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All pages use mock data for testing. In production, these would connect to real backend APIs.
            </p>
          </div>
        </motion.div>

        {/* Test Scenarios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#8B7355] mb-6">🧪 Test Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testScenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${scenario.color} border rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg">
                      <Icon size={24} className={scenario.iconColor} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{scenario.title}</h3>
                      <p className="text-sm opacity-80 mb-3">{scenario.description}</p>
                      <span className="inline-block px-2 py-1 bg-white rounded-full text-xs font-medium">
                        {scenario.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Features:</h4>
                    <ul className="text-xs space-y-1">
                      {scenario.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={scenario.url}>
                    <Button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white">
                      Test This Scenario
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#8B7355] mb-6">🔗 API Endpoints</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      endpoint.method === 'POST' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                  {typeof endpoint.body === 'object' ? (
                    <div className="text-xs">
                      <span className="font-medium">Body:</span>
                      <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(endpoint.body, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-xs">
                      <span className="font-medium">Body:</span> {endpoint.body}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#8B7355] mb-6">⚡ Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/bookings/1" className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <Building2 size={24} className="text-[#8B7355] mb-2" />
                <h3 className="font-semibold">Booking Details</h3>
                <p className="text-sm text-gray-600">Main booking page</p>
              </div>
            </Link>
            
            <Link href="/dashboard/bookings" className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <Calendar size={24} className="text-[#8B7355] mb-2" />
                <h3 className="font-semibold">My Bookings</h3>
                <p className="text-sm text-gray-600">Booking list</p>
              </div>
            </Link>
            
            <Link href="/explore" className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <ExternalLink size={24} className="text-[#8B7355] mb-2" />
                <h3 className="font-semibold">Explore</h3>
                <p className="text-sm text-gray-600">Find properties</p>
              </div>
            </Link>
            
            <Link href="/" className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <Users size={24} className="text-[#8B7355] mb-2" />
                <h3 className="font-semibold">Home</h3>
                <p className="text-sm text-gray-600">Landing page</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#8B7355] mb-4">📋 Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Manual Transfer Flow:</h3>
              <ol className="space-y-2 text-sm">
                <li>1. Go to "Manual Transfer Payment" test page</li>
                <li>2. Click "Upload Payment Proof" button</li>
                <li>3. Test file upload (drag & drop or click to browse)</li>
                <li>4. Verify file validation (JPG/PNG, 1MB max)</li>
                <li>5. Check payment success page</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Payment Gateway Flow:</h3>
              <ol className="space-y-2 text-sm">
                <li>1. Go to "Payment Gateway" test page</li>
                <li>2. Click "Pay with Payment Gateway" button</li>
                <li>3. Test payment pending page</li>
                <li>4. Try different payment status scenarios</li>
                <li>5. Check success/error pages</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
