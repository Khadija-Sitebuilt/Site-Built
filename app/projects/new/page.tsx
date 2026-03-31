"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, HelpCircle, Calendar, MapPin, CheckCircle, FileText, Image as ImageIcon, Crosshair, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { createProject, uploadPlan, uploadPhoto } from "@/lib/api";

export default function NewProjectPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
    const totalSteps = 5;

    // Form State
    const [formData, setFormData] = useState({
        projectName: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        projectManager: "",
        estimatedBudget: ""
    });

    // File State
    const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);

    // Calibration State
    interface CalibrationPoint {
        id: number;
        name: string;
        latitude: string;
        longitude: string;
    }
    const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<
        Array<{ place_id: number; display_name: string }>
    >([]);
    const [locationOpen, setLocationOpen] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState("");
    const locationRequestIdRef = useRef(0);

    const formatDisplayDate = (value: string) => {
        if (!value) return "Select date";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Select date";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const DatePicker = ({
        name,
        value,
        onChange,
        placeholder,
    }: {
        name: "startDate" | "endDate";
        value: string;
        onChange: (nextValue: string) => void;
        placeholder?: string;
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [viewDate, setViewDate] = useState(() => {
            return value ? new Date(value) : new Date();
        });

        const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        const startDay = startOfMonth.getDay();
        const daysInMonth = endOfMonth.getDate();

        const handleSelect = (day: number) => {
            const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const iso = selected.toISOString().split("T")[0];
            onChange(iso);
            setIsOpen(false);
        };

        const weeks: Array<Array<number | null>> = [];
        let currentDay = 1;
        for (let row = 0; row < 6; row += 1) {
            const week: Array<number | null> = [];
            for (let col = 0; col < 7; col += 1) {
                if (row === 0 && col < startDay) {
                    week.push(null);
                } else if (currentDay > daysInMonth) {
                    week.push(null);
                } else {
                    week.push(currentDay);
                    currentDay += 1;
                }
            }
            weeks.push(week);
            if (currentDay > daysInMonth) break;
        }

        const selectedDate = value ? new Date(value) : null;

        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                >
                    <span className={`${value ? "text-gray-900" : "text-gray-400"}`}>
                        {value ? formatDisplayDate(value) : placeholder || "Select date"}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                </button>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

                {isOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
                                }
                                className="p-1 rounded-md hover:bg-gray-100"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900">
                                {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
                                }
                                className="p-1 rounded-md hover:bg-gray-100"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="text-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-sm">
                            {weeks.flat().map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} />;
                                }
                                const isSelected =
                                    selectedDate &&
                                    selectedDate.getFullYear() === viewDate.getFullYear() &&
                                    selectedDate.getMonth() === viewDate.getMonth() &&
                                    selectedDate.getDate() === day;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleSelect(day)}
                                        className={`h-9 w-9 rounded-full flex items-center justify-center mx-auto transition-colors ${
                                            isSelected
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        let { value } = e.target;

        if (name === "estimatedBudget") {
            // Keep only digits and a single decimal point
            value = value.replace(/[^0-9.]/g, "");
            const parts = value.split(".");
            if (parts.length > 2) {
                value = `${parts[0]}.${parts.slice(1).join("")}`;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const query = formData.location.trim();
        if (query.length < 3) {
            setLocationSuggestions([]);
            setLocationOpen(false);
            setLocationLoading(false);
            setLocationError("");
            return;
        }

        const requestId = ++locationRequestIdRef.current;
        const timer = setTimeout(async () => {
            try {
                setLocationLoading(true);
                setLocationError("");

                const params = new URLSearchParams({
                    format: "jsonv2",
                    q: query,
                    addressdetails: "1",
                    limit: "6",
                });

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch locations");
                }

                const data = await response.json();
                if (locationRequestIdRef.current !== requestId) return;

                setLocationSuggestions(
                    Array.isArray(data)
                        ? data.map((item: any) => ({
                            place_id: item.place_id,
                            display_name: item.display_name,
                        }))
                        : [],
                );
                setLocationOpen(true);
            } catch (err: any) {
                if (locationRequestIdRef.current !== requestId) return;
                setLocationError("Unable to load suggestions");
                setLocationSuggestions([]);
                setLocationOpen(true);
            } finally {
                if (locationRequestIdRef.current === requestId) {
                    setLocationLoading(false);
                }
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [formData.location]);

    // File Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFloorPlanFile(e.target.files[0]);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFloorPlanFile(e.dataTransfer.files[0]);
        }
    };

    const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setPhotos(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setFloorPlanFile(null);
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    // Calibration Handlers
    const addCalibrationPoint = () => {
        setCalibrationPoints(prev => [
            ...prev,
            {
                id: Date.now(),
                name: `Reference Point ${prev.length + 1}`,
                latitude: "",
                longitude: ""
            }
        ]);
    };

    const updateCalibrationPoint = (id: number, field: keyof CalibrationPoint, value: string) => {
        setCalibrationPoints(prev => prev.map(point =>
            point.id === id ? { ...point, [field]: value } : point
        ));
    };

    const removeCalibrationPoint = (id: number) => {
        setCalibrationPoints(prev => prev.filter(point => point.id !== id));
    };

    // Validation
    const isStep1Valid = Boolean(
        formData.projectName &&
        formData.location &&
        formData.startDate &&
        formData.endDate
    );

    // Navigation Handlers
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Processing Logic - Create Project via API
    const handleStartProcessing = async () => {
        setIsProcessing(true);
        setError("");

        try {
            // Create the project in the backend
            const project = await createProject({
                name: formData.projectName,
                description: formData.description || "",
                location: formData.location || undefined,
                start_date: formData.startDate || undefined,
                end_date: formData.endDate || undefined,
                project_manager: formData.projectManager || undefined,
                estimated_budget: formData.estimatedBudget || undefined,
            });

            setCreatedProjectId(project.id);

            // Upload floor plan if one was selected
            let uploadedPlan = null;
            if (floorPlanFile) {
                try {
                    uploadedPlan = await uploadPlan(project.id, floorPlanFile);
                    console.log('Successfully uploaded floor plan');
                } catch (uploadErr) {
                    console.error('Error uploading floor plan:', uploadErr);
                    // Don't fail the entire project creation if plan upload fails
                }
            }

            // Upload photos if any were selected
            if (photos.length > 0) {
                const photoUploadPromises = photos.map(photo =>
                    uploadPhoto(project.id, photo, uploadedPlan ? {
                        planId: uploadedPlan.id,
                        planWidth: uploadedPlan.width,
                        planHeight: uploadedPlan.height
                    } : undefined)
                );

                try {
                    await Promise.all(photoUploadPromises);
                    console.log(`Successfully uploaded ${photos.length} photo(s)`);
                } catch (uploadErr) {
                    console.error('Error uploading photos:', uploadErr);
                    // Don't fail the entire project creation
                }
            }

            setCurrentStep(6); // Advance to success state (Step 6)
        } catch (err: any) {
            console.error('Error creating project:', err);
            setError(err.message || 'Failed to create project. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Steps configuration
    const steps = [
        { number: 1, label: "Project Info", description: "Basic project details" },
        { number: 2, label: "Floor Plan", description: "Upload building plans" },
        { number: 3, label: "Photos", description: "Upload reference photos" },
        { number: 4, label: "Calibration", description: "GPS alignment (optional)" },
        { number: 5, label: "Confirmation", description: "Review and start mapping" },
    ];

    return (
        <div className="max-w-3xl mx-auto pt-20 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">New Project Wizard</h1>
                <p className="text-gray-600">Follow these steps to set up your mapping project</p>
            </div>

            {/* Stepper */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-500">
                    <span>Step {Math.min(currentStep, totalSteps)} of {totalSteps}</span>
                    <span>{Math.min(Math.round(((currentStep - 1) / totalSteps) * 100), 100)}% Complete</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((currentStep - 1) / totalSteps) * 100, 100)}%` }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="hidden md:flex justify-between relative px-4">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center z-10 text-center w-32">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-colors ${isCompleted ? "bg-emerald-500 text-white" :
                                    isCurrent ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
                                    }`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span className={`text-xs font-medium mb-0.5 ${isCurrent ? "text-gray-900" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                </span>
                                <span className={`text-[10px] ${isCurrent ? "text-gray-500" : "text-gray-400"
                                    }`}>
                                    {step.description}
                                </span>
                            </div>
                        );
                    })}
                    {/* Connecting line behind circles - strictly visual, positioned absolutely */}
                    <div className="absolute top-4 left-0 w-full h-[1px] bg-gray-200 -z-0" />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">


                {/* Step 1: Project Info */}
                {currentStep === 1 && (
                    <>
                        {/* Section: Basic Information */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name <span className="text-red-500">*</span>
                                        <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Downtown Office Building Survey"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location <span className="text-red-500">*</span>
                                        <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            onFocus={() => {
                                                if (formData.location.trim().length >= 3) {
                                                    setLocationOpen(true);
                                                }
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => setLocationOpen(false), 150);
                                            }}
                                            autoComplete="off"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter site address..."
                                        />
                                        {locationOpen && (
                                            <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                                                {locationLoading && (
                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                        Searching locations...
                                                    </div>
                                                )}
                                                {locationError && !locationLoading && (
                                                    <div className="px-4 py-3 text-sm text-red-500">
                                                        {locationError}
                                                    </div>
                                                )}
                                                {!locationLoading && !locationError && locationSuggestions.length === 0 && (
                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                        No suggestions found.
                                                    </div>
                                                )}
                                                {!locationLoading && !locationError && locationSuggestions.length > 0 && (
                                                    <ul className="max-h-56 overflow-auto">
                                                        {locationSuggestions.map((item) => (
                                                            <li key={item.place_id}>
                                                                <button
                                                                    type="button"
                                                                    onMouseDown={(event) => event.preventDefault()}
                                                                    onClick={() => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            location: item.display_name,
                                                                        }));
                                                                        setLocationOpen(false);
                                                                        setLocationSuggestions([]);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                >
                                                                    {item.display_name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Description
                                        <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Describe the project objectives, special requirements, or any additional context..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Project Timeline */}
                        <div className="mb-8 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Calendar className="w-5 h-5 text-gray-700" />
                                <h2 className="text-lg font-semibold text-gray-900">Project Timeline</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={(nextValue) =>
                                            handleInputChange({
                                                target: { name: "startDate", value: nextValue },
                                            } as React.ChangeEvent<HTMLInputElement>)
                                        }
                                        placeholder="Pick start date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={(nextValue) =>
                                            handleInputChange({
                                                target: { name: "endDate", value: nextValue },
                                            } as React.ChangeEvent<HTMLInputElement>)
                                        }
                                        placeholder="Pick end date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Additional Details */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Manager
                                    </label>
                                    <input
                                        type="text"
                                        name="projectManager"
                                        value={formData.projectManager}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter project manager name..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Budget
                                    </label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.01"
                                        name="estimatedBudget"
                                        value={formData.estimatedBudget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., 500000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Getting Started Tip */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-emerald-900 mb-3">Getting Started</h3>
                            <ul className="space-y-2 text-sm text-emerald-800">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Choose a clear, descriptive project name
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Provide the exact location for GPS reference
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Description helps team members understand project goals
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {/* Step 2: Floor Plan */}
                {currentStep === 2 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Floor Plan</h2>
                            <p className="text-gray-500 text-sm">Upload building plans</p>
                        </div>

                        {/* Upload Zone */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Floor Plan Upload <span className="text-red-500">*</span>
                                <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                            </label>

                            {!floorPlanFile ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".dxf,.pdf,.png,.jpg,.jpeg"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Drop your floor plan here</h3>
                                    <p className="text-gray-500 text-sm mb-6">or click to browse files</p>
                                    <button className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm pointer-events-none">
                                        Choose File
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                                            <FileText className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{floorPlanFile.name}</p>
                                            <p className="text-xs text-gray-500">{(floorPlanFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="mb-8 p-4 rounded-xl border border-gray-200 bg-white flex gap-4">
                            <div className="mt-0.5">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-semibold text-gray-900 mb-1">Supported formats:</h4>
                                <p className="text-gray-500 mb-2">DXF, PDF, PNG, JPG (max 50MB)</p>
                                <h4 className="font-semibold text-gray-900 mb-1">Best practices:</h4>
                                <p className="text-gray-500">Use high-resolution images for better mapping accuracy</p>
                            </div>
                        </div>

                        {/* Guidelines Box */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-emerald-900 mb-3">Floor Plan Guidelines</h3>
                            <ul className="space-y-2 text-sm text-emerald-800">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    <span className="font-semibold">DXF files:</span> Ideal for CAD drawings with precise measurements
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    <span className="font-semibold">PDF files:</span> Good for architectural plans and technical drawings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    <span className="font-semibold">Image files:</span> Use high resolution (300+ DPI) for best results
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Ensure the plan shows clear room boundaries and major features
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Include scale reference if available for accurate mapping
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {/* Step 3: Photos */}
                {currentStep === 3 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Photos</h2>
                            <p className="text-gray-500 text-sm">Upload reference photos</p>
                        </div>

                        {/* Upload Zone */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reference Photos <span className="text-red-500">*</span>
                                <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                            </label>

                            <div
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('photo-upload')?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer mb-6"
                            >
                                <input
                                    type="file"
                                    id="photo-upload"
                                    className="hidden"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handlePhotoSelect}
                                />
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Drag and drop photos here</h3>
                                <p className="text-gray-500 text-sm mb-6">Select multiple files or drop them all at once</p>
                                <button className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm pointer-events-none">
                                    Choose Photos
                                </button>
                            </div>

                            {/* Photo List */}
                            {photos.length > 0 && (
                                <div className="space-y-3 mb-8">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    {/* Preview thumbnail if it's an image */}
                                                    {photo.type.startsWith('image/') ? (
                                                        <img
                                                            src={URL.createObjectURL(photo)}
                                                            alt={photo.name}
                                                            className="w-full h-full object-cover"
                                                            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{photo.name}</p>
                                                    <p className="text-xs text-gray-500">{(photo.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removePhoto(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="mb-8 p-4 rounded-xl border border-gray-200 bg-white flex gap-4">
                            <div className="mt-0.5">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-semibold text-gray-900 mb-1">Supported formats:</h4>
                                <p className="text-gray-500 mb-2">JPG, PNG, WebP (max 10MB each)</p>
                                <h4 className="font-semibold text-gray-900 mb-1">Tips:</h4>
                                <p className="text-gray-500">Take photos from different angles and include key landmarks for better reference</p>
                            </div>
                        </div>

                        {/* Guidelines Box */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-emerald-900 mb-3">Photo Guidelines</h3>
                            <ul className="space-y-2 text-sm text-emerald-800">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Capture wide shots to show overall room layout
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Include detail shots of important features or landmarks
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Take photos from multiple angles for better coverage
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Ensure good lighting for clear, usable reference images
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Include any unique architectural features or fixtures
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {/* Step 4: Calibration */}
                {currentStep === 4 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Calibration</h2>
                            <p className="text-gray-500 text-sm">GPS alignment (optional)</p>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GPS Calibration Points
                                <HelpCircle className="w-4 h-4 text-gray-400 inline-block ml-1" />
                            </label>
                            <p className="text-sm text-gray-500">
                                Mark 2-3 reference points with known GPS coordinates to align your mapping data with real-world positions.
                            </p>
                        </div>

                        {/* Optional Info Box */}
                        <div className="mb-8 p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex gap-4">
                            <div className="mt-0.5 p-1.5 bg-gray-100 rounded-lg h-fit">
                                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-semibold text-gray-900 mb-1">Optional step:</h4>
                                <p className="text-gray-500">GPS calibration improves accuracy for outdoor mapping and large indoor spaces. You can skip this step and add calibration points later if needed.</p>
                            </div>
                        </div>

                        {/* Add Point Button */}
                        <button
                            onClick={addCalibrationPoint}
                            className="w-full mb-8 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Calibration Point
                        </button>

                        {/* Points List */}
                        <div className="space-y-4 mb-8">
                            {calibrationPoints.map((point, index) => (
                                <div key={point.id} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <h4 className="font-semibold text-gray-900">Point {index + 1}</h4>
                                        </div>
                                        <button
                                            onClick={() => removeCalibrationPoint(point.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Reference Name
                                            </label>
                                            <input
                                                type="text"
                                                value={point.name}
                                                onChange={(e) => updateCalibrationPoint(point.id, 'name', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="e.g. Reference Point 1"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Latitude
                                                </label>
                                                <input
                                                    type="text"
                                                    value={point.latitude}
                                                    onChange={(e) => updateCalibrationPoint(point.id, 'latitude', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="e.g. 44.123456"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Longitude
                                                </label>
                                                <input
                                                    type="text"
                                                    value={point.longitude}
                                                    onChange={(e) => updateCalibrationPoint(point.id, 'longitude', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="e.g. -55.987654"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Status Box */}
                        {calibrationPoints.length > 0 && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <Crosshair className="w-4 h-4 text-gray-900" />
                                    <h4 className="font-semibold text-gray-900 text-sm">Calibration Status</h4>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {calibrationPoints.filter(p => p.latitude && p.longitude).length} of {calibrationPoints.length} points have complete coordinates. You have {calibrationPoints.filter(p => p.latitude && p.longitude).length >= 2 ? "enough" : "not enough"} points for good calibration.
                                </p>
                            </div>
                        )}

                        {/* Guidelines Box */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-emerald-900 mb-3">Calibration Guidelines</h3>
                            <ul className="space-y-2 text-sm text-emerald-800">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Choose easily identifiable points (corners, entrances, fixtures)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Use a GPS app or surveying equipment for accurate coordinates
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    Spread points across your mapping area for better coverage
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    2-3 points are usually sufficient for most projects
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                                    You can add or modify these points later in the project settings
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirmation</h2>
                            <p className="text-gray-500 text-sm">Review and start mapping</p>
                        </div>

                        {!isProcessing ? (
                            // Review State
                            <>
                                {/* Project Summary Box */}
                                <div className="mb-6 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-6 text-emerald-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <h3 className="font-semibold text-gray-900">Project Summary</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6">Review your project details before starting the mapping process</p>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Project Name</label>
                                            <p className="text-lg font-semibold text-gray-900">{formData.projectName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Location</label>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{formData.location}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</label>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {formData.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Uploaded Files Summary */}
                                <div className="mb-6 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <FileText className="w-5 h-5 text-gray-900" />
                                        <h3 className="font-semibold text-gray-900">Uploaded Files</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Floor Plan Item */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <FileText className="w-6 h-6 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Floor Plan</p>
                                                    <p className="text-xs text-gray-500">
                                                        {floorPlanFile ? `${floorPlanFile.name} (${(floorPlanFile.size / 1024).toFixed(2)} KB)` : "No file selected"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${floorPlanFile ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                                {floorPlanFile ? "Ready" : "Missing"}
                                            </span>
                                        </div>

                                        {/* Photos Item */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <ImageIcon className="w-6 h-6 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Reference Photos</p>
                                                    <p className="text-xs text-gray-500">{photos.length} files ({photos.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024 < 1 ? (photos.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2) + " KB" : (photos.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2) + " MB"})</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">Ready</span>
                                        </div>
                                    </div>
                                </div>

                                {/* GPS Calibration Summary */}
                                <div className="mb-6 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Crosshair className="w-5 h-5 text-gray-900" />
                                        <h3 className="font-semibold text-gray-900">GPS Calibration</h3>
                                    </div>

                                    {calibrationPoints.length > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-600 mb-4">{calibrationPoints.length} calibration point{calibrationPoints.length !== 1 ? 's' : ''} configured</p>
                                            <div className="space-y-3">
                                                {calibrationPoints.map((point) => (
                                                    <div key={point.id} className="flex justify-between items-center text-sm p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-gray-900">{point.name}</p>
                                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-md font-medium ${point.latitude && point.longitude ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                                {point.latitude && point.longitude ? "Calibrated" : "Incomplete"}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 font-mono text-xs">
                                                            {point.latitude || "?"}, {point.longitude || "?"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No calibration points configured (skipped)</p>
                                    )}
                                </div>

                                {/* Ready Banner */}
                                <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex gap-4">
                                    <div className="mt-0.5">
                                        <Rocket className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <div className="text-sm">
                                        <h4 className="font-semibold text-gray-900 mb-1">Ready to start mapping!</h4>
                                        <p className="text-gray-500">All required files have been uploaded and your project is configured. Click "Start Processing" to begin creating your mapping project.</p>
                                    </div>
                                </div>

                                {/* Start Processing CTA */}
                                <div className="p-8 bg-gray-100 rounded-xl border border-gray-200 text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Mapping Project</h3>
                                    <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                                        This will process your files and set up the mapping environment. The process typically takes 1-3 minutes depending on file sizes.
                                    </p>
                                    <button
                                        onClick={handleStartProcessing}
                                        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        <Rocket className="w-5 h-5" />
                                        Start Processing
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Processing State
                            <div className="py-20 text-center">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Project</h3>
                                <p className="text-gray-500 mb-12">Setting up your mapping project and processing uploaded files...</p>

                                <div className="max-w-md mx-auto">
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="font-medium text-gray-900">Processing Progress</span>
                                        <span className="text-gray-900 font-bold">100%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full mb-12 overflow-hidden">
                                        <div className="h-full bg-gray-900 rounded-full animate-pulse w-full"></div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6 text-left">
                                        <h4 className="font-medium text-gray-900 mb-4">Processing Steps</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                Creating project structure
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                Processing floor plan
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                Optimizing reference photos
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle className={`w-5 h-5 ${calibrationPoints.length > 0 ? "text-emerald-500" : "text-gray-300"}`} />
                                                Setting up GPS calibration
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Step 6: Success */}
                {currentStep === 6 && (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Created Successfully!</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Your mapping project "{formData.projectName}" has been created and is ready for use.
                        </p>

                        <div className="max-w-xl mx-auto border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">{formData.projectName}</h4>
                                    <p className="text-gray-500 text-sm">{formData.location}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 text-left">
                                Next steps: Upload floor plans and photos to start mapping your construction site.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {createdProjectId && (
                                <Link
                                    href={`/projects/${createdProjectId}`}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Go to Project
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center mt-8">
                {currentStep < 6 && (
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || isProcessing}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-gray-200 transition-colors ${currentStep === 1 || isProcessing
                            ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                            : "text-gray-600 bg-white hover:bg-gray-50"
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>
                )}

                {!isProcessing && (
                    <div className="flex items-center gap-4 ml-auto">
                        {currentStep === 4 && (
                            <button
                                onClick={handleNext}
                                className="text-gray-600 font-medium hover:text-gray-900 px-4 py-2"
                            >
                                Skip Calibration
                            </button>
                        )}
                        {currentStep < 5 ? (
                            <button
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 1 && !isStep1Valid) ||
                                    (currentStep === 2 && !floorPlanFile) ||
                                    (currentStep === 3 && photos.length === 0)
                                }
                                className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm ${(currentStep === 1 && !isStep1Valid) ||
                                    (currentStep === 2 && !floorPlanFile) ||
                                    (currentStep === 3 && photos.length === 0)
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-800 text-white hover:bg-blue-900"
                                    }`}
                            >
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : currentStep === 6 ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Complete
                            </Link>
                        ) : null}
                    </div>
                )}
            </div>
        </div >
    );
}
