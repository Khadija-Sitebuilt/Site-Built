"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

export function DemoModal({ open, onClose }: DemoModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        aria-label="Close demo video"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative z-[61] w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
          <div className="text-sm font-semibold text-gray-800">
            SiteBuilt Demo
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="bg-black">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src="/demo?embed=1"
              title="SiteBuilt Demo Video"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
