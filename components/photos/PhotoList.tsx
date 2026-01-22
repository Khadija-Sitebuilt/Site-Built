"use client";

import { LayoutGrid, List } from "lucide-react";
import { Photo } from "@/lib/mockData";
import PhotoCard from "./PhotoCard";

interface PhotoListProps {
    photos: Photo[];
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
    onPhotoClick?: (photo: Photo) => void;
    showViewToggle?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (photoId: string) => void;
    selectionMode?: boolean;
    onAutoPlace?: (photoId: string) => void; // New prop
}

export default function PhotoList({
    photos,
    viewMode = 'grid',
    onViewModeChange,
    onPhotoClick,
    showViewToggle = true,
    selectedIds,
    onToggleSelect,
    selectionMode = false,
    onAutoPlace
}: PhotoListProps) {

    if (photos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No photos found
            </div>
        );
    }

    return (
        <div>
            {/* View Mode Toggle */}
            {showViewToggle && onViewModeChange && (
                <div className="flex items-center justify-end mb-4">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Photos Display */}
            <div className={
                viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-3'
            }>
                {photos.map((photo) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        viewMode={viewMode}
                        onClick={() => onPhotoClick?.(photo)}
                        selected={selectedIds?.has(photo.id)}
                        onToggleSelect={() => onToggleSelect?.(photo.id)}
                        selectionMode={selectionMode}
                        onAutoPlace={onAutoPlace}
                    />
                ))}
            </div>
        </div>
    );
}
