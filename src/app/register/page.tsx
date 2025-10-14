"use client";

import { useForm } from "react-hook-form";
import { useRegister } from "@/hooks/user-auth/register/use-register";
import toast from "react-hot-toast";

type FormData = {
  email: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { handleRegister, loading, error, success } = useRegister();

  const onSubmit = async (data: FormData) => {
    const res = await handleRegister(data.email);
    if (res) {
      toast.success("Please Check your email for verification!");
    } else {
      toast.error("Failed to Register, Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200/50">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 ml-3">nginepin</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mt-4 text-center">{success}</p>
        )}
      </div>
    </div>
  );
}
