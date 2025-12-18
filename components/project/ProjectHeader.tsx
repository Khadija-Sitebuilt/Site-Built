"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, CheckCircle, Archive, Clock } from "lucide-react";
import { Project } from "@/lib/mockData";

interface ProjectHeaderProps {
    project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 text-emerald-700';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            case 'archived':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Clock className="w-3 h-3" />;
            case 'completed':
                return <CheckCircle className="w-3 h-3" />;
            case 'archived':
                return <Archive className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="mb-8">
            {/* Back Button */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Project Title and Status */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Project Description */}
            {project.description && (
                <p className="text-gray-600 mb-6 max-w-3xl">{project.description}</p>
            )}

            {/* Project Metadata */}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium text-gray-900">Start:</span>
                    <span>{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium text-gray-900">End:</span>
                    <span>{formatDate(project.endDate)}</span>
                </div>
            </div>
        </div>
    );
}
