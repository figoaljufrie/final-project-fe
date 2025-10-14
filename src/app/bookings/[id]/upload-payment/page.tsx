"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Loader2,
  MapPin,
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
  getDeadlineText,
} from "@/lib/utils/payment-deadline";
import { FullScreenLoadingSpinner } from "@/components/ui/loading-spinner";

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
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
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
      } catch (error: unknown) {
        console.error("Error loading booking data:", error);
        toast.error("Failed to load booking data");
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
    // Clear previous errors
    setFileError(null);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = "Please upload a valid image file (JPG or PNG only)";
      setFileError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (max 1MB)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      const errorMsg = `File size must be less than 1MB. Your file is ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setFile(file);
    setUploadStatus("idle");
    toast.success("File selected successfully");
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
    setUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("paymentMethod", "manual_transfer");

      await PaymentService.uploadPaymentProof(
        bookingData.id,
        formData
      );

      setUploadStatus("success");
      toast.success("Payment proof uploaded successfully!");

      // Redirect to booking details after successful upload
      setTimeout(() => {
        router.push(`/bookings/${bookingId}`);
      }, 2000);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to upload payment proof"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  if (isLoading) {
    return (
      <FullScreenLoadingSpinner
        message="Loading booking details"
        subMessage="Please wait while we fetch your booking information..."
      />
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking not found</h3>
          <p className="text-gray-600 mb-6">The booking you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const property = bookingData.items[0]?.room?.property;
  const nights = bookingData.items[0]?.nights || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href={`/bookings/${bookingId}`} className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-all duration-200 mb-6 group">
          <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Booking Details</span>
        </Link>
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Payment Proof</h1>
          <p className="text-gray-600">Complete your booking by uploading bank transfer receipt</p>
        </div>

        {/* Main Grid: Upload Zone + Booking Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT: Upload Zone */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <Upload size={16} className="text-white" />
                </div>
                Payment Proof Upload
              </h2>
              
              {/* Deadline Timer - Beautiful */}
              {!timeRemaining.isExpired && bookingData?.paymentDeadline && (
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900 mb-1">Payment Deadline</h3>
                      <div className="text-2xl font-bold text-orange-800">
                        {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
                      </div>
                      <p className="text-xs text-orange-600 mt-1">
                        Complete within {getDeadlineText(bookingData.paymentMethod)} from booking creation
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Zone - Enhanced */}
              <div 
                className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-300 bg-gray-50/50 hover:border-rose-300 hover:bg-rose-50/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-gray-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your payment proof here</h3>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500 mb-6">Maximum file size: 1MB (JPG, PNG only)</p>
                
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input">
                  <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                    Choose File
                  </Button>
                </label>
                
                {/* File Preview */}
                {file && (
                  <div className="mt-6 p-4 bg-white rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                </div>

              {/* File Error Message */}
              {fileError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-red-800 text-sm font-medium">
                      {fileError}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              <Button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full mt-6 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white py-4 rounded-xl hover:from-rose-600 hover:via-rose-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload size={20} />
                    Upload Payment Proof
                  </div>
                )}
              </Button>

              {/* Upload Status */}
              {uploadStatus === "success" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="text-green-800 font-medium">
                      Upload successful!
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your payment proof has been submitted for review.
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    The property owner will review and confirm your payment.
                    You&apos;ll receive an email notification once confirmed.
                  </p>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-red-600" />
                    <p className="text-red-800 font-medium">Upload failed</p>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              )}
            </div>
            
            {/* Bank Transfer Instructions */}
            <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Bank Transfer Instructions
              </h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Transfer to our bank account (details will be sent via email)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Take a screenshot of your transfer receipt</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Upload the receipt using the form above</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Wait for tenant confirmation (usually within 24 hours)</span>
                </li>
              </ol>
            </div>
          </div>

          {/* RIGHT: Booking Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl sticky top-24">
              {/* Property Image */}
              {property?.images[0] && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={property.images[0].url}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Property Name */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {property?.name}
              </h3>
              
              {/* Booking Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} className="text-rose-600" />
                  <span>{property?.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} className="text-rose-600" />
                  <span>Check-in: {formatDate(bookingData.checkIn)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} className="text-rose-600" />
                  <span>Check-out: {formatDate(bookingData.checkOut)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} className="text-rose-600" />
                  <span>{bookingData.totalGuests} Guests • {nights} nights</span>
                </div>
              </div>
              
              {/* Total Amount */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Rp {bookingData.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
