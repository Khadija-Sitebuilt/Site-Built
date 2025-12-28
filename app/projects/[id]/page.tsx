"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getProject, getPlans, getPhotos } from "@/lib/api";
import ProjectHeader from "@/components/project/ProjectHeader";
import TabNavigation from "@/components/project/TabNavigation";
import PlansTab from "@/components/project/tabs/PlansTab";
import PhotosTab from "@/components/project/tabs/PhotosTab";
import ReviewTab from "@/components/project/tabs/ReviewTab";
import ExportTab from "@/components/project/tabs/ExportTab";
import type { Project } from "@/lib/api";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { id } = use(params);
    const [planCount, setPlanCount] = useState(0);
    const [photoCount, setPhotoCount] = useState(0);

    // Fetch project data and counts
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError("");

                // Fetch project details
                const projectData = await getProject(id);
                setProject(projectData);

                // Fetch plans count
                try {
                    const plans = await getPlans(id);
                    setPlanCount(plans.length);
                } catch (planErr) {
                    console.error('Error fetching plans count:', planErr);
                }

                // Fetch photos count
                try {
                    const photos = await getPhotos(id);
                    setPhotoCount(photos.length);
                } catch (photoErr) {
                    console.error('Error fetching photos count:', photoErr);
                }

            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.message || 'Failed to load project');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !project) {
        notFound();
    }

    // Tab configuration
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'plans', label: 'Plans', count: planCount },
        { id: 'photos', label: 'Photos', count: photoCount },
        { id: 'review', label: 'Review' },
        { id: 'export', label: 'Export' },
    ];

    // Determine dynamic next steps message
    const getNextStepsMessage = () => {
        if (planCount === 0) {
            return (
                <>
                    <strong>Next steps:</strong> Upload floor plans to start mapping your construction site. Use the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('plans')}>Plans</strong> tab above.
                </>
            );
        } else {
            return (
                <>
                    <strong>Next steps:</strong> You have {planCount} plan{planCount !== 1 ? 's' : ''} uploaded. Go to the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('plans')}>Plans</strong> tab to view them or upload photos to start mapping.
                </>
            );
        }
    };

    // Render active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Project Name</label>
                                <p className="text-base text-gray-900">{project.name}</p>
                            </div>

                            {project.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                                    <p className="text-base text-gray-900 whitespace-pre-wrap">{project.description}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                                <p className="text-base text-gray-900">{new Date(project.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Project ID</label>
                                <p className="text-sm text-gray-600 font-mono">{project.id}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800">
                                {getNextStepsMessage()}
                            </p>
                        </div>
                    </div>
                );
            case 'plans':
                return <PlansTab projectId={project.id} />;
            case 'photos':
                return <PhotosTab projectId={project.id} />;
            case 'review':
                return <ReviewTab projectId={project.id} />;
            case 'export':
                return <ExportTab />;
            default:
                return null;
        }
    };

    // Transform project for ProjectHeader component
    const headerProject = {
        id: project.id,
        name: project.name,
        location: project.description || '',
        status: 'active' as const,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Project Header */}
                <ProjectHeader project={headerProject} />

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
