"use client";

import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface PlacementStatsProps {
    total: number;
    placed: number;
    unplaced: number;
}

export default function PlacementStats({ total, placed, unplaced }: PlacementStatsProps) {
    // Avoid division by zero
    const percentage = total > 0 ? Math.round((placed / total) * 100) : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Placement Progress</h3>
                    <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Legend / Stats Grid */}
            <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-lg font-bold text-gray-900">{placed}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Placed</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-dashed" />
                        <span className="text-lg font-bold text-gray-900">{unplaced}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pending</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        <span className="text-lg font-bold text-gray-900">{total}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</span>
                </div>
            </div>
        </div>
    );
}
