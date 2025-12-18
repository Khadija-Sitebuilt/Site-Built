"use client";

import { useState } from "react";
import { Photo, Detection } from "@/lib/mockData";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface PhotoViewerProps {
    photo: Photo;
    onClose?: () => void;
}

export default function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
    const [showDetections, setShowDetections] = useState(true);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));

    // Handle detection styles
    const getDetectionStyle = (box: Detection['boundingBox']) => ({
        left: `${box.x * 100}%`,
        top: `${box.y * 100}%`,
        width: `${box.width * 100}%`,
        height: `${box.height * 100}%`,
    });

    return (
        <div className="flex flex-col h-full bg-black text-white p-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold">{photo.filename}</h2>
                    <p className="text-sm text-gray-400">
                        {new Date(photo.uploadedAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showDetections}
                            onChange={(e) => setShowDetections(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        Show Detections
                    </label>
                    <div className="flex bg-gray-800 rounded-lg p-1">
                        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded"><ZoomOut size={18} /></button>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded"><ZoomIn size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                <div
                    className="relative transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <img
                        src={photo.fileUrl}
                        alt={photo.filename}
                        className="max-h-[80vh] max-w-full object-contain"
                    />

                    {/* Detection Overlays */}
                    {showDetections && photo.detections?.map(det => (
                        <div
                            key={det.id}
                            className="absolute border-2 border-yellow-400 bg-yellow-400/10 group cursor-help"
                            style={getDetectionStyle(det.boundingBox)}
                        >
                            <span className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {det.label} ({Math.round(det.confidence * 100)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
