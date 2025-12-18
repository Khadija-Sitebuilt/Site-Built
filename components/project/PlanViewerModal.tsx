"use client";

import { useEffect } from "react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import PlanViewer from "./PlanViewer";

interface PlanViewerModalProps {
    plan: Plan | null;
    photos?: Photo[];
    isOpen: boolean;
    onClose: () => void;
    onPinPlace?: (photoId: string, position: PinPosition) => void;
    enablePlacement?: boolean;
}

export default function PlanViewerModal({ plan, photos = [], isOpen, onClose, onPinPlace, enablePlacement = false }: PlanViewerModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] m-4">
                <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <PlanViewer
                        plan={plan}
                        photos={photos}
                        onPinPlace={onPinPlace}
                        onClose={onClose}
                        isFullscreen={false}
                        enablePlacement={enablePlacement}
                    />
                </div>
            </div>
        </div>
    );
}
