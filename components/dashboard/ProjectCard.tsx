"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Loader2, Eye, Trash2 } from "lucide-react";
import { generateProjectReport } from "@/lib/export-utils";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import Home from "./dashboard/icons/Home";
import Floors from "./dashboard/icons/Floors";
import Photos from "./dashboard/icons/Photos";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    location: string;
    status: "processing" | "draft" | "completed";
    progress: number;
    thumbnail: string;
    fileCount: number;
    pendingCount?: number;
    lastUpdated: string;
  };
  onDelete?: () => void;
}

const statusStyles = {
  processing: "bg-amber-500 text-white",
  draft: "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
};

const statusLabels = {
  processing: "Processing",
  draft: "Draft",
  completed: "Completed",
};

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsExporting(true);
      const result = await generateProjectReport(project.id);

      if (!result.success) {
        // Show specific error using a toast-like approach for now (or a nicer alert)
        // Since user asked for "like delete project success message", we should eventually use a real Toast component.
        // For now, I'll assume ProjectCardMenu's toast or add a local error state.
        // Let's allow the error to be caught or shown via alert but with the precise message.
        // Actually, let's implement the toast logic requested.
        // I will add a temporary local toast for error here or trigger a callback.

        // For this file, I'll add an error toast state.
        setToast({ message: result.error || "Export failed", type: "error" });
        return;
      }

      // Create blob and open
      const blob = new Blob([result.html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      trackEvent(ANALYTICS_EVENTS.EXPORT_GENERATED, {
        projectId: project.id,
        format: "html",
        source: "dashboard_card",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setToast({ message: "An unexpected error occurred.", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="group relative bg-[#f9fafb] rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full p-5">
      {/* Project Thumbnail & Image */}
      <Link
        href={`/projects/${project.id}`}
        className="block relative aspect-video overflow-hidden bg-gray-100"
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-sm ${
              project.status === "completed"
                ? "bg-emerald-500/90 text-white"
                : project.status === "processing"
                  ? "bg-blue-500/90 text-white"
                  : "bg-white/90 text-gray-700"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Menu Button (Top Right) - REMOVED per user request */}
        {/* <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ProjectCardMenu
                        projectId={project.id}
                        projectName={project.title}
                        onDelete={onDelete}
                    />
                </div> */}
      </Link>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title & Location */}
        <div className="mb-4">
          <Link href={`/projects/${project.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
              {project.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Floor and Photos */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Floors className="w-4 h-4" />
            <span>{/* {project.fileCount} */}2 floors</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Photos className="w-4 h-4" />
            <span>{/* {project.lastUpdated} */}156 photos</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {project.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Pending Warning */}
        {project.pendingCount && project.pendingCount > 0 && (
          <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-sm text-yellow-700 font-medium">
              ⚠️ {project.pendingCount} pending
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 relative">
          {/* Toast Notification for Card */}
          {toast && (
            <div
              className={`absolute bottom-full left-0 right-0 mb-2 px-3 py-2 rounded-lg text-xs font-medium text-white shadow-lg text-center z-50 ${
                toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
              }`}
            >
              {toast.message}
            </div>
          )}

          <button
            onClick={(e) => {
              router.push(`/projects/${project.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
          >
            <Eye className="w-4 h-4 text-gray-500" />
            View Project
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              if (onDelete) onDelete();
            }}
            className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
