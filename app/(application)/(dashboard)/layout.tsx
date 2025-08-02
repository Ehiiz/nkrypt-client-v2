// app/dashboard/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, Plus } from "lucide-react";
import { useUserContext } from "@/app/_utils/context/userContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUserContext();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/explore", label: "Explore", icon: Compass },
    {
      href: `/dashboard/profile/${user?.id}`,
      label: "Profile",
      icon: User,
    },
  ];

  const isActive = (path: string) => pathname === path;

  // Only show Create Krypt button on dashboard home and explore pages
  const shouldShowCreateButton =
    pathname === "/dashboard" || pathname === "/dashboard/explore";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-aeonik text-white">
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50">
        <div className="flex flex-col h-full">
          <div className="px-6 py-8 border-b border-slate-700/50">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              NKRYPT
            </h2>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors duration-200
                    ${
                      active
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
                    }`}
                >
                  <IconComponent
                    className={`mr-3 h-5 w-5 ${
                      active ? "text-white" : "text-slate-500"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-20 lg:pb-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Floating Create Krypt Button - only shown on specific pages */}
      {shouldShowCreateButton && (
        <Link
          href="/dashboard/krypt/create"
          className="fixed bottom-[80px] cursor-pointer right-4 lg:bottom-8 lg:right-8 group flex-none overflow-hidden px-6 py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 z-20"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Create Krypt</span>
        </Link>
      )}

      {/* Fixed bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center py-2 px-3"
              >
                <IconComponent
                  className={`h-6 w-6 transition-colors duration-200 ${
                    active ? "text-purple-400" : "text-slate-500"
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    active ? "text-purple-400 font-semibold" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
