"use client";

import { useState, useEffect } from "react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import ReviewSidebar from "@/components/review/ReviewSidebar";
import ReviewPlanView from "@/components/review/ReviewPlanView";
import PlacementStats from "@/components/review/PlacementStats";
import PhotoViewerModal from "@/components/photos/PhotoViewerModal";

interface ReviewTabProps {
    plans?: Plan[];
    photos?: Photo[];
    projectId?: string;
}

export default function ReviewTab({ plans = [], photos = [], projectId }: ReviewTabProps) {
    const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
    const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

    // Toast timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Sync if props change
    useEffect(() => {
        setLocalPhotos(photos);
    }, [photos]);

    const handlePhotoSelect = (photoId: string) => {
        // If clicking already selected photo, open viewer
        if (selectedPhotoId === photoId) {
            const photo = localPhotos.find(p => p.id === photoId);
            if (photo) setViewingPhoto(photo);
        } else {
            setSelectedPhotoId(photoId);
        }
    };

    const handlePinPlace = (photoId: string, position: PinPosition) => {
        setLocalPhotos(prev => prev.map(p =>
            p.id === photoId
                ? { ...p, pinPosition: position, placementStatus: 'placed' as const }
                : p
        ));
        setToast({ message: "Pin placed successfully!", type: 'success' });
    };

    const handlePinDelete = (photoId: string) => {
        setLocalPhotos(prev => prev.map(p =>
            p.id === photoId
                ? { ...p, pinPosition: undefined, placementStatus: 'unplaced' as const }
                : p
        ));
        setToast({ message: "Pin removed", type: 'warning' });
    };

    const placedCount = localPhotos.filter(p => p.placementStatus === 'placed').length;
    const unplacedCount = localPhotos.length - placedCount;

    return (
        <div className="space-y-6">
            <PlacementStats
                total={localPhotos.length}
                placed={placedCount}
                unplaced={unplacedCount}
            />

            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-[calc(100vh-350px)] min-h-[600px] relative">
                {/* Toast Notification */}
                {toast && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-white'
                        }`}>
                        {toast.message}
                    </div>
                )}

                {/* Left: Plan Viewer */}
                <ReviewPlanView
                    plans={plans}
                    photos={localPhotos}
                    selectedPhotoId={selectedPhotoId}
                    onPhotoSelect={handlePhotoSelect}
                    onPinPlace={handlePinPlace}
                />

                {/* Right: Sidebar */}
                <ReviewSidebar
                    photos={localPhotos}
                    selectedPhotoId={selectedPhotoId}
                    onPhotoSelect={handlePhotoSelect}
                    onPinDelete={handlePinDelete}
                />
            </div>

            {/* Photo Viewer Modal */}
            <PhotoViewerModal
                photo={viewingPhoto}
                isOpen={!!viewingPhoto}
                onClose={() => setViewingPhoto(null)}
            />
        </div>
    );
}
