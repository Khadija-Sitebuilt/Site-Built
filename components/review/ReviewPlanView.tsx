"use client";

import { useState } from "react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import PlanViewer from "@/components/project/PlanViewer";
import { ChevronDown } from "lucide-react";

interface ReviewPlanViewProps {
    plans: Plan[];
    photos: Photo[];
    selectedPhotoId: string | null;
    onPhotoSelect: (photoId: string) => void;
    onPinPlace: (photoId: string, position: PinPosition) => void;
}

export default function ReviewPlanView({
    plans,
    photos,
    selectedPhotoId,
    onPhotoSelect,
    onPinPlace
}: ReviewPlanViewProps) {
    const [activePlanId, setActivePlanId] = useState<string>(plans[0]?.id || "");
    const activePlan = plans.find(p => p.id === activePlanId);

    if (!activePlan) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                No floor plans available
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
            {/* Plan Selector (if multiple) */}
            {plans.length > 1 && (
                <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center">
                    <label className="text-sm text-gray-600 mr-2">Floor Plan:</label>
                    <div className="relative">
                        <select
                            value={activePlanId}
                            onChange={(e) => setActivePlanId(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8"
                        >
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Plan Viewer */}
            <div className="flex-1 relative">
                <PlanViewer
                    plan={activePlan}
                    photos={photos}
                    selectedPhotoId={selectedPhotoId}
                    onPhotoSelect={onPhotoSelect}
                    onPinPlace={onPinPlace}
                    enablePlacement={true} // Allow placement in review mode
                />
            </div>
        </div>
    );
}
