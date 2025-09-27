"use client";

import { useState } from "react";
import { CalendarDays, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="font-bold text-xl text-[#8B7355]">LOGO</div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-6">
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full px-4 py-2 rounded-full border border-[#D6D5C9] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
          />
        </div>

        {/* Profile & Calendar */}
        <div className="flex items-center gap-4 relative">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenCalendar(!openCalendar)}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Profile Modal */}
          {openProfile && (
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-40">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}

          {/* Calendar Modal */}
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