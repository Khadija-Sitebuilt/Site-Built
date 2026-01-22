export default function ReviewTabSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Bar Skeleton */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Split View Skeleton */}
            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-[calc(100vh-350px)] min-h-[600px]">
                {/* Left: Plan Viewer Skeleton */}
                <div className="flex-1 bg-gray-50 p-6 relative relative border-r border-gray-200">
                    <div className="absolute top-6 left-6 right-6 flex justify-between">
                        <div className="h-10 w-48 bg-white rounded-lg animate-pulse" />
                        <div className="h-10 w-32 bg-white rounded-lg animate-pulse" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-24 rounded-full bg-gray-200/50 animate-pulse" />
                    </div>
                </div>

                {/* Right: Sidebar Skeleton */}
                <div className="w-80 flex-shrink-0 bg-white flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="h-8 w-full bg-gray-100 rounded-lg animate-pulse" />
                    </div>

                    {/* Sidebar List */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-20 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                                    <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
