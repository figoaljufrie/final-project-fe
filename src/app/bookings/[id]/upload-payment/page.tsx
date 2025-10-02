"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Clock,
  CreditCard,
  Building2,
  Calendar,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";

export default function UploadPaymentProof() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  // Mock booking data - replace with actual data from props/API
  const bookingData = {
    id: 1,
    bookingNo: "BK-2024-001234",
    propertyName: "Ocean View Villa",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    guests: 4,
    nights: 3,
    totalAmount: 960,
    paymentDeadline: "2024-03-10T14:30:00Z",
    bankDetails: {
      bankName: "Bank Central Asia",
      accountNumber: "1234567890",
      accountName: "Nginepin Property",
      branch: "Jakarta Pusat"
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Please upload only JPG or PNG files');
      return;
    }
    
    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      alert('File size must be less than 1MB');
      return;
    }
    
    setFile(file);
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href={`/bookings/${bookingData.id}`}
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#7A6349] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Booking Details</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#8B7355] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#8B7355] mb-2">Upload Payment Proof</h1>
                <p className="text-gray-600">Please upload your bank transfer receipt or payment screenshot</p>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-[#8B7355] bg-[#F2EEE3]' 
                    : file 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-[#8B7355] hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <CheckCircle size={48} className="text-green-500 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">File Selected</h3>
                      <p className="text-sm text-gray-600 mb-2">{file.name}</p>
                      <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setFile(null)}
                      className="text-sm"
                    >
                      Choose Different File
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <FileImage size={48} className="text-gray-400 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Drop your file here</h3>
                      <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block bg-[#8B7355] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#7A6349] transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG (Max size: 1MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Status */}
              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Upload Successful!</p>
                    <p className="text-sm text-green-600">Your payment proof has been submitted for verification.</p>
                  </div>
                </motion.div>
              )}

              {uploadStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle size={20} className="text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Upload Failed</p>
                    <p className="text-sm text-red-600">Please try again or contact support if the problem persists.</p>
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              <div className="mt-8">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    'Upload Payment Proof'
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Booking Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-500" />
                    <span className="text-gray-600">Booking No:</span>
                    <span className="font-medium">{bookingData.bookingNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-500" />
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">{bookingData.propertyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{formatDate(bookingData.checkIn)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{formatDate(bookingData.checkOut)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{bookingData.guests} guests</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-[#8B7355]">${bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Deadline */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Payment Deadline</h3>
                </div>
                <p className="text-sm text-orange-700 mb-2">
                  Please complete your payment before:
                </p>
                <p className="font-bold text-orange-800">
                  {formatDate(bookingData.paymentDeadline)} at {formatTime(bookingData.paymentDeadline)}
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Your booking will be automatically cancelled if payment is not received by this time.
                </p>
              </div>

              {/* Bank Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#8B7355] mb-4">Bank Transfer Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Bank Name:</span>
                    <p className="font-medium">{bookingData.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Number:</span>
                    <p className="font-medium font-mono">{bookingData.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Name:</span>
                    <p className="font-medium">{bookingData.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Branch:</span>
                    <p className="font-medium">{bookingData.bankDetails.branch}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Please include your booking number ({bookingData.bookingNo}) in the transfer description.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
