 "use client";

import { useEffect, useMemo, useState } from "react";
import StatusCard from "@/components/dashboard/dashboard/StatusCard";
import ReportCard from "@/components/dashboard/reports/ReportCard";
import { Clock, FileText, ImageIcon, Target } from "lucide-react";
import { getProjectReports, getProjectsWithStats } from "@/lib/api";
import type { Report as ReportCardData } from "@/app/dashboard/reports/page";

export default function ProjectReports() {
  const [reports, setReports] = useState<ReportCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "—";
    }
    const units = ["B", "KB", "MB", "GB"];
    let index = 0;
    let value = bytes;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)}${units[index]}`;
  };

  const mapStatus = (status?: string): ReportCardData["status"] => {
    switch (status) {
      case "processing":
        return "Processing";
      case "draft":
        return "Started";
      case "for_review":
      case "completed":
      default:
        return "Completed";
    }
  };

  useEffect(() => {
    let isActive = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const projects = await getProjectsWithStats();

        const photoCountMap = new Map<string, number>();
        projects.forEach((project) => {
          photoCountMap.set(project.id, project.photos?.length || 0);
        });

        const reportSets = await Promise.all(
          projects.map(async (project) => {
            const projectReports = await getProjectReports(project.id);
            return projectReports.map((report) => ({
              id: report.id,
              projectName: project.name,
              status: mapStatus(project.status),
              company: project.company || project.location || "—",
              type: report.file_type
                ? `${report.file_type.toUpperCase()} Report`
                : "Report",
              date: report.created_at
                ? new Date(report.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—",
              fileSize: "—",
              accuracy: report.accuracy ?? undefined,
              photosNumber: photoCountMap.get(project.id) ?? 0,
              fileUrl: report.file_url,
            }));
          }),
        );

        const flattened = reportSets.flat();

        const withSizes = await Promise.all(
          flattened.map(async (report) => {
            if (!report.fileUrl) {
              return report;
            }
            try {
              const response = await fetch(report.fileUrl, { method: "HEAD" });
              const lengthHeader = response.headers.get("content-length");
              if (lengthHeader) {
                const bytes = Number.parseInt(lengthHeader, 10);
                if (!Number.isNaN(bytes)) {
                  return {
                    ...report,
                    fileSize: formatBytes(bytes),
                  };
                }
              }

              const bodyResponse = await fetch(report.fileUrl);
              const blob = await bodyResponse.blob();
              return {
                ...report,
                fileSize: formatBytes(blob.size),
              };
            } catch {
              return report;
            }
          }),
        );

        if (isActive) {
          setReports(withSizes);
        }
      } catch (err: any) {
        if (isActive) {
          setError(err?.message || "Failed to load reports.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isActive = false;
    };
  }, []);

  const totalPhotos = useMemo(
    () =>
      reports.reduce(
        (sum, report) =>
          sum + (typeof report.photosNumber === "number" ? report.photosNumber : 0),
        0,
      ),
    [reports],
  );

  return (
    <>
      <div className="flex gap-4 w-full">
        <StatusCard
          data={loading ? "—" : reports.length}
          subData="Ready for download"
          name="Reports"
          className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
        >
          <FileText />
        </StatusCard>

        <StatusCard
          data="—"
          subData="Accuracy not available"
          name="Average Accuracy"
          className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
        >
          <Target />
        </StatusCard>

        <StatusCard
          data={loading ? "—" : totalPhotos}
          subData="Across all reports"
          name="Photos"
          className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
        >
          <ImageIcon />
        </StatusCard>

        <StatusCard
          data="—"
          subData="Processing time not tracked"
          name="Processing Time"
          className="flex-1 [&_p:first-child]:text-3xl [&_p:last-child]:text-xs [&_p:last-child]:mt-1.5"
        >
          <Clock />
        </StatusCard>
      </div>

      <div className="flex flex-col w-full p-6 rounded-[0.875rem] gap-4 bg-white">
        {loading && (
          <div className="text-sm text-gray-500">Loading reports…</div>
        )}
        {error && !loading && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && reports.length === 0 && (
          <div className="text-sm text-gray-500">
            No reports yet. Create one from a project to see it here.
          </div>
        )}
        {!loading &&
          !error &&
          reports.map((report) => (
            <ReportCard
              key={report.id}
              projectName={report.projectName}
              status={report.status}
              company={report.company}
              type={report.type}
              date={report.date}
              fileSize={report.fileSize}
              accuracy={report.accuracy}
              photosNumber={report.photosNumber}
              fileUrl={report.fileUrl}
            />
          ))}
      </div>
    </>
  );
}
