"use client";

import { useForm } from "react-hook-form";
import { useRegisterTenant } from "@/hooks/user-auth/register/use-register-tenant";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";

type FormData = {
  email: string;
};

export default function RegisterTenantPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { handleRegisterTenant, loading, error, success } = useRegisterTenant();

  const onSubmit = async (data: FormData) => {
    const res = await handleRegisterTenant(data.email);
    if (res) {
      toast.success("Please check your email for tenant verification!");
    } else {
      toast.error("Failed to register tenant, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 border border-gray-200/50 transform hover:scale-[1.02] transition-all duration-300">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ml-4">nginepin</h1>
        </div>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Tenant</h2>
          <p className="text-gray-600">Register to list your properties and start earning</p>
        </div>
        
        {/* Form with enhanced styling */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                placeholder="tenant@example.com"
                disabled={loading}
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white py-4 rounded-xl hover:from-rose-600 hover:via-rose-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Registering...
              </div>
            ) : (
              "Register as Tenant"
            )}
          </button>
        </form>
        
        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}
        
        {/* Back to login link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link href="/auth/login" className="text-rose-600 hover:text-rose-700 font-semibold transition-all duration-200">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
