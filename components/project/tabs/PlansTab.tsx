"use client";

import { useState } from "react";
import { FileText, Calendar, Maximize2 } from "lucide-react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import Link from "next/link";
import PlanViewerModal from "../PlanViewerModal";

interface PlansTabProps {
    plans: Plan[];
    photos: Photo[];
    projectId: string;
}

export default function PlansTab({ plans, photos: initialPhotos, projectId }: PlansTabProps) {
    const [photos, setPhotos] = useState(initialPhotos);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const handleViewPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePinPlace = (photoId: string, position: PinPosition) => {
        setPhotos(prevPhotos => prevPhotos.map(photo => {
            if (photo.id === photoId) {
                return {
                    ...photo,
                    pinPosition: position,
                    placementStatus: 'placed'
                };
            }
            return photo;
        }));
    };

    if (plans.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No floor plans yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload floor plans to start mapping photos and creating as-built documentation.
                </p>
                <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    <FileText className="w-5 h-5" />
                    Upload Floor Plan
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Upload Button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Floor Plans</h2>
                    <p className="text-sm text-gray-600">
                        {plans.length} plan{plans.length !== 1 ? 's' : ''} uploaded
                    </p>
                </div>
                <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                    <FileText className="w-4 h-4" />
                    Upload New Plan
                </Link>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => handleViewPlan(plan)}
                        className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                        {/* Plan Thumbnail */}
                        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            {plan.thumbnailUrl ? (
                                <img
                                    src={plan.thumbnailUrl}
                                    alt={plan.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <FileText className="w-16 h-16 text-gray-300" />
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-3 rounded-full bg-white">
                                        <Maximize2 className="w-5 h-5 text-gray-900" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plan Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 truncate">{plan.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(plan.uploadedAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>{plan.width} × {plan.height} px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plan Viewer Modal */}
            <PlanViewerModal
                plan={selectedPlan}
                photos={photos}
                isOpen={isViewerOpen}
                onClose={handleCloseViewer}
                onPinPlace={handlePinPlace}
            />
        </div>
    );
}
