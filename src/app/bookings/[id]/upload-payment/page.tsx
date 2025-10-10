"use client";

import { useState, useEffect } from "react";
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
  Users,
  Loader2,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { PaymentService } from "@/lib/services/payment/payment-service";
import { toast } from "react-hot-toast";
import { 
  calculateTimeRemaining, 
  formatTimeRemaining, 
  getDeadlineText 
} from "@/lib/utils/payment-deadline";

interface BookingData {
  id: number;
  bookingNo: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentDeadline?: string;
  checkIn: string;
  checkOut: string;
  totalGuests: number;
  items: Array<{
    room: {
      property: {
        name: string;
        address: string;
        images: Array<{ url: string }>;
      };
    };
    nights: number;
  }>;
  user: {
    name: string;
    email: string;
  };
}

export default function UploadPaymentProof() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const data = await PaymentService.getBookingDetails(Number(bookingId));
        setBookingData(data);
      } catch (error: any) {
        console.error('Error loading booking data:', error);
        toast.error('Failed to load booking data');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      loadBookingData();
    }
  }, [bookingId]);

  // Update countdown timer every second
  useEffect(() => {
    if (!bookingData?.paymentDeadline) return;

    const updateTimer = () => {
      const result = calculateTimeRemaining(bookingData.paymentDeadline!);
      setTimeRemaining(result);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [bookingData?.paymentDeadline]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(file);
    setUploadStatus('idle');
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

  const handleUpload = async () => {
    if (!file || !bookingData) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('paymentMethod', 'manual_transfer');

      const result = await PaymentService.uploadPaymentProof(bookingData.id, formData);
      
      setUploadStatus('success');
      toast.success('Payment proof uploaded successfully!');
      
      // Redirect to booking details after successful upload
      setTimeout(() => {
        router.push(`/bookings/${bookingId}`);
      }, 2000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast.error(error.response?.data?.message || 'Failed to upload payment proof');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-[#8B7355]" />
          <p className="text-gray-600">Loading booking data...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Booking not found</p>
          <Link href="/" className="text-[#8B7355] hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const nights = bookingData.items[0]?.nights || 0;

  return (
    <main className="min-h-screen bg-[#F2EEE3]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/bookings/${bookingId}`}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-[#8B7355]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#8B7355]">Upload Payment Proof</h1>
              <p className="text-gray-600">Upload your bank transfer receipt to complete the booking</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Upload Area */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#8B7355] mb-4">Payment Proof Upload</h2>
                
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-[#8B7355] bg-[#8B7355]/5'
                      : file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
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
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">{file.name}</p>
                        <p className="text-sm text-green-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Remove File
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload size={32} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          Drop your payment proof here
                        </p>
                        <p className="text-gray-500 mb-4">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-block px-6 py-2 bg-[#8B7355] text-white rounded-lg cursor-pointer hover:bg-[#7A6349] transition-colors"
                        >
                          Choose File
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        Supported formats: JPEG, PNG, WebP (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="mr-2" />
                          Upload Payment Proof
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Upload Status */}
                {uploadStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <p className="text-green-800 font-medium">Upload successful!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your payment proof has been submitted for review.
                    </p>
                  </motion.div>
                )}

                {uploadStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-red-600" />
                      <p className="text-red-800 font-medium">Upload failed</p>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Please try again or contact support if the problem persists.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Bank Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#8B7355] mb-4">Bank Transfer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium">Bank Central Asia (BCA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium font-mono">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">Nginepin Property</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-[#8B7355]">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> Please include your booking number ({bookingData.bookingNo}) in the transfer description.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Property Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={property?.images[0]?.url || "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={property?.name || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#8B7355] mb-2">{property?.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="text-sm">{property?.address}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(bookingData.checkIn)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{formatDate(bookingData.checkOut)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{bookingData.totalGuests} • {nights} nights</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-[#8B7355] mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-[#8B7355]">Rp {bookingData.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Deadline */}
              {bookingData.paymentDeadline && !timeRemaining.isExpired && (
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-orange-600" />
                    <h3 className="font-bold text-orange-800">Payment Deadline</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-800">
                      {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
                    </div>
                    <p className="text-sm text-orange-600">
                      {timeRemaining.isExpired 
                        ? 'Payment deadline has expired' 
                        : 'Time remaining to upload payment proof'
                      }
                    </p>
                    <p className="text-xs text-orange-500 mt-1">
                      Complete within {getDeadlineText(bookingData.paymentMethod)} from booking creation
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}