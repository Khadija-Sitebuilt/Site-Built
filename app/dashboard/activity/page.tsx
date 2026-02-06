"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ActivityItem from "@/components/dashboard/activity/ActivityItem";
import { CircleX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/common/ConfirmModal";
import ArrowRight from "@/components/dashboard/icons/ArrowRight";
import StatusCard from "@/components/dashboard/dashboard/StatusCard";
import ClockProcessing from "@/components/dashboard/icons/ClockProcessing";
import CompletedCheck from "@/components/dashboard/icons/CompletedCheck";

// Mock data for recent activity
const mockActivities = [
  {
    id: "1",
    alert: "success" as const,
    status: "approved" as const,
    message: "Foundation photos uploaded",
    projectName: "Sunset Villas",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    alert: "warning" as const,
    status: "pending review" as const,
    message: "Progress report pending review",
    projectName: "Downtown Office Complex",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    alert: "info" as const,
    status: "new assignment" as const,
    message: "New project assigned: Harbor Development",
    projectName: "Harbor Development",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    alert: "error" as const,
    status: "upload error" as const,
    message: "You uploaded steel-beam-measurements.jpg",
    projectName: "Downtown Bridge Expansion",
    timestamp: "2 days ago",
  },
];

export default function ActivityPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Dashboard Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-6 bg-white rounded-l-2xl rounded-r-[1.75rem]">
        <div className="w-210 bg-[#f9fafb] px-6 py-3 flex flex-col gap-2 rounded-[2.5rem]">
          <h1 className="text-2xl md:text-[1.75rem] font-['Inter', sans-serif] font-semibold text-gray-900 tracking-tight leading-8.75">
            Activity & Feedback
          </h1>
          <p className="text-gray-500 font-['Open_Sans',sans-serif] text-lg leading-5.5">
            Stay in sync with your project managers in real time.
          </p>
        </div>
        {/* <Link
          href="/projects/new"
          className="flex items-center justify-center gap-4 text-white font-medium py-2.5 px-5 rounded-full hover:bg-gray-800 transition-all shadow-sm active:scale-95 leading-5.75 text-lg h-16 w-68.5 bg-linear-[191deg,#0088ff,#6155f5_100%]"
        >
          Create New Project
          <ArrowRight className="h-4 w-4.75" />
        </Link> */}
      </div>

      {/* Stats Row */}
      {/* {!loading && ( */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatusCard
          name="Approved Today"
          data={projects}
          clasName="rounded-l-2xl"
        >
          <CompletedCheck className="text-[#16A34A]" />
        </StatusCard>
        <StatusCard
          name="Pending Review"
          data={projects.filter((p) => p.status !== "completed")}
        >
          <ClockProcessing className="text-[#2563EB]" />
        </StatusCard>
        <StatusCard
          name="Ready for Review"
          data={projects.filter((p) => p.status === "for review")}
        >
          <CircleX className="text-red-600" />
        </StatusCard>
      </div>
      {/* )} */}

      {/* Main Content: Projects */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar: Recent Activity */}

        <div className="bg-white p-6 rounded-[0.875rem] w-full">
          <div className="flex flex-col gap-6 rounded-xl">
            <div>
              <h2 className="text-xl font-['Inter',sans-serif] font-semibold text-[#f2937] leading-7.5 flex items-center">
                Activity Timeline
              </h2>
              <p className="font-roboto text-sm text-[#6b7280] leading-5.25">
                All updates and status changes for your uploads
              </p>
            </div>
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col shadow-sm rounded-[1.75rem] bg-white p-6"
              >
                <ActivityItem
                  activity={activity}
                  section={
                    activity.alert === "success" ? undefined : "activity"
                  }
                  className="bg-[#f9fafb] items-start border-none p-3 gap-x-4 [&>div:first-child]:bg-white [&>div:first-child]:p-2.75 [&>div:first-child]:rounded-full [&>div:first-child]:m-2.5 [&>div:first-child>svg]:size-5.75 [&>div:last-child>div:first-child>div>p:first-child]:text-[#1f2937] [&>div:last-child>div:first-child>div>p:first-child]:font-inter [&>div:last-child>div:first-child>div>p:first-child]:font-semibold [&>div:last-child>div:first-child>div>p:first-child]:text-xl [&>div:last-child>div:first-child>div>p:first-child]:leading-6 [&>div:last-child>div:last-child>p]:mt-3.25 [&>div:last-child>div:last-child>p]:font-jetbrains-mono"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {/* <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        // onConfirm={confirmDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This will permanently delete all associated plans, photos, and data.\n\nThis action cannot be undone."
        confirmText="Delete Project"
        confirmStyle="danger"
        isLoading={isDeleting}
      /> */}
    </>
  );
}
