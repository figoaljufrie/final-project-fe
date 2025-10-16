"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useExploreQuery } from "@/hooks/Inventory/property/ui-state/use-explore-query"
import Link from "next/link";

interface HeaderProps {
  initialQuery?: string;
}

export default function Header({ initialQuery = "" }: HeaderProps) {
  const { user, hydrate, logout } = useAuthStore();
  const [openProfile, setOpenProfile] = useState(false);

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
                <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 py-2 w-48 overflow-hidden">
                  <Link href="/profile/home">
                    <button className="block w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100 transition-all duration-200 text-gray-700 hover:text-rose-600">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Profile</span>
                      </div>
                    </button>
                  </Link>
                  <div className="border-t border-gray-200/50 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 text-gray-700 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </div>
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
        </div>
      </div>
    </header>
  );
}
