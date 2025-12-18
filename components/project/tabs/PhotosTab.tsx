"use client";

import { useState } from "react";
import { Image as ImageIcon, Filter } from "lucide-react";
import { Photo } from "@/lib/mockData";
import Link from "next/link";
import PhotoList from "@/components/photos/PhotoList";

interface PhotosTabProps {
    photos: Photo[];
    projectId: string;
}

export default function PhotosTab({ photos, projectId }: PhotosTabProps) {
    const [filter, setFilter] = useState<'all' | 'placed' | 'unplaced'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredPhotos = photos.filter(photo => {
        if (filter === 'all') return true;
        return photo.placementStatus === filter;
    });

    const placedCount = photos.filter(p => p.placementStatus === 'placed').length;
    const unplacedCount = photos.filter(p => p.placementStatus === 'unplaced').length;

    const handlePhotoClick = (photo: Photo) => {
        // Future: Open photo viewer or detail modal
        console.log('Photo clicked:', photo);
    };

    if (photos.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos uploaded yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload geotagged photos to place them on your floor plan and create documentation.
                </p>
                <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    <ImageIcon className="w-5 h-5" />
                    Upload Photos
                </Link>
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
                <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                    <ImageIcon className="w-4 h-4" />
                    Upload Photos
                </Link>
            </div>

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
                photos={filteredPhotos}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onPhotoClick={handlePhotoClick}
                showViewToggle={true}
            />
        </div>
    );
}
