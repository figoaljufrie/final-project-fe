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
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
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
