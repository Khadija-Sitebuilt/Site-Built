"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    Home,
    FolderOpen,
    Activity,
    MessageSquare,
    FileText,
    Settings,
    HelpCircle,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Reports", href: "/reports", icon: FileText },
];

const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help & Support", href: "/support", icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center">
                    <Image
                        src="/images/landing/Logo.png"
                        alt="SiteBuilt"
                        width={120}
                        height={40}
                        className="h-auto"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-4 pb-6 space-y-1">
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
