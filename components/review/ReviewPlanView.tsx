"use client";

import { useState, useEffect } from "react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import PlanViewer from "@/components/project/PlanViewer";
import { ChevronDown } from "lucide-react";

// Extend Mock Plan to include DB flag
type ReviewPlan = Plan & { is_active?: boolean };

interface ReviewPlanViewProps {
    plans: ReviewPlan[];
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
    // Initialize active plan based on is_active flag from DB
    const [activePlanId, setActivePlanId] = useState<string>("");

    useEffect(() => {
        if (plans.length > 0) {
            // Find the plan marked as active in the DB
            const dbActivePlan = plans.find(p => p.is_active);

            // Default to DB active plan, OR the newest plan (first in sorted array)
            // Note: Plans are usually sorted DESC by created_at, so plans[0] is newest.
            const defaultId = dbActivePlan?.id || plans[0].id;

            setActivePlanId(defaultId);
        }
    }, [plans]);

    const handlePlanChange = (planId: string) => {
        // Just change the local view, don't update global active state here
        // (Global state is updated in PlansTab)
        setActivePlanId(planId);
    };

    const activePlan = plans.find(p => p.id === activePlanId);

    if (!activePlan) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                {plans.length === 0 ? "No floor plans available" : "Loading plan..."}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
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
