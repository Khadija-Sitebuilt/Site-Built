import { Report } from "@/app/dashboard/reports/page";
import { Clock, Download } from "lucide-react";

enum StatusBadgeStyleEnum {
  Started = "bg-blue-600 text-green-600",
  Processing = "bg-[#dbeafe] text-[#193cb8] border-[#bedbff]",
  Completed = "bg-[#dcfce7] text-[#016630] border-[#b9f8cf]",
}

export default function ReportCard({
  projectName,
  status,
  company,
  type,
  date,
  fileSize,
  accuracy,
  photosNumber,
}: Report) {
  return (
    <div className="border border-black/10 rounded-[1.75rem] px-6 py-7 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium">{projectName}</h2>
          <p className="text-gray-500 text-sm mt-2">
            {company} &nbsp; &bull; &nbsp; {type} &nbsp; &bull; &nbsp; {date}
          </p>
        </div>
        <span
          className={`${StatusBadgeStyleEnum[status]} py-0.75 px-2 text-xs rounded-full border-2`}
        >
          {status}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-x-6 mt-7.5">
          <div>
            <h3 className="text-gray-500">File size</h3>
            <span>{fileSize}</span>
          </div>
          <div>
            <h3 className="text-gray-500">Accuracy</h3>
            <span>{accuracy}%</span>
          </div>
          <div>
            <h3 className="text-gray-500">Photos</h3>
            <span>{photosNumber}</span>
          </div>
        </div>

        {status === "Processing" ? (
          <button className="flex gap-2 text-sm border-2 border-black/10 rounded-full items-center px-3.5 py-1.5 text-[#0a0a0a]">
            <Clock size={16} />
            Processing...
          </button>
        ) : (
          <div className="flex gap-4">
            <button className="text-sm px-3.5 py-1.5 rounded-full border-2 border-black/10">
              Preview
            </button>
            <button className="flex px-3.5 py-1.5 rounded-full gap-2 items-center text-sm bg-linear-[191deg,#0088ff,#6155f5_100%] text-white">
              <Download size={16} /> Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
