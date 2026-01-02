"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getProjectWithStats } from "@/lib/api";
import ProjectHeader from "@/components/project/ProjectHeader";
import TabNavigation from "@/components/project/TabNavigation";
import PlansTab from "@/components/project/tabs/PlansTab";
import PhotosTab from "@/components/project/tabs/PhotosTab";
import ReviewTab from "@/components/project/tabs/ReviewTab";
import ExportTab from "@/components/project/tabs/ExportTab";
import ProjectDetailSkeleton from "@/components/project/ProjectDetailSkeleton";
import type { Project } from "@/lib/api";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { id } = use(params);
    const [planCount, setPlanCount] = useState(0);
    const [photoCount, setPhotoCount] = useState(0);
    const [placedPhotoCount, setPlacedPhotoCount] = useState(0);

    // Fetch project data and counts
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError("");

                // Use optimized single-query fetcher
                const projectData = await getProjectWithStats(id);

                // Set project data (stats are included in the response but separate state used for tabs)
                setProject(projectData);

                // Extract counts directly from the joined data
                setPlanCount(projectData.plans?.length || 0);
                setPhotoCount(projectData.photos?.length || 0);

                // Count placed photos (photos with placements)
                const placed = projectData.photos?.filter((p: any) => p.photo_placements && p.photo_placements.length > 0).length || 0;
                setPlacedPhotoCount(placed);

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
        return <ProjectDetailSkeleton />;
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

    // Determine dynamic next steps message based on project state
    const getNextStepsMessage = () => {
        // No plans uploaded yet
        if (planCount === 0) {
            return (
                <>
                    <strong>Next steps:</strong> Upload a floor plan to start mapping your construction site. Use the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('plans')}>Plans</strong> tab above.
                </>
            );
        }

        // Has plans but no photos
        if (photoCount === 0) {
            return (
                <>
                    <strong>Ready to add photos:</strong> You have {planCount} floor plan{planCount !== 1 ? 's' : ''} uploaded. Now upload reference photos in the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('photos')}>Photos</strong> tab to start placing them on your floor plan.
                </>
            );
        }

        // Has photos but none are placed
        if (placedPhotoCount === 0) {
            return (
                <>
                    <strong>Ready to place photos:</strong> You have {photoCount} photo{photoCount !== 1 ? 's' : ''} uploaded but none are placed yet. Go to the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('review')}>Review</strong> tab to place them on your floor plan.
                </>
            );
        }

        // All photos are placed
        if (placedPhotoCount === photoCount) {
            return (
                <>
                    <strong>All set!</strong> All {photoCount} photo{photoCount !== 1 ? 's are' : ' is'} placed on the floor plan. You can view them in the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('review')}>Review</strong> tab or <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('export')}>Export</strong> your documentation.
                </>
            );
        }

        // Some photos are placed, some aren't
        const unplacedCount = photoCount - placedPhotoCount;
        return (
            <>
                <strong>In progress:</strong> {placedPhotoCount} of {photoCount} photo{photoCount !== 1 ? 's are' : ' is'} placed. You have {unplacedCount} unplaced photo{unplacedCount !== 1 ? 's' : ''}. Continue placing them in the <strong className="cursor-pointer text-blue-700" onClick={() => setActiveTab('review')}>Review</strong> tab.
            </>
        );
    };

    // Render active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">About Project</h3>
                                {project.description ? (
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {project.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">No description provided.</p>
                                )}
                            </div>

                            {/* Activity / Next Steps Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">Project Status</h3>
                                <div className="text-blue-800 text-lg mb-6">
                                    {getNextStepsMessage()}
                                </div>
                                <div className="flex gap-3">
                                    {planCount === 0 ? (
                                        <button
                                            onClick={() => setActiveTab('plans')}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                            Upload Floor Plan
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setActiveTab('plans')}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                            View Plans
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setActiveTab('photos')}
                                        className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors shadow-sm"
                                    >
                                        Manage Photos
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Project Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Details</h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 uppercase">Created</dt>
                                        <dd className="mt-1 text-sm text-gray-900 font-medium">
                                            {new Date(project.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-500 uppercase">Project ID</dt>
                                        <dd className="mt-1 text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 break-all select-all">
                                            {project.id}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                    <dt className="text-xs font-medium text-gray-500 uppercase mb-1">Plans</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{planCount}</dd>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                    <dt className="text-xs font-medium text-gray-500 uppercase mb-1">Photos</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{photoCount}</dd>
                                </div>
                            </div>
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
