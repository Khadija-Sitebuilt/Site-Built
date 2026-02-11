"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Home from "./icons/Home";
import ChevronLeft from "./icons/ChevronLeft";
import Folder from "./icons/Folder";
import Activity from "./icons/Activity";
import Messages from "./icons/Messages";
import Report from "./icons/Report";
import HelpAndSupport from "./icons/HelpAndSupport";
import CommunityCard from "./CommunityCard";
import { useState } from "react";
import SitebuiltLogo from "./icons/SitebuiltLogo";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Folder },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Messages", href: "/dashboard/messages", icon: Messages },
  { name: "Reports", href: "/dashboard/reports", icon: Report },
];

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/support", icon: HelpAndSupport },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [enableSidebar, setEnableSidebar] = useState(true);

  return (
    <aside
      className={`flex flex-col h-full ${enableSidebar ? "p-8 w-78.25 gap-y-4" : "px-0 pt-0 pb-8"}`}
    >
      <div
        className={clsx(
          "flex flex-col relative items-center bg-white rounded-t-2xl pt-4",
          enableSidebar && "pb-5.5",
        )}
      >
        {/* Menu when sidebar is collapsed */}
        {!enableSidebar && (
          <Menu
            className="size-10 text-gray-400 bg-[#f6f6f8] rounded-full p-2 hover:bg-white cursor-pointer"
            onClick={() => setEnableSidebar(true)}
          />
        )}

        {/* Logo */}
        <Link
          href="/dashboard"
          className={`relative flex items-center w-full h-15 bg-[#f9fafb] ${enableSidebar ? "pl-3" : "pl-0"}`}
        >
          {enableSidebar ? (
            <>
              <Image
                src="/images/landing/Logo.png"
                alt="SiteBuilt"
                width={120}
                height={40}
                className="h-auto"
              />
              <ChevronLeft
                className="bg-linear-[191deg,#0088ff,#6155f5_100%] rounded-l-[0.625rem] text-white absolute right-0"
                height={36}
                width={26}
                onClick={() => setEnableSidebar(false)}
              />
            </>
          ) : (
            <div className="size-10 bg-white rounded-full flex items-center justify-center mx-auto">
              <SitebuiltLogo className="w-6 h-[1.735rem]" />
            </div>
          )}
        </Link>
      </div>

      <div className="h-full flex flex-col px-4 pt-6 pb-5 bg-white rounded-b-2xl">
        {/* Navigation */}
        <nav className="space-y-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-1.5 rounded-full text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-linear-[191deg,#0088ff,#6155f5_100%] text-white font-semibold shadow-sm"
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 hover:[&_div]:bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 flex ${isActive && "bg-white"} bg-[#f6f6f8] rounded-full items-center justify-center`}
                >
                  <Icon
                    className={`${item.name === "Reports" && "p-1"} size-6 transition-colors ${isActive ? "fill-blue-600 text-white" : item.name === "Reports" ? "fill-gray-400 group-hover:fill-gray-600" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                </div>
                {enableSidebar && (
                  <span className="tracking-tight">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Community Card */}
        {enableSidebar && (
          <div className="flex flex-1 items-center">
            <CommunityCard />
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="space-y-4 mt-auto">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setEnableSidebar(true)}
                className={`flex items-center gap-3 p-1.5 rounded-full text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 bg-linear-[191deg,#0088ff,#6155f5_100%] font-semibold shadow-sm"
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 hover:[&_div]:bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 flex ${isActive && "bg-white"} bg-[#f6f6f8] rounded-full items-center justify-center`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-[#0088ff]" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                </div>
                {enableSidebar && (
                  <span
                    className={clsx("tracking-tight", isActive && "text-white")}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          {/* <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors" />
          <span className="tracking-tight group-hover:text-red-700 transition-colors">
            Logout
          </span>
        </button> */}
        </div>
      </div>
    </aside>
  );
}
