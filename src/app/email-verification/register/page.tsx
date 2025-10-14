"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useVerifyEmail } from "@/hooks/user-auth/register/use-verify-email";
import toast from "react-hot-toast";

type FormData = {
  password: string;
  confirmPassword: string;
};

// Inner component to allow Suspense boundary
function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { handleVerify, loading, error, success } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing verification token.");
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Missing token.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const user = await handleVerify(token, data.password);

    if (user) {
      toast.success("Your account is verified!");
      router.push("/auth/login");
    } else {
      toast.error("Verification failed.");
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
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Verify Email & Set Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                Password is required (min 6 characters)
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", { required: true })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              placeholder="Re-enter password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                Confirm Password is required
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
          >
            {loading ? "Verifying..." : "Set Password & Verify"}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
