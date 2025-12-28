"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, X, Filter } from "lucide-react";
import { uploadPhoto, getPhotos, type Photo } from "@/lib/api";
import Link from "next/link";
import PhotoList from "@/components/photos/PhotoList";

interface PhotosTabProps {
    photos: any[]; // Legacy prop
    projectId: string;
}

export default function PhotosTab({ projectId }: PhotosTabProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [filter, setFilter] = useState<'all' | 'placed' | 'unplaced'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch photos on mount
    useEffect(() => {
        fetchPhotos();
    }, [projectId]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            setError("");
            const fetchedPhotos = await getPhotos(projectId);
            setPhotos(fetchedPhotos);
        } catch (err: any) {
            console.error('Error fetching photos:', err);
            // Don't show error for "Method Not Allowed" - backend endpoint might not exist yet
            if (!err.message?.includes('Method Not Allowed')) {
                setError(err.message || 'Failed to load photos');
            }
            setPhotos([]);
        } finally {
            setLoading(false);
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

    // Filter logic (currently basic since placement isn't fully implemented)
    const filteredPhotos = photos.filter(photo => {
        // Map API photo to internal structure with placementStatus
        // For now, assume unplaced until we have placement table integration
        const placementStatus = 'unplaced';

        if (filter === 'all') return true;
        return placementStatus === filter;
    });

    const placedCount = 0; // TODO: Implement placement counting
    const unplacedCount = photos.length;

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    // Adapt API photos to component props expected by PhotoList
    const adaptedPhotos: any[] = filteredPhotos.map(p => ({
        id: p.id,
        projectId: p.project_id,
        filename: `Photo ${p.id.substring(0, 8)}`,
        fileUrl: p.file_url,
        thumbnailUrl: p.file_url,
        uploadedAt: p.created_at,
        placementStatus: 'unplaced',
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
            <div className="text-center py-16">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="inline-block"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos uploaded yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : 'Upload Photos'}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Stats and Upload Button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Reference Photos</h2>
                    <p className="text-sm text-gray-600">
                        {photos.length} photo{photos.length !== 1 ? 's' : ''} • {placedCount} placed • {unplacedCount} unplaced
                    </p>
                </div>

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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 flex-1">{error}</p>
                    <button onClick={() => setError("")} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Progress */}
            {uploadProgress && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{uploadProgress}</p>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({photos.length})
                    </button>
                    <button
                        onClick={() => setFilter('placed')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'placed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Placed ({placedCount})
                    </button>
                    <button
                        onClick={() => setFilter('unplaced')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'unplaced'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Unplaced ({unplacedCount})
                    </button>
                </div>
            </div>

            {/* Photo List with View Toggle */}
            <PhotoList
                photos={adaptedPhotos}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onPhotoClick={(photo) => console.log('Photo clicked:', photo)}
                showViewToggle={true}
            />
        </div>
    );
}
