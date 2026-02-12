"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ChartColumn,
  ChevronDown,
  CircleQuestionMark,
  CircleUserRoundIcon,
  Clock,
  FileText,
  ImageIcon,
  Moon,
  Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/common/ConfirmModal";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import ProfileCardContent from "@/components/dashboard/settings/profile/CardContent";
import AppearanceCardContent from "@/components/dashboard/settings/appearance/CardContent";
import NotificationCardContent from "@/components/dashboard/settings/notification/CardContent";
import HelpAndSupportCardContent from "@/components/dashboard/settings/helpandsupport/CardContent";

export interface Report {
  id?: string | number;
  projectName: string;
  status: "Started" | "Processing" | "Completed";
  company: string;
  type: string;
  date: string;
  fileSize: string;
  accuracy: number;
  photosNumber: number;
  summary?: string;
}

const dateFilterOptions = {};

export default function ActivityPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [showProjectReports, setShowProjectReports] = useState(true);
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
            Profile & Settings
          </h1>
          <p className="text-gray-500 font-['Open_Sans',sans-serif] text-lg leading-5.5">
            Set it once. Work Smoother.
          </p>
        </div>
      </div>

      {/* Main Content: Settings */}
      <div className="flex w-full gap-6">
        <div className="flex flex-col gap-6 flex-1">
          {/* Personal Information */}
          <SettingsCard
            icon={<CircleUserRoundIcon size={22} />}
            header="Profile Information"
            description="Update your personal details"
          >
            <ProfileCardContent />
          </SettingsCard>

          {/* Appearance */}
          <SettingsCard
            icon={<Moon size={22} />}
            header="Appearance"
            description="Customize how SiteSync looks"
          >
            <AppearanceCardContent />
          </SettingsCard>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Notification Preferences */}
          <SettingsCard
            icon={<Bell size={22} />}
            header="Notification Preferences"
            description="Choose how you want to be notified"
          >
            <NotificationCardContent />
          </SettingsCard>

          {/* Help and Support */}
          <SettingsCard
            icon={<CircleQuestionMark size={22} />}
            header="Help & Support"
            description="Get help when you need it"
          >
            <HelpAndSupportCardContent />
          </SettingsCard>
        </div>
      </div>
      {/* </div> */}

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
