"use client";

import { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Move } from "lucide-react";
import { Plan, Photo, PinPosition } from "@/lib/mockData";
import PinMarker from "./PinMarker";

interface PlanViewerProps {
    plan: Plan;
    photos?: Photo[]; // Photos to display as pins
    selectedPhotoId?: string | null; // Currently selected photo
    onPhotoSelect?: (photoId: string) => void; // Callback when pin is clicked
    onPinPlace?: (photoId: string, position: PinPosition) => void; // Callback when placing a pin
    onClose?: () => void;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    enablePlacement?: boolean; // Enable click-to-place mode
}

export default function PlanViewer({
    plan,
    photos = [],
    selectedPhotoId = null,
    onPhotoSelect,
    onPinPlace,
    onClose,
    isFullscreen = false,
    onToggleFullscreen,
    enablePlacement = false
}: PlanViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activePinRef = useRef<HTMLDivElement>(null);

    // Visual state (refs for performance)
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
    const dragPinState = useRef<{ isDragging: boolean; pinId: string | null; startX: number; startY: number }>({
        isDragging: false, pinId: null, startX: 0, startY: 0
    });

    // React State for rendering
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Committed position
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

    // Tracks which pin is currently being dragged (to hide original or render active version)
    const [draggingPinId, setDraggingPinId] = useState<string | null>(null);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
    const [hasChanges, setHasChanges] = useState(false);

    const minZoom = 0.5;
    const maxZoom = 3;
    const zoomStep = 0.2;

    // Sync local photos
    useEffect(() => {
        if (!isEditing) {
            setLocalPhotos(photos);
        }
    }, [photos, isEditing]);

    const handleStartEditing = () => {
        setIsEditing(true);
        setLocalPhotos(photos);
        setHasChanges(false);
    };

    const handleCancelEditing = () => {
        if (hasChanges && !window.confirm("Discard unsaved changes?")) return;
        setIsEditing(false);
        setLocalPhotos(photos);
        setHasChanges(false);
        setDraggingPinId(null);
    };

    const handleSaveChanges = () => {
        localPhotos.forEach(localPhoto => {
            const originalPhoto = photos.find(p => p.id === localPhoto.id);
            if (originalPhoto && JSON.stringify(localPhoto.pinPosition) !== JSON.stringify(originalPhoto.pinPosition)) {
                if (localPhoto.pinPosition && onPinPlace) {
                    onPinPlace(localPhoto.id, localPhoto.pinPosition);
                }
            }
        });
        setIsEditing(false);
        setHasChanges(false);
        setDraggingPinId(null);
    };

    const handleClose = () => {
        if (hasChanges && !window.confirm("You have unsaved changes. Are you sure you want to close?")) return;
        onClose?.();
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));
    const handleResetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        panState.current = { isPanning: false, startX: 0, startY: 0, currentX: 0, currentY: 0 };
        if (imageContainerRef.current) {
            imageContainerRef.current.style.transform = `translate(0px, 0px) scale(1)`;
        }
    };

    // Update DOM transform when Zoom/Position React state changes (initial render or button click)
    useEffect(() => {
        if (imageContainerRef.current) {
            imageContainerRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${zoom})`;
            // Update ref to match state
            panState.current.currentX = position.x;
            panState.current.currentY = position.y;
        }
    }, [zoom, position]);

    // --- INTERACTION HANDLERS ---

    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevent panning if clicking a button or placing a pin
        if (dragPinState.current.isDragging) return;

        // Start Panning
        panState.current.isPanning = true;
        panState.current.startX = e.clientX - panState.current.currentX;
        panState.current.startY = e.clientY - panState.current.currentY;

        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // 1. Handle Panning
        if (panState.current.isPanning && imageContainerRef.current) {
            const newX = e.clientX - panState.current.startX;
            const newY = e.clientY - panState.current.startY;

            // Direct DOM update (no re-render)
            imageContainerRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${zoom})`;

            // Update ref
            panState.current.currentX = newX;
            panState.current.currentY = newY;
            return;
        }

        // 2. Handle Pin Dragging
        if (dragPinState.current.isDragging && activePinRef.current && imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();

            // Calculate relative position within the image
            const xVal = ((e.clientX - rect.left) / rect.width) * 100;
            const yVal = ((e.clientY - rect.top) / rect.height) * 100;

            // Clamp 0-100
            const x = Math.max(0, Math.min(100, xVal));
            const y = Math.max(0, Math.min(100, yVal));

            // Direct DOM update of the Active Pin
            activePinRef.current.style.left = `${x}%`;
            activePinRef.current.style.top = `${y}%`;
        }
    };

    const handleMouseUp = () => {
        // End Panning
        if (panState.current.isPanning) {
            panState.current.isPanning = false;
            // Sync React State
            setPosition({ x: panState.current.currentX, y: panState.current.currentY });
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
        }

        // End Pin Dragging
        if (dragPinState.current.isDragging && dragPinState.current.pinId) {
            const pinId = dragPinState.current.pinId;
            const element = activePinRef.current;

            if (element && imageRef.current) {
                // Read final percentages from style or recalculate logic?
                // Safer to recalculate based on last mouse event, but we don't have event here easily.
                // We rely on the element's style which we set in mouseMove.
                const finalLeft = parseFloat(element.style.left || '0');
                const finalTop = parseFloat(element.style.top || '0');

                setLocalPhotos(prev => prev.map(p =>
                    p.id === pinId
                        ? { ...p, pinPosition: { x: finalLeft, y: finalTop, planId: plan.id } }
                        : p
                ));
                setHasChanges(true);
            }

            dragPinState.current = { isDragging: false, pinId: null, startX: 0, startY: 0 };
            setDraggingPinId(null); // Re-render to show original pin again
        }
    };

    // Pin Drag Start (Called by PinMarker onMouseDown)
    const handlePinMouseDown = (e: React.MouseEvent, photoId: string) => {
        if (!isEditing) return;
        e.stopPropagation(); // Stop pan
        e.preventDefault(); // Stop text selection

        setDraggingPinId(photoId); // Hide original, show ActivePin
        dragPinState.current = { isDragging: true, pinId: photoId, startX: e.clientX, startY: e.clientY };
    };

    // Click to Place (Context sensitive)
    const handlePlanClick = (e: React.MouseEvent) => {
        if (!enablePlacement || !isEditing || !imageRef.current || panState.current.isPanning || zoom > 1) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        const targetPhoto = localPhotos.find(p => p.id === selectedPhotoId && p.placementStatus === 'unplaced');
        if (targetPhoto) {
            setLocalPhotos(prev => prev.map(p =>
                p.id === targetPhoto.id
                    ? { ...p, pinPosition: { x, y, planId: plan.id }, placementStatus: 'placed' }
                    : p
            ));
            setHasChanges(true);
        }
    };

    // Find the photo currently being dragged to render the "Active Pin"
    const activeDragPhoto = draggingPinId ? localPhotos.find(p => p.id === draggingPinId) : null;
    const photosWithPins = localPhotos.filter(p =>
        p.pinPosition &&
        p.pinPosition.planId === plan.id &&
        p.placementStatus === 'placed' &&
        p.id !== draggingPinId // Hide the one being dragged
    );

    return (
        <div className="flex flex-col h-full bg-gray-900" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {/* Header Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 select-none">
                <div className="text-white flex items-center gap-4">
                    <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-xs text-gray-400">{plan.width} × {plan.height} px</p>
                    </div>
                    {enablePlacement && (
                        <>
                            <div className="h-6 w-px bg-gray-600 mx-2"></div>
                            {!isEditing ? (
                                <button onClick={handleStartEditing} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium">Change Pins Location</button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={handleSaveChanges} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1"><span>Save</span></button>
                                    <button onClick={handleCancelEditing} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition-colors font-medium">Cancel</button>
                                    {hasChanges && <span className="text-xs text-amber-400 italic ml-1">Unsaved changes</span>}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
                        <button onClick={handleZoomOut} disabled={zoom <= minZoom} className="p-2 text-white hover:bg-gray-600 rounded disabled:opacity-30 transition-colors"><ZoomOut className="w-4 h-4" /></button>
                        <span className="px-3 text-sm text-white font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} disabled={zoom >= maxZoom} className="p-2 text-white hover:bg-gray-600 rounded disabled:opacity-30 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                    </div>
                    <button onClick={handleResetZoom} className="p-2 text-white hover:bg-gray-700 rounded transition-colors"><Move className="w-4 h-4" /></button>
                    {onToggleFullscreen && <button onClick={onToggleFullscreen} className="p-2 text-white hover:bg-gray-700 rounded transition-colors">{isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>}
                    {onClose && <button onClick={handleClose} className="p-2 text-white hover:bg-gray-700 rounded transition-colors ml-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                </div>
            </div>

            {/* Plan Viewer Body */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden relative bg-gray-900 flex items-center justify-center cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!enablePlacement) return;
                    e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    if (!enablePlacement || !imageRef.current || !onPinPlace) return;
                    const photoId = e.dataTransfer.getData('photoId');
                    if (!photoId) return;
                    const rect = imageRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                    onPinPlace(photoId, { x, y, planId: plan.id });
                }}
            >
                <div
                    ref={imageContainerRef}
                    className="relative transition-transform duration-75 ease-linear will-change-transform" // Optimized for smooth transforms
                    style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
                >
                    <img
                        ref={imageRef}
                        src={plan.fileUrl}
                        alt={plan.name}
                        onClick={handlePlanClick}
                        onLoad={() => {
                            setImageLoaded(true);
                            setImageError(null);
                        }}
                        onError={() => setImageError('Failed to load plan. The file may be invalid or not an image.')}
                        className="max-w-full max-h-full object-contain select-none"
                        draggable={false}
                    />

                    {/* Render Static Pins */}
                    {imageLoaded && photosWithPins.map((photo, index) => (
                        <div
                            key={photo.id}
                            className="absolute pointer-events-auto"
                            style={{
                                left: `${photo.pinPosition!.x}%`,
                                top: `${photo.pinPosition!.y}%`,
                                pointerEvents: isEditing ? 'auto' : 'none',
                            }}
                        >
                            <PinMarker
                                photo={photo}
                                number={index + 1}
                                isSelected={photo.id === selectedPhotoId}
                                isHovered={photo.id === hoveredPinId}
                                onClick={() => onPhotoSelect?.(photo.id)}
                                onDragStart={(e) => handlePinMouseDown(e, photo.id)}
                            />
                        </div>
                    ))}

                    {/* Render Active Dragging Pin (Smooth) */}
                    {dragPinState.current.isDragging && activeDragPhoto && activeDragPhoto.pinPosition && (
                        <div
                            ref={activePinRef}
                            className="absolute pointer-events-none z-50 will-change-transform" // High z-index, no pointer events for itself
                            style={{
                                left: `${activeDragPhoto.pinPosition.x}%`,
                                top: `${activeDragPhoto.pinPosition.y}%`,
                            }}
                        >
                            <PinMarker
                                photo={activeDragPhoto}
                                number={0} // Doesn't matter for drag
                                isSelected={true}
                                isHovered={true}
                            />
                        </div>
                    )}
                </div>

                {imageError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Unable to Load Plan</h3>
                            <p className="text-xs text-gray-600 max-w-xs">{imageError}</p>
                            <p className="text-xs text-gray-500 mt-3">Please ensure the file is a valid PDF and try uploading again.</p>
                        </div>
                    </div>
                ) : !imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
