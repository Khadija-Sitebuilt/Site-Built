"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SearchContext } from "@/hooks/useSerarch";
import StatusProvider from "./status-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <SearchContext
      value={{ searchQuery, setSearchQuery }} //, statusFilter, setStatusFilter }}
    >
      <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Component */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 overflow-y-auto pb-8 px-8 bg-linear-[182deg,#f9fafb,#dde7fc40_15%,#f9fafb_60%]">
            <StatusProvider>{children}</StatusProvider>
          </main>
        </div>
      </div>
    </SearchContext>
  );
}
