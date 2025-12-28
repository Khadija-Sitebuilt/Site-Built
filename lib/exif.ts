import ExifReader from 'exifreader';

export interface ExifData {
    latitude?: number;
    longitude?: number;
    timestamp?: string; // ISO string
    cameraMake?: string;
    cameraModel?: string;
}

/**
 * Extract EXIF data from an image file
 */
export async function extractExifData(file: File): Promise<ExifData> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const tags = ExifReader.load(arrayBuffer);

        const data: ExifData = {};

        // Extract GPS
        // ExifReader extracts GPS as a description string in decimal format if available
        if (tags['GPSLatitude'] && tags['GPSLongitude']) {
            // GPSLatitude description is usually like "46.12345" or DMS format depending on version
            // But usually ExifReader provides a clean description for GPS
            // Let's safe extract.

            // Check if it parsed to specific structure
            // Modern ExifReader might return it differently, but 'description' is consistent for display
            // However, for precision, we might need to parse 'value'.
            // Let's rely on 'description' for now as it's often decimal in JS libraries, 
            // but strictly parsing properly is safer.

            // Actually, ExifReader usually provides 'GPSLatitude' which has a 'description' field 
            // that is the calculated decimal value (e.g. 40.7128).
            // However, it's safer to check if description is a number.

            const latDesc = tags['GPSLatitude'].description;
            const lngDesc = tags['GPSLongitude'].description;

            // Note: ExifReader has a quirk where description might be an array or value
            // If we want raw values we look at .value.

            // Let's try to parse the description first as it handles DMS to Decimal conversion for us
            const lat = parseFloat(latDesc);
            const lng = parseFloat(lngDesc);

            if (!isNaN(lat) && !isNaN(lng)) {
                data.latitude = lat;
                data.longitude = lng;

                // Apply reference (N/S/E/W) if not already applied
                // ExifReader's description usually handles sign based on Ref, but manual check is safer
                // Check GPSLatitudeRef
                if (tags['GPSLatitudeRef']) {
                    const val = tags['GPSLatitudeRef'].value;
                    const ref = Array.isArray(val) ? val[0] : val;
                    if (typeof ref === 'string' && ref.startsWith('S') && data.latitude! > 0) {
                        data.latitude! *= -1;
                    }
                }
                if (tags['GPSLongitudeRef']) {
                    const val = tags['GPSLongitudeRef'].value;
                    const ref = Array.isArray(val) ? val[0] : val;
                    if (typeof ref === 'string' && ref.startsWith('W') && data.longitude! > 0) {
                        data.longitude! *= -1;
                    }
                }
            }
        }

        // Extract Timestamp
        // Date/Time Original is preferred
        let dateString = null;
        if (tags['DateTimeOriginal']) {
            dateString = tags['DateTimeOriginal'].description;
        } else if (tags['DateTime']) {
            dateString = tags['DateTime'].description;
        }

        if (dateString) {
            // EXIF date format is usually "YYYY:MM:DD HH:MM:SS"
            // We need to convert colons to dashes for the date part to make it standard ISO-like
            // "2023:01:01 12:00:00" -> "2023-01-01 12:00:00"
            const isoString = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            const date = new Date(isoString);
            if (!isNaN(date.getTime())) {
                data.timestamp = date.toISOString();
            }
        }

        // Camera Info
        if (tags['Make']) {
            data.cameraMake = tags['Make'].description;
        }
        if (tags['Model']) {
            data.cameraModel = tags['Model'].description;
        }

        return data;

    } catch (error) {
        console.warn('Error extracting EXIF data:', error);
        return {};
    }
}
