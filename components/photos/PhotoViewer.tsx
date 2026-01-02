import { useState, useEffect, useRef } from "react";
import { Photo, Detection } from "@/lib/mockData";
import { generateStubDetections } from "@/lib/detection-utils";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PhotoViewerProps {
    photo: Photo;
    onClose?: () => void;
}

export default function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
    const [showDetections, setShowDetections] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imageDims, setImageDims] = useState<{ w: number, h: number } | null>(null);
    const [localDetections, setLocalDetections] = useState<Detection[]>(photo.detections || []);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });

    // Reset state when photo changes
    useEffect(() => {
        setLocalDetections(photo.detections || []);
        setImageDims(null);
        handleReset();
    }, [photo]);

    // Update DOM transform when Zoom/Position React state changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${zoom})`;
            // Sync ref state
            panState.current.currentX = position.x;
            panState.current.currentY = position.y;
        }
    }, [zoom, position]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        panState.current = { isPanning: false, startX: 0, startY: 0, currentX: 0, currentY: 0 };
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImageDims({ w: naturalWidth, h: naturalHeight });

        // Generate mock detections if none exist
        if ((!photo.detections || photo.detections.length === 0) && naturalWidth > 0) {
            const stubs = generateStubDetections(photo.id, naturalWidth, naturalHeight);
            setLocalDetections(stubs);
        }
    };

    // --- Interaction Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        panState.current.isPanning = true;
        panState.current.startX = e.clientX - panState.current.currentX;
        panState.current.startY = e.clientY - panState.current.currentY;

        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!panState.current.isPanning || !contentRef.current) return;

        const newX = e.clientX - panState.current.startX;
        const newY = e.clientY - panState.current.startY;

        // Direct DOM update for performance
        contentRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${zoom})`;

        // Update ref
        panState.current.currentX = newX;
        panState.current.currentY = newY;
    };

    const handleMouseUp = () => {
        if (panState.current.isPanning) {
            panState.current.isPanning = false;
            // Sync React State
            setPosition({ x: panState.current.currentX, y: panState.current.currentY });
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
        }
    };

    // Handle detection styles (converts pixels to % if needed)
    const getDetectionStyle = (bbox: [number, number, number, number]) => {
        let [x, y, w, h] = bbox;

        const isPixel = x > 1 || y > 1 || w > 1 || h > 1;

        if (isPixel) {
            if (!imageDims) return { display: 'none' };
            x = x / imageDims.w;
            y = y / imageDims.h;
            w = w / imageDims.w;
            h = h / imageDims.h;
        }

        return {
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            width: `${w * 100}%`,
            height: `${h * 100}%`,
        };
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4 select-none">
                <div>
                    <h2 className="text-lg font-semibold">{photo.filename}</h2>

                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-400 transition-colors">
                        <input
                            type="checkbox"
                            checked={showDetections}
                            onChange={(e) => setShowDetections(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        Show Detections
                    </label>
                    <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
                        <button onClick={handleReset} className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" title="Reset View"><RotateCcw size={18} /></button>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Image Container */}
            <div
                ref={containerRef}
                className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border border-gray-800"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    ref={contentRef}
                    className="relative transition-transform duration-75 ease-linear will-change-transform"
                    style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
                >
                    <img
                        src={photo.fileUrl}
                        alt={photo.filename}
                        className="max-h-[80vh] max-w-full object-contain pointer-events-none select-none"
                        onLoad={handleImageLoad}
                        draggable={false}
                    />

                    {/* Detection Overlays */}
                    {showDetections && localDetections.map(det => (
                        <div
                            key={det.id}
                            className="absolute border-2 border-yellow-400 bg-yellow-400/10 group cursor-help pointer-events-auto"
                            style={getDetectionStyle(det.bbox)}
                        >
                            <span className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                {det.label} ({Math.round(det.confidence * 100)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
