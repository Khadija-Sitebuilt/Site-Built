import { Detection } from "./mockData";

/**
 * Generate random stub detections for a photo
 * Used to simulate AI detection results
 */
export function generateStubDetections(photoId: string, width: number, height: number, count: number = 3): Detection[] {
    const labels = ["pipe", "wire", "junction_box", "crack", "vent", "rebar", "conduit", "valve"];

    return Array.from({ length: count }).map((_, i) => {
        // Generate sensible random sizes (between 50 and 200px, but not larger than image)
        const targetW = Math.round(50 + Math.random() * 150);
        const targetH = Math.round(50 + Math.random() * 150);

        const w = Math.min(targetW, width);
        const h = Math.min(targetH, height);

        // Ensure coordinates are within bounds
        const x = Math.round(Math.random() * (width - w));
        const y = Math.round(Math.random() * (height - h));

        return {
            id: `stub-${Date.now()}-${i}`,
            photoId,
            label: labels[Math.floor(Math.random() * labels.length)],
            // Random confidence between 0.70 and 0.99
            confidence: parseFloat((0.7 + Math.random() * 0.29).toFixed(2)),
            // Return pixel values as requested: [x, y, w, h]
            bbox: [x, y, w, h]
        };
    });
}
