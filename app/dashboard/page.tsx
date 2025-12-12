"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import ActivityItem from "@/components/ActivityItem";
import { ArrowRight, ChevronDown } from "lucide-react";

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "Downtown Office Complex",
    location: "123 Main St, City Center",
    status: "processing" as const,
    progress: 75,
    thumbnail: "/images/projects/office-complex.jpg",
    fileCount: 24,
    pendingCount: 3,
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    title: "Residential Tower Phase 2",
    location: "456 Oak Ave, Suburbia",
    status: "draft" as const,
    progress: 0,
    thumbnail: "/images/projects/residential-tower.jpg",
    fileCount: 24,
    lastUpdated: "2 hours ago",
  },
  {
    id: "3",
    title: "Bridge Renovation",
    location: "123 Main St, City Center",
    status: "completed" as const,
    progress: 100,
    thumbnail: "/images/projects/bridge-renovation.jpg",
    fileCount: 24,
    lastUpdated: "2 hours ago",
  },
];

// Mock data for recent activity
const mockActivities = [
  {
    id: "1",
    type: "success" as const,
    message: "Foundation photos uploaded",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "warning" as const,
    message: "Progress report pending review",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    type: "info" as const,
    message: "New project assigned: Harbor Development",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "error" as const,
    message: "Site survey failed to upload",
    timestamp: "2 days ago",
  },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const currentHour = new Date().getHours();
    const timeGreeting =
      currentHour < 12
        ? "Good morning"
        : currentHour < 18
          ? "Good afternoon"
          : "Good evening";
    setGreeting(timeGreeting);
  }, []);

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {greeting}, John!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening on your construction site today.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm w-full sm:w-auto"
        >
          Create New Project
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full">
            <option>All Status</option>
            <option>Processing</option>
            <option>Draft</option>
            <option>Completed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-auto">
          <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full">
            <option>All Time</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
          Sort
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Your Projects Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {mockActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </>
  );
}
