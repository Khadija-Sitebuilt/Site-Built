"use client";

import { FileText, Info } from "lucide-react";

export default function ExportTab() {
    return (
        <div className="max-w-3xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Export Feature Coming Soon
            </h3>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Generate professional As-Built documentation with floor plans, photo placements, and comprehensive metadata reports.
            </p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-left">
                <div className="flex gap-3">
                    <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-emerald-900 mb-2">Planned Export Options</h4>
                        <ul className="space-y-2 text-sm text-emerald-800">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 flex-shrink-0" />
                                PDF Report with numbered pins and photo table
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 flex-shrink-0" />
                                HTML Interactive report with zoom and navigation
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 flex-shrink-0" />
                                CSV Export of photo metadata and coordinates
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 flex-shrink-0" />
                                Plan image with overlaid pins (PNG/JPEG)
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 flex-shrink-0" />
                                Timestamped documentation for project records
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">
                Expected in Week 4 of development
            </p>
        </div>
    );
}
