import Image from "next/image";
import { Eye, Upload, Download, MapPin, FileStack, Clock } from "lucide-react";

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

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-100">
                <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[project.status]
                            }`}
                    >
                        {statusLabels[project.status]}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title & Location */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
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

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileStack className="w-4 h-4" />
                        <span>{project.fileCount} files</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{project.lastUpdated}</span>
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
                <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload More
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
