"use client";

import { useLogin } from "@/hooks/user-auth/login/use-login";
import { useSocialLogin } from "@/hooks/user-auth/login/use-social-login";
import "@/lib/firebase/firebase-config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth-store";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { handleLogin, loading: emailLoading, error: emailError } = useLogin();
  const {
    handleSocialLogin,
    loading: socialLoading,
    error: socialError,
  } = useSocialLogin();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await handleLogin(data.email, data.password);

      toast.success("Login successful!");

      const user = useAuthStore.getState().user;

      if (user?.role === "tenant") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      toast.error(emailError || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await handleSocialLogin(idToken, "google");

      toast.success("Google login successful!");

      const user = useAuthStore.getState().user;

      if (user?.role === "tenant") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      toast.error("Google login failed: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* 2-Column Card */}
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-5xl overflow-hidden border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT: Login Form */}
          <div className="p-8 lg:p-12">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ml-3">nginepin</h1>
            </div>
            
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </div>
            
            {/* Form - Compact spacing */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your email"
                  disabled={emailLoading || socialLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 5,
                      message: "Password must be at least 5 characters",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your password"
                  disabled={emailLoading || socialLoading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={emailLoading || socialLoading}
                className="w-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white py-3 rounded-xl hover:from-rose-600 hover:via-rose-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
              >
                {emailLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            
            {/* Error Messages */}
            {emailError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{emailError}</p>
              </div>
            )}
            {socialError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{socialError}</p>
              </div>
            )}
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>
            
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={emailLoading || socialLoading}
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
          
          {/* RIGHT: Info/Illustration */}
          <div className="hidden lg:flex bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">Find Your Perfect Stay</h3>
              <p className="text-rose-100 text-lg mb-8">Discover amazing properties and create unforgettable memories</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-rose-100 text-sm">Properties</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">50k+</div>
                  <div className="text-rose-100 text-sm">Happy Guests</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Register Links - Outside columns, at bottom */}
        <div className="px-8 lg:px-12 pb-8 pt-4 border-t border-gray-200 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
            <p>
              Don&apos;t have an account? 
              <button
                onClick={() => router.push("/auth/register/user")}
                className="text-rose-600 hover:text-rose-700 font-semibold ml-1 transition-all duration-200"
              >
                Register as User
              </button>
            </p>
            <span className="hidden sm:inline text-gray-300">•</span>
            <p>
              Want to list properties? 
              <button
                onClick={() => router.push("/auth/register/tenant")}
                className="text-rose-600 hover:text-rose-700 font-semibold ml-1 transition-all duration-200"
              >
                Become a Tenant
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
