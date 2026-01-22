export default function ProjectDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Header Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-4 w-full">
                            <div className="flex items-center gap-2">
                                {/* Back Button Skeleton */}
                                <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
                            </div>

                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    {/* Title Skeleton */}
                                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                                    {/* Location Skeleton */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                                {/* Status Badge Skeleton */}
                                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex overflow-x-auto gap-2 border-b border-gray-200 mb-6 pb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-4 py-2 min-w-[100px]">
                            <div className="h-5 w-full bg-gray-200 rounded animate-pulse relative">
                                {i !== 1 && i !== 4 && i !== 5 && (
                                    <div className="absolute -right-2 -top-2 w-5 h-5 bg-gray-200 rounded-full border-2 border-white" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
                    <div className="space-y-6">
                        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                <div className="h-20 w-full max-w-2xl bg-gray-200 rounded animate-pulse" />
                            </div>

                            <div className="grid grid-cols-2 gap-8 max-w-md">
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="h-16 w-full bg-blue-50 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
