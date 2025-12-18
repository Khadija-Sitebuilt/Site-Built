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

    // Determine pin color based on placement method
    const getPinColor = () => {
        if (photo.exif.latitude && photo.exif.longitude) {
            return 'bg-emerald-500'; // GPS-assisted placement
        }
        return 'bg-amber-500'; // Manual placement
    };

    const pinSize = isSelected || isHovered ? 'w-10 h-10' : 'w-8 h-8';
    const pinColor = getPinColor();

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer select-none"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
        >
            {/* Pin Body (Inverted Teardrop) */}
            <div className="relative flex flex-col items-center">
                {/* Circle with Number */}
                <div
                    className={`
            ${pinSize} ${pinColor}
            rounded-full flex items-center justify-center
            text-white font-bold text-sm
            shadow-lg
            transition-all duration-200
            ${isSelected ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
                >
                    {number}
                </div>

                {/* Pin Point */}
                <div
                    className={`
            w-0 h-0
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[8px] ${pinColor.replace('bg-', 'border-t-')}
            -mt-0.5
          `}
                />

                {/* Hover Tooltip */}
                {isHovered && !isDragging && (
                    <div className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
                        <div className="font-semibold">{photo.filename}</div>
                        {photo.exif.timestamp && (
                            <div className="text-gray-300 text-xs mt-1">
                                {new Date(photo.exif.timestamp).toLocaleString()}
                            </div>
                        )}
                        {/* Arrow pointing down */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
