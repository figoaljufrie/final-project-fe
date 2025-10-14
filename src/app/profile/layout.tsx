"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/profile/profile-sidebar";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  // you can fetch or derive userId here if needed, for now we just set a placeholder
  const userId = "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative flex min-h-screen">
        <Sidebar userId={userId} />
        <main className="flex-1 flex flex-col">
          {/* Back Button */}
          <div className="p-6 pb-0">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
          <div className="flex-1 p-6 pt-4 overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
