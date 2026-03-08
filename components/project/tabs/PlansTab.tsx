"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Calendar, Maximize2, Upload, X, RefreshCw } from "lucide-react";
import { uploadPlan, getPlans, deletePlan, setPlanActive, type Plan } from "@/lib/api";
import PlanViewerModal from "@/components/project/PlanViewerModal";
import PlansTabSkeleton from "@/components/project/tabs/PlansTabSkeleton";
import ConfirmModal from "@/components/common/ConfirmModal";

interface PlansTabProps {
    projectId: string;
}

export default function PlansTab({ projectId }: PlansTabProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [planToReplace, setPlanToReplace] = useState<Plan | null>(null);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceFileInputRef = useRef<HTMLInputElement>(null);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set());
    const [showActivePlanWarning, setShowActivePlanWarning] = useState(false);
    const [pendingActivePlan, setPendingActivePlan] = useState<Plan | null>(null);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

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
        // Validate file type - only PDFs are allowed now (backend handles conversion)
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Invalid file type. Please upload a PDF file.');
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
            setToast({ message: "Plan uploaded successfully!", type: 'success' });
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

    const handleReplacePlan = (plan: Plan) => {
        setPlanToReplace(plan);
        setShowReplaceModal(true);
    };

    const confirmReplace = () => {
        setShowReplaceModal(false);
        // Trigger file input
        replaceFileInputRef.current?.click();
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedPlanIds(new Set());
    };

    const togglePlanSelection = (planId: string) => {
        const newSelected = new Set(selectedPlanIds);
        if (newSelected.has(planId)) {
            newSelected.delete(planId);
        } else {
            newSelected.add(planId);
        }
        setSelectedPlanIds(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedPlanIds.size === 0) return;

        // Constraint: Must keep at least 1 plan
        if (plans.length - selectedPlanIds.size < 1) {
            setToast({ message: "You must keep at least one floor plan in the project.", type: 'error' });
            return;
        }

        // Check if any selected plans are active
        const deletingActivePlan = Array.from(selectedPlanIds).some(id => id === activePlanId);

        if (deletingActivePlan) {
            setToast({ message: "Cannot delete the active plan. Please set another plan as active first, then try again.", type: 'error' });
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedPlanIds.size} floor plan(s)? This action cannot be undone.`)) {
            return;
        }

        try {
            setLoading(true);

            // Delete plans one by one
            const promises = Array.from(selectedPlanIds).map(id => deletePlan(id));
            await Promise.all(promises);

            // Update local state
            const remainingPlans = plans.filter(p => !selectedPlanIds.has(p.id));
            setPlans(remainingPlans);

            // Check if active plan was deleted
            if (activePlanId && selectedPlanIds.has(activePlanId)) {
                // Set new active plan (first of remaining)
                if (remainingPlans.length > 0) {
                    const newActive = remainingPlans[0];
                    setActivePlanId(newActive.id);
                    localStorage.setItem(`activePlan_${projectId}`, newActive.id);
                    await setPlanActive(projectId, newActive.id);
                }
            }

            setIsSelectionMode(false);
            setSelectedPlanIds(new Set());
            setToast({ message: "Selected plans deleted successfully", type: 'success' });
        } catch (err: any) {
            console.error('Error deleting plans:', err);
            setToast({ message: "Failed to delete some plans", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // ... Existing replace logic ...
    const handleReplaceFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !planToReplace) return;

        setIsReplacing(true);
        setUploadProgress(`Replacing plan...`);

        try {
            // Delete old plan
            await deletePlan(planToReplace.id);

            // Upload new plan
            const newPlan = await uploadPlan(projectId, file);

            // Update state: Remove old plan and add new one
            setPlans(prev => [...prev.filter(p => p.id !== planToReplace.id), newPlan]);

            setUploadProgress("");
            setPlanToReplace(null);
            setToast({ message: "Plan replaced successfully!", type: 'success' });
        } catch (err: any) {
            console.error('Error replacing plan:', err);
            setError(err.message || 'Failed to replace plan');
        } finally {
            setIsReplacing(false);
            if (replaceFileInputRef.current) {
                replaceFileInputRef.current.value = '';
            }
        }
    };

    const [activePlanId, setActivePlanId] = useState<string>("");

    // Initialize active plan from DB state
    useEffect(() => {
        if (plans.length > 0) {
            // Priority:
            // 1. Plan marked is_active=true in DB
            // 2. First plan in the array (fallback)
            const active = plans.find(p => p.is_active);
            if (active) {
                setActivePlanId(active.id);
            } else {
                // Determine implicit active plan (e.g. usage during migration)
                setActivePlanId(plans[0].id);
            }
        } else {
            setActivePlanId("");
        }
    }, [plans]);

    const handleSetActive = async (plan: Plan, e: React.MouseEvent) => {
        e.stopPropagation();

        // Show warning modal before changing
        setPendingActivePlan(plan);
        setShowActivePlanWarning(true);
    };

    const confirmSetActive = async () => {
        if (!pendingActivePlan) return;

        const plan = pendingActivePlan;

        // Optimistic update
        const prevActiveId = activePlanId;
        setActivePlanId(plan.id);

        // Update local plans state to reflect change immediately (badges)
        setPlans(plans.map(p => ({
            ...p,
            is_active: p.id === plan.id
        })));

        try {
            await setPlanActive(projectId, plan.id);
            setToast({ message: "Active plan updated. Previous plan's photo placements have been removed.", type: 'success' });
        } catch (err: any) {
            console.error('Failed to set active plan:', err);
            // Revert on failure
            setActivePlanId(prevActiveId);
            setPlans(plans.map(p => ({
                ...p,
                is_active: p.id === prevActiveId
            })));
            setToast({ message: "Failed to update active plan", type: 'error' });
        } finally {
            setShowActivePlanWarning(false);
            setPendingActivePlan(null);
        }
    };

    // ... (rest of loading check)

    if (loading) {
        return <PlansTabSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Floor Plans</h2>
                    <p className="text-sm text-gray-500">
                        Manage your project's architectural drawings and layouts.
                    </p>
                </div>
                {plans.length > 0 && (
                    <div className="flex items-center gap-2">
                        {isSelectionMode ? (
                            <>
                                <button
                                    onClick={handleDeleteSelected}
                                    disabled={selectedPlanIds.size === 0}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Delete ({selectedPlanIds.size})
                                </button>
                                <button
                                    onClick={toggleSelectionMode}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={toggleSelectionMode}
                                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Select
                            </button>
                        )}

                        {!isSelectionMode && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInputChange}
                                    accept=".pdf"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Uploading...' : 'Add Another Plan'}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Success Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800">Error</h4>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Progress */}
            {uploadProgress && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-blue-900">{uploadProgress}</p>
                </div>
            )}

            {/* Content: Empty State or Grid */}
            {plans.length === 0 && !uploading ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No floor plans yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Upload a PDF floor plan to start placing photos and tracking progress.
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileInputChange}
                        accept=".pdf"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Floor Plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => {
                                if (isSelectionMode) {
                                    togglePlanSelection(plan.id);
                                }
                            }}
                            className={`group bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${isSelectionMode && selectedPlanIds.has(plan.id)
                                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                                : activePlanId === plan.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                                } ${isSelectionMode ? 'cursor-pointer' : ''}`}
                        >
                            {/* Plan Thumbnail */}
                            <div
                                className="aspect-[4/3] bg-gray-100 relative overflow-hidden"
                            >
                                {plan.file_url ? (
                                    <img
                                        src={plan.file_url}
                                        alt={`Floor plan ${plan.id}`}
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}

                                {/* Overlay: View Button (Normal Mode) */}
                                {!isSelectionMode && (
                                    <div
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPlan(plan);
                                            setIsViewerOpen(true);
                                        }}
                                    >
                                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 text-sm font-medium text-gray-900">
                                            <Maximize2 className="w-4 h-4" />
                                            View Plan
                                        </div>
                                    </div>
                                )}

                                {/* Overlay: Checkbox (Selection Mode) */}
                                {isSelectionMode && (
                                    <div className="absolute top-3 left-3">
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedPlanIds.has(plan.id)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'bg-white border-gray-300'
                                            }`}>
                                            {selectedPlanIds.has(plan.id) && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Plan Info */}
                            <div className="p-5 border-t border-gray-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Floor Plan</h3>
                                        <p className="text-xs text-gray-500 font-mono">ID: {plan.id.slice(0, 8)}</p>
                                    </div>

                                    {/* Action Button (Only show in normal mode) */}
                                    {!isSelectionMode && (
                                        activePlanId === plan.id ? (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wide">
                                                Active
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => handleSetActive(plan, e)}
                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide transition-colors cursor-pointer"
                                            >
                                                Set Active
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {formatDate(plan.created_at)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Maximize2 className="w-4 h-4 mr-2 text-gray-400" />
                                        {plan.width} × {plan.height} px
                                    </div>
                                </div>

                                {!isSelectionMode && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReplacePlan(plan);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Replace Version
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Plan Viewer Modal */}
            <PlanViewerModal
                plan={selectedPlan ? {
                    id: selectedPlan.id,
                    projectId: projectId,
                    name: 'Floor Plan',
                    fileUrl: selectedPlan.file_url || '',
                    thumbnailUrl: selectedPlan.file_url || '',
                    width: selectedPlan.width,
                    height: selectedPlan.height,
                    uploadedAt: selectedPlan.created_at
                } : null}
                isOpen={isViewerOpen}
                onClose={() => {
                    setIsViewerOpen(false);
                    setSelectedPlan(null);
                }}
            />

            {/* Confirm Replace Modal - Only show warning for active plan */}
            <ConfirmModal
                isOpen={showReplaceModal}
                onClose={() => setShowReplaceModal(false)}
                onConfirm={confirmReplace}
                title="Replace Plan?"
                message={planToReplace?.id === activePlanId
                    ? `Replacing this plan will permanently delete the current file.\n\n⚠️ WARNING: This is the active plan. All photo placements will be lost and photos will become unplaced.`
                    : `Replacing this plan will permanently delete the current file.\n\nThis action cannot be undone.`
                }
                confirmText="Yes, Replace Plan"
                confirmStyle="danger"
            />

            {/* Confirm Active Plan Change Modal */}
            <ConfirmModal
                isOpen={showActivePlanWarning}
                onClose={() => {
                    setShowActivePlanWarning(false);
                    setPendingActivePlan(null);
                }}
                onConfirm={confirmSetActive}
                title="Change Active Plan?"
                message={`Changing the active floor plan will delete all photo placements on the current active plan.\n\n⚠️ WARNING: All photos will become unplaced and you'll need to re-place them on the new active plan.\n\nAre you sure you want to continue?`}
                confirmText="Change Active Plan"
                confirmStyle="primary"
            />

            {/* Hidden File Input for Replacement */}
            <input
                ref={replaceFileInputRef}
                type="file"
                onChange={handleReplaceFileSelect}
                accept=".pdf"
                className="hidden"
            />
        </div>
    );
}
