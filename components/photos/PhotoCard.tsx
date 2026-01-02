"use client";

import { Calendar, MapPin, Camera, Wand2 } from "lucide-react";
import { Photo } from "@/lib/mockData";

interface PhotoCardProps {
    photo: Photo;
    viewMode: 'grid' | 'list';
    onClick?: () => void;
    selected?: boolean;
    onToggleSelect?: () => void;
    selectionMode?: boolean;
    onAutoPlace?: (photoId: string) => void;
}

export default function PhotoCard({ photo, viewMode, onClick, selected, onToggleSelect, selectionMode, onAutoPlace }: PhotoCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect?.();
    };

    const handleAutoPlaceClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAutoPlace?.(photo.id);
    };

    if (viewMode === 'list') {
        // List View Layout
        return (
            <div
                className={`flex items-center gap-4 p-4 bg-white rounded-lg border transition-shadow ${selected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:shadow-md'
                    }`}
                onClick={selectionMode ? onToggleSelect : onClick}
            >
                {/* Checkbox (Only visible in selection mode) */}
                {onToggleSelect && selectionMode && (
                    <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                            }`}>
                            {selected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                )}

                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
                    {photo.thumbnailUrl ? (
                        <img
                            src={photo.thumbnailUrl}
                            alt={photo.filename}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-300" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${photo.placementStatus === 'placed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}
                        >
                            {photo.placementStatus === 'placed' ? 'Placed' : 'Unplaced'}
                        </span>
                    </div>

                    {/* Auto-Place Action (List View) */}
                    {photo.placementStatus !== 'placed' && onAutoPlace && !selectionMode && (
                        <button
                            onClick={handleAutoPlaceClick}
                            className="absolute top-2 left-2 p-2 bg-white/90 rounded-full hover:bg-blue-50 text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Auto-place on plan (GPS Suggested)"
                        >
                            <Wand2 size={18} />
                        </button>
                    )}
                </div>

                {/* Photo Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{photo.filename}</h4>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        {/* Timestamp */}
                        {photo.exif.timestamp && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{formatDate(photo.exif.timestamp)}</span>
                            </div>
                        )}

                        {/* GPS Coordinates */}
                        {photo.exif.latitude && photo.exif.longitude && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="font-mono text-xs">
                                    {photo.exif.latitude.toFixed(6)}, {photo.exif.longitude.toFixed(6)}
                                </span>
                            </div>
                        )}

                        {/* Camera Info */}
                        {photo.exif.cameraMake && photo.exif.cameraModel && (
                            <div className="flex items-center gap-1.5">
                                <Camera className="w-4 h-4 flex-shrink-0" />
                                <span>{photo.exif.cameraMake} {photo.exif.cameraModel}</span>
                            </div>
                        )}
                    </div>

                    {/* No GPS Warning */}
                    {!photo.exif.latitude && !photo.exif.longitude && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 inline-block">
                            No GPS - Use Auto Place
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Grid View Layout
    return (
        <div
            className={`group relative bg-white rounded-xl border overflow-hidden transition-shadow ${selected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 hover:shadow-md'
                }`}
            onClick={selectionMode ? onToggleSelect : onClick}
        >
            {/* Selection Overlay (Checkbox - Only visible in selection mode) */}
            {onToggleSelect && selectionMode && (
                <div
                    className="absolute top-3 left-3 z-10"
                    onClick={handleCheckboxClick}
                >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                        }`}>
                        {selected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
            )}

            {/* Photo Thumbnail */}
            <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {photo.thumbnailUrl ? (
                    <img
                        src={photo.thumbnailUrl}
                        alt={photo.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <Camera className="w-16 h-16 text-gray-300" />
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${photo.placementStatus === 'placed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {photo.placementStatus === 'placed' ? 'Placed' : 'Unplaced'}
                    </span>
                </div>

                {/* Auto-Place Action (Grid View) - Top Left */}
                {photo.placementStatus !== 'placed' && onAutoPlace && !selectionMode && (
                    <div className="absolute top-3 left-3 z-10">
                        <button
                            onClick={handleAutoPlaceClick}
                            className="bg-white/90 p-2 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
                            title="Auto-place on plan (GPS Suggested)"
                        >
                            <Wand2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Photo Info */}
            <div className={`p-4 ${selected ? 'bg-blue-50' : ''}`}>
                <h3 className="font-semibold text-gray-900 mb-3 truncate">{photo.filename}</h3>

                <div className="space-y-2 text-sm">
                    {/* Timestamp */}
                    {photo.exif.timestamp && (
                        <div className="flex items-start gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{formatDate(photo.exif.timestamp)}</span>
                        </div>
                    )}

                    {/* GPS Coordinates */}
                    {photo.exif.latitude && photo.exif.longitude && (
                        <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="font-mono text-xs line-clamp-1">
                                {photo.exif.latitude.toFixed(6)}, {photo.exif.longitude.toFixed(6)}
                            </span>
                        </div>
                    )}

                    {/* Camera Info */}
                    {photo.exif.cameraMake && photo.exif.cameraModel && (
                        <div className="flex items-start gap-2 text-gray-600">
                            <Camera className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{photo.exif.cameraMake} {photo.exif.cameraModel}</span>
                        </div>
                    )}

                    {/* No EXIF Data Warning */}
                    {!photo.exif.latitude && !photo.exif.longitude && (
                        <div className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 inline-flex items-center gap-1">
                            <span>No GPS data available</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
