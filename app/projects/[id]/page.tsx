"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/mockData";
import ProjectHeader from "@/components/project/ProjectHeader";
import TabNavigation from "@/components/project/TabNavigation";
import PlansTab from "@/components/project/tabs/PlansTab";
import PhotosTab from "@/components/project/tabs/PhotosTab";
import ReviewTab from "@/components/project/tabs/ReviewTab";
import ExportTab from "@/components/project/tabs/ExportTab";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState('plans');

    // Unwrap params Promise (Next.js 15+)
    const { id } = use(params);

    // Fetch project data (using mock data for now)
    const project = getProjectById(id);

    // If project not found, show 404
    if (!project) {
        notFound();
    }

    // Tab configuration with counts
    const tabs = [
        { id: 'plans', label: 'Plans', count: project.plans.length },
        { id: 'photos', label: 'Photos', count: project.photos.length },
        { id: 'review', label: 'Review' },
        { id: 'export', label: 'Export' },
    ];

    // Render active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'plans':
                return <PlansTab plans={project.plans} photos={project.photos} projectId={project.id} />;
            case 'photos':
                return <PhotosTab photos={project.photos} projectId={project.id} />;
            case 'review':
                return <ReviewTab plans={project.plans} photos={project.photos} projectId={project.id} />;
            case 'export':
                return <ExportTab />;
            default:
                return <PlansTab plans={project.plans} photos={project.photos} projectId={project.id} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Project Header */}
                <ProjectHeader project={project} />

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
