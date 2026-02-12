"use client";

import { useState, useEffect } from "react";
import { ChartColumn, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/common/ConfirmModal";
import ProjectReports from "./project-reports/content";
import AnalyticsDashboard from "./analytics-dashboard/content";

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

const dateFilterOptions = ["Last 7 days", "Last 30 days", "This month"];
const mockReports: Report[] = [
  {
    id: "1",
    projectName: "Landmark Tower Phase 2",
    status: "Completed",
    date: "2024-06-01",
    company: "Metro Development Corp",
    type: "As-Built Report",
    fileSize: "12.4MB",
    accuracy: 98.5,
    photosNumber: 245,
    summary: "Summary of Project Alpha's performance and insights.",
  },
  {
    id: "2",
    projectName: "Marina Bay Construction",
    status: "Completed",
    date: "2024-05-15",
    company: "Coastal Properties Ltd",
    type: "Progress Report",
    fileSize: "8.7MB",
    accuracy: 96.8,
    photosNumber: 156,
    summary: "Summary of Project Beta's performance and insights.",
  },
  {
    id: "3",
    projectName: "Downtown Office Complex",
    status: "Processing",
    date: "2024-05-30",
    company: "Business Hub Inc",
    type: "As-Built Report",
    fileSize: "15.2MB",
    accuracy: 99.2,
    photosNumber: 312,
    summary: "Summary of Project Gamma's performance and insights.",
  },
  {
    id: "4",
    projectName: "Residential Block A",
    status: "Completed",
    date: "2024-06-05",
    company: "Urban Living Co",
    type: "Final Report",
    fileSize: "9.1MB",
    accuracy: 94.3,
    photosNumber: 198,
    summary: "Summary of Project Delta's performance and insights.",
  },
];

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
            Reports & Analytics
          </h1>
          <p className="text-gray-500 font-['Open_Sans',sans-serif] text-lg leading-5.5">
            Turn field data into insights you can act on.
          </p>
        </div>

        <div className="flex gap-4">
          {/* Date Filter */}
          <div className="flex relative items-center">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent cursor-pointer text-lg leading-5.5 bg-gray-100 py-5.25 pl-7 pr-14 rounded-[1.6875rem]"
            >
              {dateFilterOptions.map((value) => {
                return <option key={value}>{value}</option>;
              })}
            </select>
            <ChevronDown className="right-5.5 absolute w-6 h-6 text-[#717182] pointer-events-none" />
          </div>

          <button className="flex items-center justify-center gap-4 text-white font-medium py-2.5 px-5 rounded-full hover:bg-gray-800 transition-all shadow-sm active:scale-95 leading-5.75 text-lg h-16 w-68.5 bg-linear-[191deg,#0088ff,#6155f5_100%] cursor-pointer">
            <ChartColumn className="h-6 w-6" />
            Export Analytics
          </button>
        </div>
      </div>

      {/* Main Content: Reports */}
      <div className="flex flex-col gap-6">
        {/* Tab Buttons */}

        <div className="bg-white p-6 rounded-[0.875rem] w-full">
          <div className="flex w-fit rounded-full relative">
            <div className="w-[calc(100%-7px)] h-full bg-gray-100 absolute rounded-full" />
            <button
              onClick={() => setShowProjectReports(true)}
              className="flex items-center justify-center relative py-3.5 px-5 rounded-full overflow-clip ml-1 my-1"
            >
              {/* Animation: Background and Scale */}
              <span
                className={`${showProjectReports ? "opacity-100 scale-100" : "opacity-0 scale-80"} transition-[opacity,scale] bg-linear-[191deg,#0088ff,#6155f5_100%] duration-700 w-full h-full rounded-full absolute`}
              />

              <span
                className={`relative ${showProjectReports ? "text-white" : "transition-colors delay-500"}`}
              >
                Project Reports
              </span>
            </button>

            <button
              onClick={() => setShowProjectReports(false)}
              className="flex items-center justify-center relative py-3.5 px-5 rounded-full right-2.75 my-1"
            >
              {/* Animation: Background and Scale */}
              <span
                className={`${showProjectReports ? "opacity-0 scale-80" : "opacity-100 scale-100"} bg-linear-[191deg,#0088ff,#6155f5_100%] transition-[opacity,scale] duration-700 w-full h-full rounded-full absolute`}
              />

              <span
                className={`relative ${showProjectReports ? "transition-colors delay-500" : "text-white"}`}
              >
                Analytics Dashboard
              </span>
            </button>
          </div>
        </div>

        {showProjectReports ? <ProjectReports /> : <AnalyticsDashboard />}
        {/* <div className="flex gap-4 w-full">
          <StatusCard
            data={mockReports.length}
            subData="3 ready for download"
            name="Reports"
            className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
          >
            <FileText />
          </StatusCard>

          <StatusCard
            data="97.2%"
            subData="+2.1% from last month"
            name="Average Accuracy"
            className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
          >
            <Target />
          </StatusCard>

          <StatusCard
            data="911"
            subData="Across all reports"
            name="Photos"
            className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
          >
            <ImageIcon />
          </StatusCard>

          <StatusCard
            data="24"
            subData="Average report generation"
            name="Processing Time"
            className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
          >
            <Clock />
          </StatusCard>
        </div>

        <div className="flex flex-col w-full p-6 rounded-[0.875rem] gap-4 bg-white">
          {mockReports.map(
            ({
              id,
              projectName,
              status,
              company,
              type,
              date,
              fileSize,
              accuracy,
              photosNumber,
            }) => (
              <ReportCard
                key={id}
                projectName={projectName}
                status={status}
                company={company}
                type={type}
                date={date}
                fileSize={fileSize}
                accuracy={accuracy}
                photosNumber={photosNumber}
              />
            ),
          )}
        </div> */}
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
