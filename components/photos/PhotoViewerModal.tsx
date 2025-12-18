"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Photo } from "@/lib/mockData";
import PhotoViewer from "./PhotoViewer";

interface PhotoViewerModalProps {
    photo: Photo | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PhotoViewerModal({ photo, isOpen, onClose }: PhotoViewerModalProps) {
    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !photo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            >
                <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="w-full h-full p-4 md:p-8">
                <PhotoViewer photo={photo} onClose={onClose} />
            </div>
        </div>
    );
}
