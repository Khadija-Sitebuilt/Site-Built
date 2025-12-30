"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";
import { getProject } from "@/lib/api";

export default function ExportTab() {
    const params = useParams();
    const projectId = params.id as string;
    // content using supabase...

    const [isExporting, setIsExporting] = useState(false);
    const [exportUrl, setExportUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generateModernHTML = async (projectId: string) => {
        // Fetch project metadata from backend
        const projectData = await getProject(projectId).catch(() => ({ name: 'Project' }));

        // Fetch data from Supabase using authenticated client (bypasses RLS issues)
        const { data: plans } = await supabase
            .from('plans')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        const { data: photosData } = await supabase
            .from('photos')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        const photos = photosData || [];

        // Get plan IDs to fetch placements
        const planIds = plans?.map((p: any) => p.id) || [];

        let placements: any[] = [];
        if (planIds.length > 0) {
            const { data } = await supabase
                .from('photo_placements')
                .select('*')
                .in('plan_id', planIds);
            placements = data || [];
        }

        const mainPlan = plans?.[0];
        const currentDate = new Date().toLocaleString();

        // Filter placements for the main plan to ensure pins match the view
        const planPlacements = placements.filter((p: any) => p.plan_id === mainPlan?.id);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.name || 'Project'} - As-Built Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 12px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .header p {
            font-size: 16px;
            opacity: 0.95;
        }
        .content {
            padding: 50px 40px;
        }
        .section {
            margin-bottom: 60px;
        }
        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 3px solid #667eea;
        }
        .floor-plan-container {
            position: relative;
            width: fit-content;
            margin: 0 auto;
            margin-bottom: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .floor-plan {
            display: block;
            max-width: 100%;
            height: auto;
        }
        .pin-marker {
            position: absolute;
            width: 24px;
            height: 24px;
            background: #e53e3e;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            transform: translate(-50%, -50%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            border: 2px solid white;
            z-index: 10;
        }
        .photo-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 24px;
        }
        .photo-card {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .photo-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .photo-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .photo-info {
            padding: 16px;
            background: #f7fafc;
        }
        .photo-info .label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .photo-info .value {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #2d3748;
            font-size: 14px;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tr:nth-child(even) {
            background-color: #f7fafc;
        }
        tr:hover {
            background-color: #edf2f7;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-manual {
            background: #bee3f8;
            color: #2c5282;
        }
        .badge-gps {
            background: #c6f6d5;
            color: #22543d;
        }
        .footer {
            text-align: center;
            padding: 30px;
            background: #f7fafc;
            color: #718096;
            font-size: 14px;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${projectData.name || 'As-Built Report'}</h1>
            <p>Generated on ${currentDate}</p>
        </div>
        
        <div class="content">
            ${mainPlan ? `
            <div class="section">
                <h2 class="section-title">Floor Plan</h2>
                <div class="floor-plan-container">
                    <img src="${mainPlan.file_url}" alt="Floor Plan" class="floor-plan" />
                    ${planPlacements.map((p: any, idx: number) => `
                        <div class="pin-marker" style="left: ${p.x}%; top: ${p.y}%;">
                            ${idx + 1}
                        </div>
                    `).join('')}
                </div>
                <p style="color: #718096; font-size: 14px; margin-top: 12px;">
                    Dimensions: ${mainPlan.width} × ${mainPlan.height} px
                </p>
            </div>
            ` : ''}
            
            ${photos.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Photo Gallery (${photos.length} ${photos.length === 1 ? 'Photo' : 'Photos'})</h2>
                <div class="photo-gallery">
                    ${photos.map((photo: any, idx: number) => `
                        <div class="photo-card">
                            <img src="${photo.file_url}" alt="Photo ${idx + 1}" />
                            <div class="photo-info">
                                <div class="label">Photo #${idx + 1}</div>
                                ${photo.exif_timestamp ? `
                                    <div class="value">${new Date(photo.exif_timestamp).toLocaleDateString()}</div>
                                ` : ''}
                                ${photo.exif_lat && photo.exif_lng ? `
                                    <div class="label" style="margin-top: 8px;">GPS</div>
                                    <div class="value">${photo.exif_lat.toFixed(5)}, ${photo.exif_lng.toFixed(5)}</div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${planPlacements.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Photo Placements (${planPlacements.length})</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th>Date</th>
                            <th>X Coordinate</th>
                            <th>Y Coordinate</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${planPlacements.map((placement: any, idx: number) => {
            const photo = photos.find((p: any) => p.id === placement.photo_id);
            return `
                            <tr>
                                <td><strong>${idx + 1}</strong></td>
                                <td>
                                    ${photo ? `<img src="${photo.file_url}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />` : 'N/A'}
                                </td>
                                <td>${placement.created_at ? new Date(placement.created_at).toLocaleDateString() : 'N/A'}</td>
                                <td>${placement.x?.toFixed(2) || 'N/A'}</td>
                                <td>${placement.y?.toFixed(2) || 'N/A'}</td>
                                <td>
                                    <span class="badge badge-${placement.placement_method || 'manual'}">
                                        ${placement.placement_method || 'manual'}
                                    </span>
                                </td>
                            </tr>
                        `;
        }).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>© 2025 SiteBuilt - Construction Documentation Made Simple</p>
        </div>
    </div>
</body>
</html>`;
    };

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);
        setExportUrl(null);

        try {
            // Generate beautiful HTML from frontend
            const htmlContent = await generateModernHTML(projectId);

            // Create blob and open
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, '_blank');

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            setExportUrl(blobUrl);

            trackEvent(ANALYTICS_EVENTS.EXPORT_GENERATED, {
                projectId,
                format: 'html',
            });
        } catch (err: any) {
            setError(err.message || "Failed to generate report. Please try again.");
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Export As-Built Report</h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Generate a comprehensive HTML report containing the floor plan,
                    numbered pins, and a detailed table of all photos and observations.
                </p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Standard As-Built Report</h3>
                                <p className="text-sm text-gray-500">Includes plan, pins, and photo log</p>
                            </div>
                        </div>
                        {exportUrl ? (
                            <a
                                href={exportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <Download className="w-4 h-4" />
                                View Report
                            </a>
                        ) : (
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        Generate Report
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2 mb-6">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {exportUrl && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p>Report generated successfully! Click the download button above to save it.</p>
                        </div>
                    )}

                    <div className="border-t pt-6 mt-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Report Contents</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                High-resolution floor plan
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Numbered pin locations
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Photo metadata table
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                GPS coordinates log
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>Need a custom format? <a href="#" className="text-blue-600 hover:underline">Contact support</a></p>
            </div>
        </div>
    );
}
