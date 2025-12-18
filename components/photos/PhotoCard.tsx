"use client";

import { Calendar, MapPin, Camera } from "lucide-react";
import { Photo } from "@/lib/mockData";

interface PhotoCardProps {
    photo: Photo;
    viewMode: 'grid' | 'list';
    onClick?: () => void;
}

export default function PhotoCard({ photo, viewMode, onClick }: PhotoCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (viewMode === 'list') {
        // List View Layout
        return (
            <div
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={onClick}
            >
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
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
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${photo.placementStatus === 'placed'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                        >
                            {photo.placementStatus === 'placed' ? 'Placed' : 'Unplaced'}
                        </span>
                    </div>
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
                            No GPS data available
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Grid View Layout
    return (
        <div
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
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
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${photo.placementStatus === 'placed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {photo.placementStatus === 'placed' ? 'Placed' : 'Unplaced'}
                    </span>
                </div>
            </div>

            {/* Photo Info */}
            <div className="p-4">
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
                        <div className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
                            No GPS data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
