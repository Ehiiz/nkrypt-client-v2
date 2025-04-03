"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgSmartHomeHeat } from "react-icons/cg";
import { MdExplore } from "react-icons/md";
import { RiUser2Fill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { useUserContext } from "@/app/_utils/context/userContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUserContext();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: CgSmartHomeHeat },
    { href: "/dashboard/explore", label: "Search", icon: MdExplore },
    {
      href: `/dashboard/profile/${user?.id}`,
      label: "Profile",
      icon: RiUser2Fill,
    },
    // { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  const isActive = (path: string) => pathname === path;

  // Only show Create Krypt button on dashboard home and explore pages
  const shouldShowCreateButton =
    pathname === "/dashboard" || pathname === "/dashboard/explore";

  return (
    <div className="flex min-h-screen bg-[#2E3238] font-aeonik">
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#222227] border-r border-gray-700">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-[#B2F17E]">Nkrypt</h2>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "bg-[#B2F17E] text-[#222227]"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      active ? "text-[#222227]" : "text-gray-400"
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
      <div className="lg:pl-64 flex flex-col flex-1 pb-[20px]">
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      </div>

      {/* Floating Create Krypt Button - only shown on specific pages */}
      {shouldShowCreateButton && (
        <Link
          href="/dashboard/krypt/create"
          className="fixed bottom-[80px] cursor-pointer right-4 lg:bottom-8 lg:right-8 bg-[#B2F17E] text-[#222227] rounded-full px-4 py-3 shadow-lg flex items-center z-20 hover:bg-opacity-90 transition-all"
        >
          <FiPlus className="h-5 w-5 mr-2" />
          <span className="font-medium">Create Krypt</span>
        </Link>
      )}

      {/* Fixed bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#222227] border-t border-gray-700 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center py-2 px-3"
              >
                <item.icon
                  className={`h-6 w-6 ${
                    active ? "text-[#B2F17E]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    active ? "text-[#B2F17E] font-medium" : "text-gray-300"
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
