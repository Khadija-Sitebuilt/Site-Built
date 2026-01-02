import { FileText } from "lucide-react";

export default function PlansTabSkeleton() {
    return (
        <div>
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Thumbnail Skeleton */}
                        <div className="aspect-[4/3] bg-gray-200 animate-pulse flex items-center justify-center">
                            <FileText className="w-12 h-12 text-gray-300" />
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-4 space-y-3">
                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
