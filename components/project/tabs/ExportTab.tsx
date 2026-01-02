"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { generateProjectReport } from "@/lib/export-utils";

export default function ExportTab() {
    const params = useParams();
    const projectId = params.id as string;

    const [isExporting, setIsExporting] = useState(false);
    const [exportUrl, setExportUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);
        setExportUrl(null);

        try {
            // Generate beautiful HTML from shared utility
            const result = await generateProjectReport(projectId);

            if (!result.success) {
                setError(result.error || "Export failed");
                return;
            }

            // Create blob and open
            const blob = new Blob([result.html], { type: 'text/html' });
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
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
                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium w-full md:w-auto"
                            >
                                <Download className="w-4 h-4" />
                                View Report
                            </a>
                        ) : (
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
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
