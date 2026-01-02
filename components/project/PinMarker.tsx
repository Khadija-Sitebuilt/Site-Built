"use client";

import { useState } from "react";
import { Photo } from "@/lib/mockData";

interface PinMarkerProps {
    photo: Photo;
    number: number;
    isSelected?: boolean;
    isHovered?: boolean;
    onClick?: () => void;
    onDragStart?: (e: React.MouseEvent) => void;
    onDrag?: (e: React.MouseEvent) => void;
    onDragEnd?: (e: React.MouseEvent) => void;
}

export default function PinMarker({
    photo,
    number,
    isSelected = false,
    isHovered = false,
    onClick,
    onDragStart,
    onDrag,
    onDragEnd,
}: PinMarkerProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        onDragStart?.(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            onDrag?.(e);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isDragging) {
            setIsDragging(false);
            onDragEnd?.(e);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDragging) {
            onClick?.();
        }
    };

    // Determine colors based on placement
    // GPS Exact = Emerald (Green)
    // GPS Suggested = Blue
    // Manual = Amber (Orange)

    // Check placement method from pin position, or fallback to EXIF check for legacy/compatibility
    const placementMethod = photo.pinPosition?.placementMethod;
    const isGPSExact = placementMethod === 'gps_exact' || (!placementMethod && !!(photo.exif.latitude && photo.exif.longitude));
    const isGPSSuggested = placementMethod === 'gps_suggested';

    let colors;
    if (isGPSExact) {
        colors = {
            main: '#10B981', // emerald-500
            dark: '#059669', // emerald-600
            light: '#34D399', // emerald-400
            shadow: 'rgba(16, 185, 129, 0.4)'
        };
    } else if (isGPSSuggested) {
        colors = {
            main: '#3B82F6', // blue-500
            dark: '#2563EB', // blue-600
            light: '#60A5FA', // blue-400
            shadow: 'rgba(59, 130, 246, 0.4)'
        };
    } else {
        // Manual
        colors = {
            main: '#F59E0B', // amber-500
            dark: '#D97706', // amber-600
            light: '#FBBF24', // amber-400
            shadow: 'rgba(245, 158, 11, 0.4)'
        };
    }

    // Interaction states
    const isActive = isSelected || isHovered || isDragging;
    const scale = isActive ? 1.2 : 1;
    const zIndex = isActive ? 50 : 10;

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer select-none transition-all duration-300 ease-spring"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: zIndex,
                transform: `translate(-50%, -100%) scale(${scale})`,
                transformOrigin: 'bottom center'
            }}
        >
            <div className="relative group">
                {/* SVG Pin Design */}
                <svg
                    width="40"
                    height="48"
                    viewBox="0 0 40 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                >
                    <defs>
                        <linearGradient id={`grad-${photo.id}`} x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={colors.light} />
                            <stop offset="100%" stopColor={colors.dark} />
                        </linearGradient>
                        <filter id={`shadow-${photo.id}`} x="-4" y="30" width="48" height="24" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="4" />
                        </filter>
                    </defs>

                    {/* Pin Shape */}
                    <path
                        d="M20 0C8.954 0 0 8.954 0 20C0 34 20 48 20 48C20 48 40 34 40 20C40 8.954 31.046 0 20 0Z"
                        fill={`url(#grad-${photo.id})`}
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Inner Circle (White Background for Text) */}
                    <circle cx="20" cy="20" r="12" fill="white" />
                </svg>

                {/* Number Text (Overlay) */}
                <div className="absolute top-0 left-0 w-full pt-[10px] flex justify-center text-xs font-bold text-gray-900 pointer-events-none">
                    {number}
                </div>

                {/* Selection Ring (Pulse Effect) */}
                {isSelected && (
                    <div className="absolute -inset-1 rounded-full border-2 border-white animate-pulse opacity-50 pointer-events-none" style={{ borderColor: colors.light }}></div>
                )}

                {/* Tooltip */}
                {isHovered && !isDragging && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm border border-white/10">
                        <div className="font-semibold flex items-center gap-2">
                            {photo.filename}
                            {isGPSExact && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">GPS</span>}
                            {isGPSSuggested && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Auto</span>}
                        </div>
                        {photo.exif.timestamp && (
                            <div className="text-gray-400 text-[10px] mt-0.5">
                                {new Date(photo.exif.timestamp).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                        )}
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-gray-900/95" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
