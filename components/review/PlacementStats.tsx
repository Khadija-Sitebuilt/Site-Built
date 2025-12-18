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
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Placement Progress</h3>
                    <p className="text-xs text-gray-500">
                        {placed} of {total} photos placed
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Legend / Details */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-gray-600 font-medium">
                        {placed} Placed
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-gray-600 font-medium">
                        {unplaced} Unplaced
                    </span>
                </div>
            </div>
        </div>
    );
}
