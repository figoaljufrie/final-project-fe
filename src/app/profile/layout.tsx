"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/profile/profile-sidebar";

export default function CustomerLayout({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) {
  return (
    <div className="min-h-screen flex bg-stone-300 text-gray-800">
      <Sidebar userId={userId} />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
