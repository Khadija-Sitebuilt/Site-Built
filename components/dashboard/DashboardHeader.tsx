"use client";

import { Search, Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
    onMenuClick?: () => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function DashboardHeader({
    onMenuClick,
    searchQuery = "",
    onSearchChange
}: DashboardHeaderProps) {

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects by name or location..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

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
                        <button
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                JD
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

