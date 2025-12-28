"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import { getProjects } from "@/lib/api";
import { useDashboard } from "./layout";

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
  const { searchQuery, statusFilter, setStatusFilter } = useDashboard();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Fetch projects on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");
        const apiProjects = await getProjects();

        // Transform API projects to match ProjectCard expected format
        const transformedProjects = apiProjects.map(project => ({
          id: project.id,
          title: project.name,
          location: project.description || "No location specified",
          status: 'draft' as const, // Default status since API doesn't provide it
          progress: 0,
          thumbnail: "/images/projects/office-complex.jpg",
          fileCount: 0,
          lastUpdated: new Date(project.created_at).toLocaleDateString(),
        }));

        setProjects(transformedProjects);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" ||
      project.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Recently viewed projects (first 3)
  const recentlyViewed = projects.slice(0, 3);

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {greeting}!
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

      {/* Status Filter */}
      <div className="mb-6 flex items-center justify-end">
        <div className="relative w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full"
          >
            <option>All Status</option>
            <option>Processing</option>
            <option>Draft</option>
            <option>Completed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}

      {/* Recently Viewed Section */}
      {!loading && !searchQuery && recentlyViewed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Recently Viewed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((project) => (
              <ProjectCard key={`recent-${project.id}`} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Your Projects Section */}
      {!loading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'Your Projects'}
            </h2>
            {!searchQuery && projects.length > 0 && (
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all
              </button>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              {projects.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first project</p>
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create New Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <p className="text-gray-500">No projects found matching your search.</p>
              )}
            </div>
          )}
        </div>
      )}

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
