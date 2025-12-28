import { supabase } from './supabase';
import { extractExifData } from './exif';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sitebuilt-backend.onrender.com';

/**
 * Get the authenticated user's auth ID from Supabase
 */
export async function getAuthUserId(): Promise<string | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('Error getting auth user:', error);
        return null;
    }

    return user.id;
}

/**
 * Create headers with authentication
 */
async function getAuthHeaders(): Promise<HeadersInit> {
    const authUserId = await getAuthUserId();

    if (!authUserId) {
        throw new Error('User not authenticated');
    }

    return {
        'Content-Type': 'application/json',
        'X-User-Id': authUserId,
    };
}

export interface CreateProjectData {
    name: string;
    description?: string;
}

export interface Project {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export interface Plan {
    id: string;
    project_id: string;
    file_url: string;
    width: number;
    height: number;
    created_at: string;
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: data.name,
                description: data.description || '',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to create project: ${response.statusText}`);
        }

        const project: Project = await response.json();
        return project;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

/**
 * Get all projects for the authenticated user
 */
export async function getProjects(): Promise<Project[]> {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch projects: ${response.statusText}`);
        }

        const projects: Project[] = await response.json();
        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export interface PhotoPlacement {
    id: string;
    photo_id: string;
    plan_id: string;
    x: number;
    y: number;
    placement_method: 'manual' | 'gps';
    created_at: string;
}

/**
 * Save a photo placement (Create or Update)
 * Checks if a placement exists for the photo. If so, updates it. If not, creates new.
 */
export async function savePhotoPlacement(
    placement: Omit<PhotoPlacement, 'id' | 'created_at'>
): Promise<PhotoPlacement> {
    try {
        // Check if placement already exists for this photo
        const { data: existingPlacement } = await supabase
            .from('photo_placements')
            .select('id')
            .eq('photo_id', placement.photo_id)
            .maybeSingle();

        let result;

        if (existingPlacement) {
            // Update existing
            const { data, error } = await supabase
                .from('photo_placements')
                .update({
                    plan_id: placement.plan_id,
                    x: placement.x,
                    y: placement.y,
                    placement_method: placement.placement_method
                })
                .eq('id', existingPlacement.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('photo_placements')
                .insert({
                    id: crypto.randomUUID(),
                    ...placement
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return result;
    } catch (error: any) {
        console.error('Error saving photo placement:', error);
        throw new Error(`Failed to save placement: ${error.message}`);
    }
}

/**
 * Get all photo placements for a project (by getting all placements for all project plans)
 * Note: This is a bit inefficient without a direct project_id link, but strictly follows schema.
 * Better approach: Join with plans table to filter by project_id.
 */
export async function getProjectPlacements(projectId: string): Promise<PhotoPlacement[]> {
    try {
        // First get all plans for the project
        const plans = await getPlans(projectId);
        const planIds = plans.map(p => p.id);

        if (planIds.length === 0) return [];

        // Then get placements for these plans
        const { data, error } = await supabase
            .from('photo_placements')
            .select('*')
            .in('plan_id', planIds);

        if (error) {
            throw new Error(error.message);
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching placements:', error);
        throw error;
    }
}

/**
 * Get a single project by ID
 * Note: Backend doesn't have GET /projects/{id} yet, so we fetch all and filter
 */
export async function getProject(id: string): Promise<Project> {
    try {
        // Fetch all projects and find the one with matching ID
        const projects = await getProjects();
        const project = projects.find(p => p.id === id);

        if (!project) {
            throw new Error('Project not found');
        }

        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}

/**
 * Upload a floor plan to a project (directly to Supabase Storage)
 */
export async function uploadPlan(projectId: string, file: File): Promise<Plan> {
    try {
        const authUserId = await getAuthUserId();

        if (!authUserId) {
            throw new Error('User not authenticated');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('plans')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('plans')
            .getPublicUrl(fileName);

        // Get image dimensions (for images)
        let width = 0;
        let height = 0;

        if (file.type.startsWith('image/')) {
            const dimensions = await getImageDimensions(file);
            width = dimensions.width;
            height = dimensions.height;
        } else {
            // For PDFs and DXF, use placeholder dimensions
            // These would ideally be extracted by backend processing
            width = 1920;
            height = 1080;
        }

        // Create plan record in database
        const { data: planData, error: dbError } = await supabase
            .from('plans')
            .insert({
                id: crypto.randomUUID(),
                project_id: projectId,
                file_url: publicUrl,
                width: width,
                height: height,
            })
            .select()
            .single();

        if (dbError) {
            // If database insert fails, try to delete the uploaded file
            await supabase.storage.from('plans').remove([fileName]);
            throw new Error(`Failed to create plan record: ${dbError.message}`);
        }

        return planData;
    } catch (error) {
        console.error('Error uploading plan:', error);
        throw error;
    }
}

/**
 * Helper function to get image dimensions
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Get all plans for a project (directly from Supabase)
 */
export async function getPlans(projectId: string): Promise<Plan[]> {
    try {
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching plans:', error);
        throw error;
    }
}

export interface Photo {
    id: string;
    project_id: string;
    file_url: string;
    exif_lat?: number;
    exif_lng?: number;
    exif_timestamp?: string;
    created_at: string;
}

// ... existing functions ...

/**
 * Upload a photo to a project (directly to Supabase Storage)
 */
export async function uploadPhoto(projectId: string, file: File): Promise<Photo> {
    try {
        const authUserId = await getAuthUserId();

        if (!authUserId) {
            throw new Error('User not authenticated');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Failed to upload photo: ${uploadError.message}`);
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);

        // Extract EXIF data
        const exifData = await extractExifData(file);

        // Create photo record in database
        const { data: photoData, error: dbError } = await supabase
            .from('photos')
            .insert({
                id: crypto.randomUUID(),
                project_id: projectId,
                file_url: publicUrl,
                exif_lat: exifData.latitude,
                exif_lng: exifData.longitude,
                exif_timestamp: exifData.timestamp,
            })
            .select()
            .single();

        if (dbError) {
            // If database insert fails, try to delete the uploaded file
            await supabase.storage.from('photos').remove([fileName]);
            throw new Error(`Failed to create photo record: ${dbError.message}`);
        }

        return photoData;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

/**
 * Get all photos for a project (directly from Supabase)
 */
export async function getPhotos(projectId: string): Promise<Photo[]> {
    try {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
}
