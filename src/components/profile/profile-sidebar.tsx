"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";

interface SidebarProps {
  userId: string;
}

interface NavItem {
  name: string;
  href: string;
}

export default function Sidebar({ userId }: SidebarProps) {
  const pathname = usePathname();

  // reference userId in a non-functional way to satisfy ESLint
  void userId;

  const navItems: NavItem[] = [
    { name: "Home", href: `/profile/home` },
    { name: "My Bookings", href: `/profile/booking` },
    { name: "Wishlist", href: `/profile/wishlist` },
    { name: "Settings", href: `/profile/settings` },
  ];

  return (
    <aside className="w-64 p-4 backdrop-blur-lg bg-gradient-to-br from-teal-400/30 via-teal-600/30 to-teal-800/30 border-r border-teal-300/20">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
        <LuLayoutDashboard /> My Profile
      </h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded-lg transition text-black transform hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,128,128,0.5)]",
              pathname === item.href
                ? "bg-teal-500/30 border border-teal-400/30 shadow-[0_6px_20px_rgba(0,128,128,0.5)]"
                : "hover:bg-teal-500/20"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
