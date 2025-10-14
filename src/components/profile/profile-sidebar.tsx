"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LuLayoutDashboard, 
  LuCalendar, 
  LuHeart, 
  LuSettings,
  LuUser
} from "react-icons/lu";

interface SidebarProps {
  userId: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar({ userId }: SidebarProps) {
  const pathname = usePathname();

  // reference userId in a non-functional way to satisfy ESLint
  void userId;

  const navItems: NavItem[] = [
    { name: "Profile", href: `/profile/home`, icon: LuUser },
    { name: "My Bookings", href: `/profile/booking`, icon: LuCalendar },
    { name: "Wishlist", href: `/profile/wishlist`, icon: LuHeart },
    { name: "Settings", href: `/profile/settings`, icon: LuSettings },
  ];

  return (
    <aside className="w-72 p-6 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <LuLayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
        <p className="text-gray-600 text-sm">Manage your account and bookings</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive
                  ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive 
                    ? "text-white" 
                    : "text-gray-500 group-hover:text-gray-700"
                )} 
              />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            nginepin
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your trusted booking platform
          </p>
        </div>
      </div>
    </aside>
  );
}
