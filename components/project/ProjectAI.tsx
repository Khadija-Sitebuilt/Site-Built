"use client";

import { useState } from "react";

type ProjectAIProps = {
  projectId: string;
};


export default function ProjectAI({ projectId }: ProjectAIProps) {
  const [summary, setSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");


  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setSummaryError("");
    try {
      const response = await fetch("/api/ai/project-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate summary");
      }
      setSummary(data.summary || "");
    } catch (err: any) {
      setSummaryError(err.message || "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            AI Project Summary
          </h3>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {summaryLoading ? "Generating..." : "Generate"}
          </button>
        </div>
        {summaryError && (
          <div className="text-xs text-red-600 mb-2">{summaryError}</div>
        )}
        {summary ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            Generate a quick summary of this project&apos;s status.
          </div>
        )}
      </div>

    </div>
  );
}
