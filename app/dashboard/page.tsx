"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ProjectCardSkeleton from "@/components/dashboard/ProjectCardSkeleton";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import { getProjectsWithStats, deleteProject } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "./layout";
import ConfirmModal from "@/components/common/ConfirmModal";

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        // Use optimized single-query fetcher
        const apiProjects = await getProjectsWithStats();

        // Transform data to match ProjectCard expected format
        // No more N+1 queries here!
        const projectsWithDetails = apiProjects.map((project) => {
          const plans = project.plans || [];
          const photos = project.photos || [];

          // Flatten placements from all plans for "all pinned" check
          const allPlacements = plans.flatMap((p: any) => p.photo_placements || []);

          const photoCount = photos.length;
          const planCount = plans.length;
          const totalFiles = photoCount + planCount;

          // Progress Calculation
          // 1. Has Plan: 33%
          // 2. Has Photos: 33%
          // 3. All Photos Pinned: 34%
          let progress = 0;
          if (planCount > 0) progress += 33;
          if (photoCount > 0) {
            progress += 33;
            // Check if all photos are pinned
            const placedPhotoIds = new Set(allPlacements.map((p: any) => p.photo_id));
            const allPinned = photos.every((p: any) => placedPhotoIds.has(p.id));
            if (allPinned) progress += 34;
          }

          // Determine status based on progress
          let status: 'draft' | 'processing' | 'completed' = 'draft';
          if (progress === 100) status = 'completed';
          else if (progress > 0) status = 'processing';

          // Determine thumbnail
          let thumbnail = "/images/projects/office-complex.jpg"; // Default
          // Sort explicitly just in case database order isn't perfect (though we ordered in query)
          const sortedPlans = [...plans].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          const sortedPhotos = [...photos].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          if (sortedPlans.length > 0) {
            thumbnail = sortedPlans[0].file_url;
          } else if (sortedPhotos.length > 0) {
            thumbnail = sortedPhotos[0].file_url;
          }

          // Calculate "last updated" based on most recent activity
          let lastUpdated = new Date(project.created_at);
          if (sortedPhotos.length > 0) {
            const photoDate = new Date(sortedPhotos[0].created_at);
            if (photoDate > lastUpdated) lastUpdated = photoDate;
          }
          if (sortedPlans.length > 0) {
            const planDate = new Date(sortedPlans[0].created_at);
            if (planDate > lastUpdated) lastUpdated = planDate;
          }

          return {
            id: project.id,
            title: project.name,
            location: project.description || "No location specified",
            status: status,
            progress: progress,
            thumbnail: thumbnail,
            fileCount: totalFiles,
            lastUpdated: lastUpdated.toLocaleDateString(),
          };
        });

        setProjects(projectsWithDetails);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete);

      // Update local state by removing the deleted project
      setProjects(prev => prev.filter(p => p.id !== projectToDelete));

      setShowDeleteModal(false);
      setProjectToDelete(null);
      setToast({ message: "Project deleted successfully", type: 'success' });
    } catch (err: any) {
      console.error('Error deleting project:', err);
      // We could show a toast here, but for now log it
      setToast({ message: `Failed to delete project: ${err.message}`, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
          {toast.message}
        </div>
      )}

      {/* Dashboard Header & Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {greeting}
            </h1>
            <p className="text-gray-500 mt-1">
              Overview of your construction portfolio
            </p>
          </div>
          <Link
            href="/projects/new"
            className="flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
          >
            Create Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Row */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
              <p className="text-2xl font-semibold text-blue-600">
                {projects.filter(p => p.status !== 'completed').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Files</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.reduce((acc, p) => acc + (p.fileCount || 0), 0)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Projects */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Projects
              {filteredProjects.length > 0 && (
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredProjects.length}
                </span>
              )}
            </h2>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
              >
                <option>All Status</option>
                <option>Processing</option>
                <option>Draft</option>
                <option>Completed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <>
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={() => handleDeleteClick(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    {searchQuery
                      ? `We couldn't find any projects matching "${searchQuery}"`
                      : "Get started by creating your first project to track site progress."}
                  </p>
                  {!searchQuery && (
                    <Link
                      href="/projects/new"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                      Create Project
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Activity
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {mockActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              <div className="p-3 text-center">
                <button className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  View All Activity
                </button>
              </div>
            </div>

            {/* Quick Tips or Info Card could go here */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Pinning all your photos to the floor plan increases your project completion score!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This will permanently delete all associated plans, photos, and data.\n\nThis action cannot be undone."
        confirmText="Delete Project"
        confirmStyle="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
