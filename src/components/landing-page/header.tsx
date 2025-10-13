"use client";

import { useState, useEffect } from "react";
import { CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useExploreQuery } from "@/hooks/Inventory/property/use-explore-query";

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
          className="font-bold text-xl text-[#8B7355] cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          LOGO
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-6">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full px-4 py-2 rounded-full border border-[#D6D5C9] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Calendar */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenCalendar(!openCalendar)}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>

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
            <Button onClick={() => (window.location.href = "/auth/login")}>
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
