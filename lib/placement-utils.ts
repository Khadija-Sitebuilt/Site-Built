/**
 * Generate random placement coordinates within bounds
 * Used for "GPS Suggested" auto-placement when no exact GPS data is available
 */
export function generateRandomPlacement(
    planWidth: number,
    planHeight: number,
    margin: number = 50 // pixels from edge, default to 50
): { x: number; y: number } {
    // Ensure we have valid dimensions
    if (!planWidth || !planHeight) {
        return { x: 0, y: 0 };
    }

    // Calculate safe bounds
    // If dims are too small for margin, use center
    // If dims are too small for margin, use center (50%)
    if (planWidth <= margin * 2 || planHeight <= margin * 2) {
        return {
            x: 50,
            y: 50
        };
    }

    // Generate random x,y within bounds with margin
    const xAbs = margin + Math.random() * (planWidth - 2 * margin);
    const yAbs = margin + Math.random() * (planHeight - 2 * margin);

    // Convert to percentages (0-100)
    const x = (xAbs / planWidth) * 100;
    const y = (yAbs / planHeight) * 100;

    return { x, y };
}
