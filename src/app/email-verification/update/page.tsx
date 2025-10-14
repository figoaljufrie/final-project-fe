"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVerifyEmail } from "@/hooks/user-auth/profile/use-get-me";

function UpdateEmailPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const verifyEmailMutation = useVerifyEmail();
  const { mutateAsync: verifyToken } = verifyEmailMutation;

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token.");
      setMessage("Invalid or missing token.");
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        await verifyToken(token);
        setLoading(false);
        setSuccess(true);
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/profile/settings"), 3000);
      } catch (err: unknown) {
        setLoading(false);
        setSuccess(false);

        let msg = "Verification failed. Please try again.";
        if (err instanceof Error) {
          msg = err.message;
        } else if (
          typeof err === "object" &&
          err !== null &&
          "message" in err
        ) {
          msg = String((err as { message?: string }).message || msg);
        }

        setMessage(msg);
        setErrorMessage(msg);
      }
    };

    verify();
  }, [token, verifyToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200/50 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        {loading && <p className="text-gray-500">Processing...</p>}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {success && <p className="text-green-600">Email verified!</p>}
      </div>
    </div>
  );
}

export default function UpdateEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <UpdateEmailPageContent />
    </Suspense>
  );
}
