import StatusCard from "@/components/dashboard/dashboard/StatusCard";
import ReportCard from "@/components/dashboard/reports/ReportCard";
import { Clock, FileText, ImageIcon, Target } from "lucide-react";

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

export default function ProjectReports() {
  return (
    <>
      <div className="flex gap-4 w-full">
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
      </div>
    </>
  );
}
