"use client";

import { useState, useEffect } from "react";
import { getPlans, getPhotos, getProjectPlacements, savePhotoPlacement, deletePhotoPlacement, type Plan, type Photo, type PhotoPlacement } from "@/lib/api";
import ReviewSidebar from "@/components/review/ReviewSidebar";
import ReviewPlanView from "@/components/review/ReviewPlanView";
import PlacementStats from "@/components/review/PlacementStats";
import PhotoViewerModal from "@/components/photos/PhotoViewerModal";
import ReviewTabSkeleton from "@/components/project/tabs/ReviewTabSkeleton";

interface ReviewTabProps {
    projectId: string;
}

export default function ReviewTab({ projectId }: ReviewTabProps) {
    const [plans, setPlans] = useState<any[]>([]); // Using any[] to match UI component expectation
    const [photos, setPhotos] = useState<any[]>([]); // Using any[] to include placement status
    const [placements, setPlacements] = useState<PhotoPlacement[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
    const [viewingPhoto, setViewingPhoto] = useState<any | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

    // Toast timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Fetch all data
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [plansData, photosData, placementsData] = await Promise.all([
                    getPlans(projectId),
                    getPhotos(projectId),
                    getProjectPlacements(projectId)
                ]);

                setPlacements(placementsData);

                // Adapt Plans to UI expected format
                const adaptedPlans = plansData.map(plan => ({
                    id: plan.id,
                    projectId: plan.project_id,
                    name: `Plan ${plan.id.substring(0, 8)}`, // Use ID as name if not available
                    fileUrl: plan.file_url,
                    thumbnailUrl: plan.file_url,
                    width: plan.width,
                    height: plan.height,
                    uploadedAt: plan.created_at,
                    is_active: plan.is_active // Pass active state to UI
                }));
                // Cast to any to bypass strict type checking against mockData types for now
                setPlans(adaptedPlans as any[]);

                // Merge photos with placements
                const mergedPhotos = photosData.map(photo => {
                    const placement = placementsData.find(p => p.photo_id === photo.id);
                    return {
                        ...photo,
                        // Map API fields to UI expected fields
                        filename: `Photo ${photo.id.substring(0, 8)}`,
                        thumbnailUrl: photo.file_url,
                        fileUrl: photo.file_url,
                        uploadedAt: photo.exif_timestamp || photo.created_at, // Prioritize EXIF date
                        placementStatus: placement ? 'placed' : 'unplaced',
                        pinPosition: placement ? {
                            x: placement.x,
                            y: placement.y,
                            planId: placement.plan_id,
                            placementMethod: placement.placement_method
                        } : undefined,
                        exif: {
                            latitude: photo.exif_lat,
                            longitude: photo.exif_lng,
                            timestamp: photo.exif_timestamp
                        }
                    };
                });

                setPhotos(mergedPhotos);
            } catch (err) {
                console.error('Error loading review data:', err);
                setToast({ message: "Failed to load project data", type: 'error' });
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [projectId]);

    const handlePhotoSelect = (photoId: string) => {
        if (selectedPhotoId === photoId) {
            const photo = photos.find(p => p.id === photoId);
            if (photo) setViewingPhoto(photo);
        } else {
            setSelectedPhotoId(photoId);
        }
    };

    const handlePinPlace = async (photoId: string, position: { x: number, y: number, planId?: string }) => {
        try {
            // Find active plan ID - usually the first one if not specified
            const activePlanId = position.planId || plans[0]?.id;

            if (!activePlanId) {
                setToast({ message: "No plan selected!", type: 'error' });
                return;
            }

            // Save to database
            const savedPlacement = await savePhotoPlacement({
                photo_id: photoId,
                plan_id: activePlanId,
                x: position.x,
                y: position.y,
                placement_method: 'manual'
            });

            // Update local state
            setPhotos(prev => prev.map(p =>
                p.id === photoId
                    ? {
                        ...p,
                        placementStatus: 'placed',
                        pinPosition: { x: position.x, y: position.y, planId: activePlanId }
                    }
                    : p
            ));

            // Update local state - Placements (Insert or Update)
            setPlacements(prev => {
                const exists = prev.some(p => p.photo_id === photoId);
                if (exists) {
                    return prev.map(p => p.photo_id === photoId ? savedPlacement : p);
                }
                return [...prev, savedPlacement];
            });

            setToast({ message: "Pin placed successfully!", type: 'success' });

        } catch (err) {
            console.error('Error placing pin:', err);
            setToast({ message: "Failed to save placement", type: 'error' });
        }
    };

    const handlePinDelete = async (photoId: string) => {
        try {
            await deletePhotoPlacement(photoId);

            // Update local state - Photos
            setPhotos(prev => prev.map(p =>
                p.id === photoId
                    ? { ...p, pinPosition: undefined, placementStatus: 'unplaced' }
                    : p
            ));

            // Update local state - Placements
            setPlacements(prev => prev.filter(p => p.photo_id !== photoId));

            setToast({ message: "Pin removed successfully", type: 'success' });
        } catch (err) {
            console.error('Error removing pin:', err);
            setToast({ message: "Failed to remove pin", type: 'error' });
        }
    };

    const placedCount = photos.filter(p => p.placementStatus === 'placed').length;
    const unplacedCount = photos.length - placedCount;

    if (loading) {
        return <ReviewTabSkeleton />;
    }

    return (
        <div className="space-y-6">
            <PlacementStats
                total={photos.length}
                placed={placedCount}
                unplaced={unplacedCount}
            />

            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-[calc(100vh-350px)] min-h-[600px] relative">
                {/* Toast Notification */}
                {toast && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' :
                        toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
                        }`}>
                        {toast.message}
                    </div>
                )}

                {/* Left: Plan Viewer */}
                <ReviewPlanView
                    plans={plans}
                    photos={photos}
                    selectedPhotoId={selectedPhotoId}
                    onPhotoSelect={handlePhotoSelect}
                    onPinPlace={handlePinPlace}
                />

                {/* Right: Sidebar */}
                <ReviewSidebar
                    photos={photos}
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
