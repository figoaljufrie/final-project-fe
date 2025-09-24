"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Star,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Home
} from "lucide-react";
import clsx from "clsx";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    name: "Transaction Management", 
    href: "/dashboard/bookings",
    icon: CreditCard,
    description: "Manage Bookings"
  },
  {
    name: "Reports & Analytics",
    href: "/dashboard/reports", 
    icon: BarChart3,
    description: "Business Insights"
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    description: "Guest Reviews"
  }
];

const userMenu = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User
  },
  {
    name: "Settings", 
    href: "/dashboard/settings",
    icon: Settings
  },
  {
    name: "Logout",
    href: "/logout",
    icon: LogOut
  }
];

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
}

export default function Sidebar({ onToggle, isCollapsed: externalCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    if (externalCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onToggle?.(newCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg"
        >
          {isMobileOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "4rem" : "16rem",
          x: isDesktop ? 0 : (isMobileOpen ? 0 : "-100%")
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={clsx(
          "fixed left-0 top-0 z-50 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl",
          "lg:translate-x-0 lg:relative lg:z-auto",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">NGINEPIN</h1>
                    <p className="text-xs text-gray-500">Tenant Dashboard</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={clsx(
                    "group flex items-center rounded-xl transition-all duration-200 relative",
                    "hover:bg-rose-50 hover:shadow-sm",
                    active 
                      ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg" 
                      : "text-gray-700 hover:text-rose-600",
                    isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-3 py-3"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={clsx(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    active ? "text-white" : "text-gray-500 group-hover:text-rose-500"
                  )} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 min-w-0"
                      >
                        <p className={clsx(
                          "text-sm font-medium truncate",
                          active ? "text-white" : "text-gray-900"
                        )}>
                          {item.name}
                        </p>
                        <p className={clsx(
                          "text-xs truncate",
                          active ? "text-rose-100" : "text-gray-500"
                        )}>
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200/50">
            <div className={clsx(
              "flex items-center mb-3",
              isCollapsed ? "justify-center" : "space-x-3"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    key="user-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Tenant User
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      tenant@nginepin.com
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1">
              {userMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "group flex items-center rounded-lg transition-all duration-200 relative",
                      "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                      isCollapsed ? "justify-center px-3 py-2" : "space-x-3 px-3 py-2"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
