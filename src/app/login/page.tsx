// app/login/page.tsx
"use client";

import { useLogin } from "@/hooks/user-auth/login/use-login";
import { useSocialLogin } from "@/hooks/user-auth/login/use-social-login";
import "@/lib/firebase/firebase-config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// make sure this runs and initializes Firebase

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
    const res = await handleLogin(data.email, data.password);
    if (res) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(emailError || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await handleSocialLogin(idToken, "google");
      if (res) {
        toast.success("Google login successful!");
        router.push("/");
      } else {
        toast.error("Social login failed");
      }
    } catch (err: unknown) {
      console.error("Google login error", err);
      toast.error("Google login failed: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              disabled={emailLoading || socialLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              disabled={emailLoading || socialLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={emailLoading || socialLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {emailLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {emailError && (
          <p className="text-red-600 mt-4 text-center">{emailError}</p>
        )}
        {socialError && (
          <p className="text-red-600 mt-2 text-center">{socialError}</p>
        )}

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={emailLoading || socialLoading}
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
