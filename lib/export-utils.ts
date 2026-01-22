import { supabase } from "@/lib/supabase";
import { getProject } from "@/lib/api";

export type ExportResult = { success: true; html: string } | { success: false; error: string };

export const generateProjectReport = async (projectId: string): Promise<ExportResult> => {
    // Parallel Fetching: Project, Plans, Photos
    const [projectData, plansResult, photosResult] = await Promise.all([
        getProject(projectId).catch(() => ({ name: 'Project' })),
        supabase
            .from('plans')
            .select('id, width, height, file_url, is_active, created_at')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false }),
        supabase
            .from('photos')
            .select('*') // Need all fields for EXIF etc
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
    ]);

    const plans = plansResult.data || [];
    const photos = photosResult.data || [];

    // Get plan IDs to fetch placements
    const planIds = plans.map((p: any) => p.id);

    let placements: any[] = [];
    if (planIds.length > 0) {
        const { data } = await supabase
            .from('photo_placements')
            .select('*')
            .in('plan_id', planIds);
        placements = data || [];
    }

    const mainPlan = plans?.[0];
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Filter placements for the main plan
    const planPlacements = placements.filter((p: any) => p.plan_id === mainPlan?.id);

    // --- Strict Validation Rules ---
    // Return error objects instead of throwing
    if (!mainPlan) {
        return { success: false, error: "Cannot Export: This project has no floor plan." };
    }

    if (photos.length === 0) {
        return { success: false, error: "Cannot Export: This project has no photos yet." };
    }

    // Verify all photos are pinned
    const unpinnedPhotos = photos.filter((photo: any) =>
        !placements.some((p: any) => p.photo_id === photo.id)
    );

    if (unpinnedPhotos.length > 0) {
        return { success: false, error: `Cannot Export: ${unpinnedPhotos.length} photo(s) are not pinned. Please pin all photos.` };
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.name || 'Project'} - As-Built Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #1a1a1a;
            --secondary: #666666;
            --accent: #2563eb;
            --border: #e5e7eb;
            --bg: #ffffff;
        }

        @media print {
            @page { margin: 0; size: auto; }
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
            .no-print { display: none; }
            .page-break { page-break-after: always; }
            .avoid-break { break-inside: avoid; }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--primary);
            background: #f3f4f6; /* Light gray bg for screen */
            line-height: 1.5;
        }

        .document-container {
            max-width: 210mm; /* A4 width */
            margin: 40px auto;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        @media print {
            .document-container {
                max-width: none;
                margin: 0;
                box-shadow: none;
            }
            body { background: white; }
        }

        /* --- Cover Page --- */
        .cover-page {
            height: 297mm; /* A4 Height */
            position: relative;
            padding: 20mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: white;
        }

        .cover-header {
            border-bottom: 4px solid var(--primary);
            padding-bottom: 20px;
        }

        .company-brand {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--secondary);
            margin-bottom: 20px;
        }

        .report-title {
            font-family: 'Merriweather', serif;
            font-size: 48px;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 10px;
        }

        .report-subtitle {
            font-size: 24px;
            color: var(--secondary);
            font-weight: 300;
        }

        .cover-image-container {
            flex: 1;
            margin: 40px 0;
            background-color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .cover-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.9;
        }

        .cover-footer {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            border-top: 1px solid var(--border);
            padding-top: 20px;
        }

        .meta-item .label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--secondary);
            margin-bottom: 4px;
        }

        .meta-item .value {
            font-size: 14px;
            font-weight: 500;
        }

        /* --- Standard Page Layout --- */
        .page {
            padding: 20mm;
            background: white;
            min-height: 297mm;
            position: relative;
        }

        .section-header {
            margin-bottom: 30px;
            border-bottom: 2px solid var(--border);
            padding-bottom: 10px;
        }

        .section-title {
            font-family: 'Merriweather', serif;
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
        }

        /* --- Floor Plan Section --- */
        .plan-container {
            position: relative;
            width: 100%;
            border: 1px solid var(--border);
            background: #fafafa;
        }

        .plan-image {
            display: block;
            width: 100%;
            height: auto;
        }

        /* Consistent Pin Styles */
        .pin {
            position: absolute;
            width: 24px;
            height: 24px; /* SVG height */
            transform: translate(-50%, -100%);
            z-index: 10;
        }
        
        .pin-number {
             position: absolute;
             top: 0; 
             left: 0;
             width: 100%;
             text-align: center;
             font-size: 10px;
             font-weight: bold;
             padding-top: 4px; 
        }

        /* --- Photo Grid --- */
        .photo-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .photo-item {
            break-inside: avoid;
            border: 1px solid var(--border);
            background: white;
        }

        .photo-img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-bottom: 1px solid var(--border);
        }

        .photo-meta {
            padding: 12px 15px;
        }

        .photo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .photo-id {
            font-weight: 700;
            font-size: 14px;
            color: var(--accent);
        }

        .photo-coords {
            font-family: monospace;
            font-size: 11px;
            color: var(--secondary);
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .photo-time {
            font-size: 12px;
            color: var(--secondary);
        }

        /* --- Data Table --- */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        .data-table th {
            text-align: left;
            padding: 12px;
            background: #f8fafc;
            border-bottom: 2px solid var(--border);
            font-family: 'Merriweather', serif;
            font-weight: 700;
            color: var(--primary);
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            color: var(--secondary);
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .tag-gps { background: #dcfce7; color: #15803d; }
        .tag-manual { background: #fef3c7; color: #b45309; }

        /* --- Footer --- */
        .page-footer {
            position: absolute;
            bottom: 1px;
            left: 20mm;
            right: 20mm;
            padding-top: 10px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #9ca3af;
        }

    </style>
</head>
<body>
    <div class="document-container">
        <!-- COVER PAGE -->
        <div class="cover-page page-break">
            <div class="cover-top">
                <div class="company-brand">SiteBuilt Documentation</div>
                <div class="cover-header">
                    <h1 class="report-title">${projectData.name || 'Unnamed Project'}</h1>
                    <div class="report-subtitle">As-Built Documentation Report</div>
                </div>
            </div>

            <div class="cover-image-container">
                ${mainPlan ? `<img src="${mainPlan.file_url}" class="cover-image" alt="Site Overview" />` : '<div style="color: #9ca3af">No Plan Overview Available</div>'}
            </div>

            <div class="cover-footer">
                <div class="meta-item">
                    <span class="label">Date Generated</span>
                    <span class="value">${currentDate}</span>
                </div>
                <div class="meta-item">
                    <span class="label">Total Photos</span>
                    <span class="value">${photos.length} Verified Shots</span>
                </div>
                <div class="meta-item">
                    <span class="label">Reference ID</span>
                    <span class="value text-mono">${projectId.substring(0, 8).toUpperCase()}</span>
                </div>
            </div>
        </div>

        <!-- PLAN VIEW PAGE -->
        ${mainPlan ? `
        <div class="page page-break">
            <div class="section-header">
                <h2 class="section-title">Site Overview Plan</h2>
            </div>
            <div class="plan-container">
                <img src="${mainPlan.file_url}" class="plan-image" alt="Floor Plan" />
                ${planPlacements.map((p: any, idx: number) => {
        const isGps = p.placement_method !== 'manual';
        const color = isGps ? '#10B981' : '#F59E0B';
        return `
                    <div class="pin" style="left: ${p.x}%; top: ${p.y}%;">
                       <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C5.37 0 0 5.37 0 12C0 20 12 30 12 30C12 30 24 20 24 12C24 5.37 18.63 0 12 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
                          <circle cx="12" cy="12" r="7" fill="white"/>
                       </svg>
                       <div class="pin-number" style="color: ${color}">${idx + 1}</div>
                    </div>
                    `;
    }).join('')}
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: var(--secondary);">
                <strong>Reference Scale:</strong> Plan dimensions ${mainPlan.width}px × ${mainPlan.height}px
            </div>
            
            <div class="page-footer">
               <span>${projectData.name}</span>
               <span>Page 2</span>
            </div>
        </div>
        ` : ''}

        <!-- PHOTOS PAGE -->
        ${photos.length > 0 ? `
        <div class="page page-break">
            <div class="section-header">
                <h2 class="section-title">Photo Log</h2>
            </div>
            
            <div class="photo-grid">
                ${photos.map((photo: any, idx: number) => {
        const lat = photo.exif_lat?.toFixed(6) || '-';
        const lng = photo.exif_lng?.toFixed(6) || '-';
        const time = photo.exif_timestamp
            ? new Date(photo.exif_timestamp).toLocaleString('en-US', {
                hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric'
            })
            : 'No Timestamp';

        return `
                    <div class="photo-item">
                        <img src="${photo.file_url}" class="photo-img" loading="lazy" />
                        <div class="photo-meta">
                            <div class="photo-header">
                                <span class="photo-id">#${idx + 1}</span>
                                <span class="photo-time">${time}</span>
                            </div>
                            ${photo.exif_lat ? `
                            <div class="photo-coords" title="GPS Coordinates">
                                📍 ${lat}, ${lng}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    `;
    }).join('')}
            </div>
            
             <div class="page-footer" style="position: fixed; bottom: 20mm;">
               <span>${projectData.name}</span>
               <span>Photo Appendix</span>
            </div>
        </div>
        ` : ''}

        <!-- DATA TABLE PAGE -->
        ${planPlacements.length > 0 ? `
        <div class="page">
             <div class="section-header">
                <h2 class="section-title">Detailed Placement Log</h2>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th width="50">#</th>
                        <th>Timestamp</th>
                        <th>Coordinates (X, Y)</th>
                        <th>GPS Location</th>
                        <th>Method</th>
                    </tr>
                </thead>
                <tbody>
                    ${planPlacements.map((p: any, idx: number) => {
        const photo = photos.find((ph: any) => ph.id === p.photo_id);
        const hasGps = photo?.exif_lat && photo?.exif_lng;
        return `
                        <tr>
                            <td><strong>${idx + 1}</strong></td>
                            <td>${photo?.exif_timestamp ? new Date(photo.exif_timestamp).toLocaleString() : '-'}</td>
                            <td style="font-family: monospace">${p.x?.toFixed(2)}%, ${p.y?.toFixed(2)}%</td>
                            <td>${hasGps ? `${photo.exif_lat.toFixed(5)}, ${photo.exif_lng.toFixed(5)}` : '<span style="color:#ccc">-</span>'}</td>
                            <td>
                                <span class="tag ${p.placement_method === 'manual' ? 'tag-manual' : 'tag-gps'}">
                                    ${p.placement_method || 'manual'}
                                </span>
                            </td>
                        </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
            
             <div class="page-footer" style="position: fixed; bottom: 20mm;">
               <span>${projectData.name}</span>
               <span>Data Log</span>
            </div>
        </div>
        ` : ''}
    </div>
    <script>
        // Auto-print prompt when opened
        // window.print();
    </script>
</body>
</html>`;
    return { success: true, html: htmlContent };
};
