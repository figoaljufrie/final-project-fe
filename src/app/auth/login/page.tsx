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
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Dont have an account?{" "}
            <button
              onClick={() => router.push("/auth/register/user")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Register as User
            </button>
          </p>
          <p className="text-sm text-gray-600">
            Want to list your properties?{" "}
            <button
              onClick={() => router.push("/auth/register/tenant")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Be a Tenant and Share Your Properties!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
