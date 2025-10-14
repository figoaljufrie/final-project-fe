"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/profile/profile-sidebar";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  // you can fetch or derive userId here if needed, for now we just set a placeholder
  const userId = "";

  return (
    <div className="min-h-screen flex bg-stone-300 text-gray-800">
      <Sidebar userId={userId} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
