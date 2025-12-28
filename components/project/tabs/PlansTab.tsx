"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Calendar, Maximize2, Upload, X } from "lucide-react";
import { uploadPlan, getPlans, type Plan } from "@/lib/api";
import Link from "next/link";

interface PlansTabProps {
    plans: any[]; // Legacy prop - now unused
    photos: any[]; // Legacy prop - now unused
    projectId: string;
}

export default function PlansTab({ projectId }: PlansTabProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch plans on mount
    useEffect(() => {
        fetchPlans();
    }, [projectId]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError("");
            const fetchedPlans = await getPlans(projectId);
            setPlans(fetchedPlans);
        } catch (err: any) {
            console.error('Error fetching plans:', err);
            // Don't show error for "Method Not Allowed" - backend endpoint might not exist yet
            if (!err.message?.includes('Method Not Allowed')) {
                setError(err.message || 'Failed to load plans');
            }
            // Start with empty plans - they'll be added after upload
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (file: File) => {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'image/vnd.dxf', 'application/dxf'];
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.dxf'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            setError('Invalid file type. Please upload PNG, JPG, PDF, or DXF files.');
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('File size must be less than 50MB');
            return;
        }

        try {
            setUploading(true);
            setError("");
            setUploadProgress(`Uploading ${file.name}...`);

            const newPlan = await uploadPlan(projectId, file);

            // Add new plan to the list
            setPlans(prev => [newPlan, ...prev]);
            setUploadProgress("");
        } catch (err: any) {
            console.error('Error uploading plan:', err);
            setError(err.message || 'Failed to upload plan');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    // Empty state
    if (plans.length === 0 && !uploading) {
        return (
            <div className="text-center py-16">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="inline-block"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No floor plans yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upload floor plans to start mapping photos and creating as-built documentation.
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileInputChange}
                        accept=".dxf,.pdf,.png,.jpg,.jpeg"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : 'Upload Floor Plan'}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Upload Button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Floor Plans</h2>
                    <p className="text-sm text-gray-600">
                        {plans.length} plan{plans.length !== 1 ? 's' : ''} uploaded
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    accept=".dxf,.pdf,.png,.jpg,.jpeg"
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload New Plan'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 flex-1">{error}</p>
                    <button onClick={() => setError("")} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Progress */}
            {uploadProgress && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{uploadProgress}</p>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Plan Thumbnail */}
                        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                            {plan.file_url ? (
                                <img
                                    src={plan.file_url}
                                    alt={`Floor plan ${plan.id}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <FileText className="w-16 h-16 text-gray-300" />
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={plan.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-full bg-white hover:bg-gray-100 inline-block"
                                    >
                                        <Maximize2 className="w-5 h-5 text-gray-900" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Plan Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Floor Plan</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(plan.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>{plan.width} × {plan.height} px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
