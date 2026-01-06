"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, AlertCircle, Circle, Trash2 } from "lucide-react";
import { Photo } from "@/lib/mockData";
import PhotoCard from "@/components/photos/PhotoCard";

interface ReviewSidebarProps {
    photos: Photo[];
    selectedPhotoId: string | null;
    onPhotoSelect: (photoId: string) => void;
    onPinDelete?: (photoId: string) => void;
}

type FilterType = 'all' | 'placed' | 'unplaced';

export default function ReviewSidebar({ photos, selectedPhotoId, onPhotoSelect, onPinDelete }: ReviewSidebarProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState("");

    // Filter photos based on search text and filter type
    const filteredPhotos = photos.filter(photo => {
        const matchesSearch = photo.filename.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'placed' ? photo.placementStatus === 'placed' :
                    photo.placementStatus === 'unplaced';
        return matchesSearch && matchesFilter;
    });

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (filteredPhotos.length === 0) return;

            const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhotoId);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
                onPhotoSelect(filteredPhotos[nextIndex].id);
                // Optional: Scroll into view logic could go here
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
                onPhotoSelect(filteredPhotos[prevIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredPhotos, selectedPhotoId, onPhotoSelect]);

    return (
        <div className="flex flex-col h-full lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-gray-200 w-full lg:w-80 xl:w-96 flex-shrink-0 max-h-96 lg:max-h-none overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Photos ({filteredPhotos.length})</h3>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search photos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Filters - Segmented Control */}
                <div className="flex p-1 bg-gray-100/80 rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${filter === 'all'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('placed')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${filter === 'placed'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Placed
                    </button>
                    <button
                        onClick={() => setFilter('unplaced')}
                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${filter === 'unplaced'
                            ? 'bg-white text-amber-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Unplaced
                    </button>
                </div>
            </div>

            {/* Photo List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map(photo => (
                        <div
                            key={photo.id}
                            draggable={photo.placementStatus === 'unplaced'}
                            onDragStart={(e) => {
                                if (photo.placementStatus === 'unplaced') {
                                    e.dataTransfer.setData('photoId', photo.id);
                                    e.dataTransfer.effectAllowed = 'copy';
                                } else {
                                    e.preventDefault();
                                }
                            }}
                            className={`relative group cursor-pointer transition-all border-2 rounded-lg ${selectedPhotoId === photo.id
                                ? 'border-blue-500 ring-2 ring-blue-100'
                                : 'border-transparent hover:border-gray-200'
                                }`}
                            onClick={() => onPhotoSelect(photo.id)}
                        >
                            <PhotoCard
                                photo={photo}
                                viewMode="list"
                            />

                            {/* Delete Action for Placed Photos */}
                            {photo.placementStatus === 'placed' && onPinDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPinDelete(photo.id);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
                                    title="Remove pin"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No photos found matching your criteria
                    </div>
                )}
            </div>
        </div>
    );
}
