"use client";

import { useState, useEffect } from "react";
import { CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useExploreQuery } from "@/hooks/Inventory/property/use-explore-query";
import Link from "next/link";

interface HeaderProps {
  initialQuery?: string;
}

export default function Header({ initialQuery = "" }: HeaderProps) {
  const { user, hydrate, logout } = useAuthStore();
  const [openProfile, setOpenProfile] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const { query, setQuery } = useExploreQuery();
  const [searchQuery, setSearchQuery] = useState(initialQuery || query.name);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // If already on explore page, just update query state
    if (window.location.pathname.startsWith("/explore")) {
      setQuery({ ...query, name: trimmed });
    } else {
      // Redirect to explore page with search query
      const params = new URLSearchParams();
      params.set("name", trimmed);
      window.location.href = `/explore?${params.toString()}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl text-gray-900 ml-2">nginepin</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-6">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full px-4 py-2 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">
          {/* Calendar */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenCalendar(!openCalendar)}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>

          {/* MY BOOKINGS - NEW */}
          {user && (
            <Link href="/bookings">
              <Button 
                variant="ghost" 
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">My Bookings</span>
              </Button>
            </Link>
          )}

          {/* User Profile / Login */}
          {user ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpenProfile(!openProfile)}
              >
                <User className="h-5 w-5" />
              </Button>

              {openProfile && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-40">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button 
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
            >
              Login
            </Button>
          )}

          {/* Calendar dropdown */}
          {openCalendar && (
            <div className="absolute right-16 top-12 bg-white shadow-lg rounded-md p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-medium">Sept 2025</p>
                  <div className="text-sm">Calendar grid...</div>
                </div>
                <div>
                  <p className="font-medium">Oct 2025</p>
                  <div className="text-sm">Calendar grid...</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
