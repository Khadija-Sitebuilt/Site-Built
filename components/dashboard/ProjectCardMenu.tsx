"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Trash2, Copy, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardMenuProps {
    projectId: string;
    projectName?: string;
    onDelete?: () => void;
    onDuplicate?: () => void;
}

export default function ProjectCardMenu({ projectId, projectName, onDelete, onDuplicate }: ProjectCardMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Auto-hide toast
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleShare = async () => {
        const link = `${window.location.origin}/projects/${projectId}`;
        try {
            await navigator.clipboard.writeText(link);
            setShowToast(true);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="More options"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                    ✓ Link copied to clipboard!
                </div>
            )}

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                            router.push(`/projects/${projectId}`);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                    >
                        <Eye className="w-4 h-4 text-gray-500" />
                        View Project
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                            handleShare();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                    >
                        <Share2 className="w-4 h-4 text-gray-500" />
                        Share Project
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                            if (onDuplicate) onDuplicate();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                    >
                        <Copy className="w-4 h-4 text-gray-500" />
                        Duplicate Project
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                            if (onDelete) onDelete();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Project
                    </button>
                </div>
            )}
        </div>
    );
}
