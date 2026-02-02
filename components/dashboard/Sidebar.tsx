"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";
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

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Messages", href: "/messages", icon: Messages },
  { name: "Reports", href: "/reports", icon: Report },
];

const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/support", icon: HelpAndSupport },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="h-full w-78.25 gap-y-4 p-8 flex flex-col">
      {/* Logo */}
      <div className="flex py-5.5 relative items-center bg-white rounded-t-2xl">
        <Link
          href="/dashboard"
          className="flex items-center w-full h-15 bg-[#f9fafb] pl-3"
        >
          <Image
            src="/images/landing/Logo.png"
            alt="SiteBuilt"
            width={120}
            height={40}
            className="h-auto"
          />
        </Link>
        <ChevronLeft
          className="bg-blue-600 rounded-l-[0.625rem] text-white relative right-0"
          height={36}
          width={26}
        />
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
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 hover:[&_div]:bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 flex ${isActive && "bg-white"} bg-[#f6f6f8] rounded-full items-center justify-center`}
                >
                  <Icon
                    className={`${item.name === "Reports" ? "w-6 h-6 p-1" : "w-6 h-6"} transition-colors ${isActive ? "fill-blue-600 text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                </div>
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Community Card */}
        <div className="flex flex-1 items-center">
          <CommunityCard />
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-4 mt-auto">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-1.5 rounded-full text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 hover:[&_div]:bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 flex ${isActive && "bg-white"} bg-[#f6f6f8] rounded-full items-center justify-center`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                </div>
                <span className="tracking-tight">{item.name}</span>
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
