import { FileText, MapPin, MoreVertical } from "lucide-react";

export default function ProjectCardSkeleton() {
    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Image Skeleton */}
            <div className="relative h-48 bg-gray-200 animate-pulse">
                {/* Status Badge Skeleton */}
                <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full" />

                {/* Menu Button Skeleton */}
                <div className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-300" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 space-y-2">
                        {/* Title Skeleton */}
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />

                        {/* Location Skeleton */}
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-300" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div className="h-2 w-1/3 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-300" />
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}
