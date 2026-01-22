"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, X, Filter, Trash2, CheckSquare, Wand2 } from "lucide-react";
import { uploadPhoto, getPhotos, deletePhotos, type Photo } from "@/lib/api";
import Link from "next/link";
import PhotoList from "@/components/photos/PhotoList";
import PhotosTabSkeleton from "@/components/project/tabs/PhotosTabSkeleton";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/common/ConfirmModal";

interface PhotosTabProps {
    projectId: string;
}

export default function PhotosTab({ projectId }: PhotosTabProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [placedPhotoIds, setPlacedPhotoIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [filter, setFilter] = useState<'all' | 'placed' | 'unplaced'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [plans, setPlans] = useState<any[]>([]);
    const [isAutoPlacing, setIsAutoPlacing] = useState(false);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Fetch photos and placements on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                // 1. Fetch Photos
                const fetchedPhotos = await getPhotos(projectId);
                setPhotos(fetchedPhotos);

                // 2. Fetch Placements
                const { data: plansData } = await supabase
                    .from('plans')
                    .select('*')
                    .eq('project_id', projectId);

                setPlans(plansData || []);

                const planIds = plansData?.map((p: any) => p.id) || [];

                if (planIds.length > 0) {
                    const { data: placements } = await supabase
                        .from('photo_placements')
                        .select('photo_id')
                        .in('plan_id', planIds);

                    const placedIds = new Set(placements?.map((p: any) => p.photo_id) || []);
                    setPlacedPhotoIds(placedIds);
                } else {
                    setPlacedPhotoIds(new Set());
                }

            } catch (err: any) {
                console.error('Error fetching data:', err);
                if (!err.message?.includes('Method Not Allowed')) {
                    setError(err.message || 'Failed to load data');
                }
                setPhotos([]);
                setPlacedPhotoIds(new Set());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    // Auto Place Handler (Single)
    const handleAutoPlace = async (photoId: string) => {
        try {
            // Find active plan or fallback to first
            const activePlan = plans.find(p => p.is_active) || plans[0];

            if (!activePlan) {
                setToast({ message: "No floor plan found to place photo on.", type: "error" });
                return;
            }

            // Generate placement
            const { generateRandomPlacement } = await import("@/lib/placement-utils");
            const { x, y } = generateRandomPlacement(activePlan.width, activePlan.height);

            // Save via API
            const { savePhotoPlacement } = await import("@/lib/api");

            await savePhotoPlacement({
                plan_id: activePlan.id,
                photo_id: photoId,
                x,
                y,
                placement_method: 'gps_suggested'
            });

            // Update local state
            setPlacedPhotoIds(prev => new Set([...prev, photoId]));
            setToast({ message: "Photo auto-placed on plan!", type: "success" });

        } catch (err: any) {
            console.error("Auto place error:", err);
            setToast({ message: "Failed to auto-place photo", type: "error" });
        }
    };

    // Bulk Auto Place Handler
    const handleBulkAutoPlace = async () => {
        if (selectedPhotoIds.size === 0) return;

        const activePlan = plans.find(p => p.is_active) || plans[0];
        if (!activePlan) {
            setToast({ message: "No floor plan found to place photos on.", type: "error" });
            return;
        }

        setIsAutoPlacing(true);
        try {
            const ids = Array.from(selectedPhotoIds);
            const { generateRandomPlacement } = await import("@/lib/placement-utils");
            const { savePhotoPlacement } = await import("@/lib/api");

            // Process in parallel
            const promises = ids.map(async (photoId) => {
                const { x, y } = generateRandomPlacement(activePlan.width, activePlan.height);
                return savePhotoPlacement({
                    plan_id: activePlan.id,
                    photo_id: photoId,
                    x,
                    y,
                    placement_method: 'gps_suggested'
                });
            });

            await Promise.all(promises);

            // Update state
            setPlacedPhotoIds(prev => new Set([...prev, ...ids]));
            setToast({ message: `Successfully auto-placed ${ids.length} photos!`, type: "success" });

            // Output selection mode
            setSelectedPhotoIds(new Set());
            setSelectionMode(false);

        } catch (err: any) {
            console.error("Bulk auto place error:", err);
            setToast({ message: "Failed to auto-place photos", type: "error" });
        } finally {
            setIsAutoPlacing(false);
        }
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        // Validate file types
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const selectedFiles = Array.from(files);

        const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            setError('Some files were skipped. Only valid image files (JPG, PNG, WebP) are allowed.');
        }

        const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
        if (validFiles.length === 0) return;

        try {
            setUploading(true);
            setError("");
            setUploadProgress(`Uploading ${validFiles.length} photos...`);

            // Upload files in parallel
            const uploadPromises = validFiles.map(file => uploadPhoto(projectId, file));
            const newPhotos = await Promise.all(uploadPromises);

            // Add new photos to the list
            setPhotos(prev => [...newPhotos, ...prev]);
            setUploadProgress("");
            setToast({ message: `${newPhotos.length} photo(s) uploaded successfully`, type: 'success' });
        } catch (err: any) {
            console.error('Error uploading photos:', err);
            setError(err.message || 'Failed to upload some photos');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Selection Handlers
    const toggleSelect = (photoId: string) => {
        const newSelected = new Set(selectedPhotoIds);
        if (newSelected.has(photoId)) {
            newSelected.delete(photoId);
        } else {
            newSelected.add(photoId);
        }
        setSelectedPhotoIds(newSelected);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        if (selectionMode) {
            // Clear selection when exiting mode
            setSelectedPhotoIds(new Set());
        }
    };

    const confirmDelete = async () => {
        if (selectedPhotoIds.size === 0) return;

        // Constraint: Must keep at least 1 photo
        if (photos.length - selectedPhotoIds.size < 1) {
            setToast({ message: "You must keep at least one photo in the project.", type: 'error' });
            setShowDeleteModal(false);
            return;
        }

        setIsDeleting(true);
        try {
            const idsToDelete = Array.from(selectedPhotoIds);
            await deletePhotos(idsToDelete);

            // Update local state
            setPhotos(prev => prev.filter(p => !selectedPhotoIds.has(p.id)));

            // Also update placed count if we deleted any placed photos
            setPlacedPhotoIds(prev => {
                const newPlaced = new Set(prev);
                idsToDelete.forEach(id => newPlaced.delete(id));
                return newPlaced;
            });

            setToast({ message: `${idsToDelete.length} photo(s) deleted successfully`, type: 'success' });
            // Reset selection
            setSelectedPhotoIds(new Set());
            setSelectionMode(false);
            setShowDeleteModal(false);
        } catch (err: any) {
            console.error('Error deleting photos:', err);
            setToast({ message: 'Failed to delete photos', type: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter logic
    const filteredPhotos = photos.filter(photo => {
        const isPlaced = placedPhotoIds.has(photo.id);
        const placementStatus = isPlaced ? 'placed' : 'unplaced';

        if (filter === 'all') return true;
        return placementStatus === filter;
    });

    const placedCount = photos.filter(p => placedPhotoIds.has(p.id)).length;
    const unplacedCount = photos.filter(p => !placedPhotoIds.has(p.id)).length;

    // Loading state
    if (loading) {
        return <PhotosTabSkeleton />;
    }

    // Adapt API photos to component props expected by PhotoList
    const adaptedPhotos: any[] = filteredPhotos.map(p => ({
        id: p.id,
        projectId: p.project_id,
        filename: `Photo ${p.id.substring(0, 8)}`,
        fileUrl: p.file_url,
        thumbnailUrl: p.file_url,
        uploadedAt: p.created_at,
        placementStatus: placedPhotoIds.has(p.id) ? 'placed' : 'unplaced',
        exif: {
            latitude: p.exif_lat,
            longitude: p.exif_lng,
            timestamp: p.exif_timestamp,
            cameraMake: undefined,
            cameraModel: undefined
        }
    }));

    if (photos.length === 0 && !uploading) {
        return (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos uploaded yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Upload geotagged photos to place them on your floor plan and create documentation.
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInputChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Reference Photos</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                            {photos.length} Total
                        </span>
                        <span className="text-sm text-gray-500">
                            • {placedCount} placed • {unplacedCount} unplaced
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {selectionMode ? (
                        <>
                            <button
                                onClick={handleBulkAutoPlace}
                                disabled={selectedPhotoIds.size === 0 || isAutoPlacing}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                {isAutoPlacing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Placing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        <span>Auto Place ({selectedPhotoIds.size})</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={selectedPhotoIds.size === 0}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Delete ({selectedPhotoIds.size})
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleSelectionMode}
                            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            Select
                        </button>
                    )}

                    {!selectionMode && (
                        <>
                            {/* Upload Button */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileInputChange}
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-sm shadow-sm disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Upload Photos'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filter Buttons - Segmented Control */}
            <div className="flex items-center border-b border-gray-200 pb-1">
                <div className="flex p-1 bg-gray-100/80 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        All Photos
                    </button>
                    <button
                        onClick={() => setFilter('placed')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'placed'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Placed
                    </button>
                    <button
                        onClick={() => setFilter('unplaced')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'unplaced'
                            ? 'bg-white text-amber-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Unplaced
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800">Error</h4>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Progress */}
            {uploadProgress && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-blue-900">{uploadProgress}</p>
                </div>
            )}


            {/* Photo List with Selection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <PhotoList
                    photos={adaptedPhotos}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onPhotoClick={(photo) => {
                        if (selectionMode) {
                            toggleSelect(photo.id);
                        } else {
                            // eslint-disable-next-line no-console
                            console.log('Photo clicked:', photo);
                            // TODO: Open photo lightbox
                        }
                    }}
                    showViewToggle={true}
                    selectedIds={selectedPhotoIds}
                    onToggleSelect={toggleSelect}
                    selectionMode={selectionMode}
                    onAutoPlace={handleAutoPlace}
                />
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={`Delete ${selectedPhotoIds.size} Photo${selectedPhotoIds.size !== 1 ? 's' : ''}?`}
                message={`Are you sure you want to delete ${selectedPhotoIds.size} photo${selectedPhotoIds.size !== 1 ? 's' : ''}?\n\nThis action cannot be undone.`}
                confirmText="Delete Photos"
                confirmStyle="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
