import { Image as ImageIcon } from "lucide-react";

export default function PhotosTabSkeleton() {
    return (
        <div>
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Filter Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-8 w-24 bg-gray-900/10 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center border border-gray-300">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                ))}
            </div>
        </div>
    );
}
