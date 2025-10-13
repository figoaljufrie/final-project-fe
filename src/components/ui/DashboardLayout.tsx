"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check for saved sidebar state, but default to expanded
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    } else {
      // Default to expanded (not collapsed)
      setIsCollapsed(false);
    }
  }, []);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      <Toaster position="top-right" />
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar onToggle={handleSidebarToggle} isCollapsed={isCollapsed} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
