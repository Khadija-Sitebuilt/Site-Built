"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/common/ConfirmModal";
import MessageCard from "@/components/dashboard/messages/MessageCard";
import Message from "@/components/dashboard/messages/Message";

// Mock data for recent activity
const mockMessages = [
  {
    id: "1",
    from: "Sarah Chen (PM)",
    markedAsRead: true,
    subject: "Downtown Bridge Expansion",
    message:
      "Great work on the east pillar documentaion. Can you also get shots fo the north side by end of day?",
    timestamp: "about 28 hours ago",
  },
  {
    id: "2",
    from: "Michael Torres (PM)",
    markedAsRead: false,
    subject: "Metro Station Foundation",
    message:
      "The concrete pour photo was too dark. Please retake with better lighting or use HDR mode if your phone supports it.",
    timestamp: "about 23 hours ago",
  },
  {
    id: "3",
    from: "Jessica Lee (PM)",
    markedAsRead: false,
    subject: "Highway 101 Resurfacing",
    message:
      "Need measurements for grid sections 4B when you get a chance. Thanks!",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    from: "John Doe",
    markedAsRead: false,
    subject: "New Project Assigned: Harbor Development",
    message:
      "Hi, you've been assigned to the Harbor Development project. Please review the project details and let us know if you have any questions.",
    timestamp: "3 hours ago",
  },
];

export default function MessagesPage() {
  const [message, setMessage] = useState(null);
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
            Messages
          </h1>
          <p className="text-gray-500 font-['Open_Sans',sans-serif] leading-5.5">
            Ask, Clarify, Move Forward faster.
          </p>
        </div>
      </div>

      {/* Main Content: Messages */}
      <div className="flex lg:flex-row gap-8">
        {/* Messages: Conversation */}

        <div className="bg-white p-6.25 flex flex-col gap-7.5 rounded-[0.875rem] w-97.5 shrink-0 border-2 border-black/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-['Inter',sans-serif] font-semibold text-[#f2937] leading-6.75 flex items-center">
              Conversations
            </h2>
            <span className="bg-[#dc2626] text-white text-xs rounded-lg py-0.75 px-2">
              1 new
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {mockMessages.map((message) => (
              <MessageCard key={message.id} {...message} />
            ))}
          </div>
        </div>

        <Message />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        // onConfirm={confirmDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project? This will permanently delete all associated plans, photos, and data.\n\nThis action cannot be undone."
        confirmText="Delete Project"
        confirmStyle="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
