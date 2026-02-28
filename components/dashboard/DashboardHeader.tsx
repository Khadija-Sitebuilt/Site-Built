"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { supabase } from "@/lib/supabase";
import useSearch from "@/hooks/useSearch";

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const [initials, setInitials] = useState<string>("JD");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const fetchUserInitials = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) return;

        const { data, error } = await supabase
          .from("users")
          .select("full_name, email, avatar_url")
          .eq("auth_uid", user.id)
          .single();

        if (error || !data) return;

        const fullName = data.full_name as string | null;
        let derivedInitials = "JD";

        if (fullName && fullName.trim().length > 0) {
          const parts = fullName.trim().split(/\s+/);
          const first = parts[0]?.[0] ?? "";
          const last =
            parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
          derivedInitials =
            (first + last).toUpperCase() || first.toUpperCase() || "JD";
        } else if (data.email) {
          const emailFirstChar = (data.email as string)[0] ?? "";
          derivedInitials = emailFirstChar.toUpperCase() || "JD";
        }

        setInitials(derivedInitials);

        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url as string);
        }
      } catch (e) {
        // Fail silently and keep default initials
        console.error("Failed to fetch user initials", e);
      }
    };

    fetchUserInitials();
  }, []);

  return (
    <header className="sticky top-0 z-10 p-8">
      <div className="flex items-center bg-white justify-between px-4 md:px-8 py-4 rounded-l-2xl rounded-r-[1.75rem]">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search projects, pins, uploads..."
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
