import { supabase } from './supabase';
import { extractExifData } from './exif';
import { generateRandomPlacement } from "./placement-utils";

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
    is_active: boolean;
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

/**
 * Get all projects with stats (plans, photos, etc) in a single efficient query.
 * This replaces the N+1 fetch pattern in the dashboard.
 */
export async function getProjectsWithStats(): Promise<any[]> {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                plans (
                    id, 
                    file_url, 
                    created_at,
                    photo_placements (photo_id)
                ),
                photos (
                    id, 
                    file_url, 
                    created_at,
                    exif_timestamp
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error: any) {
        console.error('Error fetching projects with stats:', error);
        throw new Error(error.message);
    }
}

/**
 * Delete a project and all associated resources (plans, photos, placements)
 */
export async function deleteProject(projectId: string): Promise<void> {
    try {
        const headers = await getAuthHeaders();

        // 1. Fetch file URLs before deleting DB records so we can clean up storage
        const { data: plans } = await supabase
            .from('plans')
            .select('file_url')
            .eq('project_id', projectId);

        const { data: photos } = await supabase
            .from('photos')
            .select('file_url')
            .eq('project_id', projectId);

        // 2. Delete project from database (Cascade should handle DB records)
        const { error: deleteError } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        // 3. Clean up Storage Files
        // Delete Plans
        const planFiles = plans?.map(p => {
            const urlParts = p.file_url.split('/plans/');
            return urlParts[1];
        }).filter(Boolean) || [];

        if (planFiles.length > 0) {
            await supabase.storage.from('plans').remove(planFiles);
        }

        // Delete Photos
        const photoFiles = photos?.map(p => {
            const urlParts = p.file_url.split('/photos/');
            return urlParts[1];
        }).filter(Boolean) || [];

        if (photoFiles.length > 0) {
            await supabase.storage.from('photos').remove(photoFiles);
        }

    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

export interface PhotoPlacement {
    id: string;
    photo_id: string;
    plan_id: string;
    x: number;
    y: number;
    placement_method: 'manual' | 'gps_suggested' | 'gps_exact';
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
 * Delete a photo placement (Unpin)
 */
export async function deletePhotoPlacement(photoId: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('photo_placements')
            .delete()
            .eq('photo_id', photoId);

        if (error) {
            throw new Error(error.message);
        }
    } catch (error: any) {
        console.error('Error deleting photo placement:', error);
        throw new Error(`Failed to delete placement: ${error.message}`);
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
 * Get a single project with full stats (plans, photos, counts) in one query.
 * Optimization for project view page.
 */
export async function getProjectWithStats(projectId: string): Promise<any> {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                plans (
                    id, 
                    file_url, 
                    created_at,
                    photo_placements (photo_id)
                ),
                photos (
                    id, 
                    file_url, 
                    created_at,
                    exif_timestamp,
                    photo_placements (id, plan_id)
                )
            `)
            .eq('id', projectId)
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error('Error fetching project with stats:', error);
        throw new Error(error.message);
    }
}

/**
 * Set a plan as the active plan for a project
 * This sets is_active=false for all other plans in the project, then is_active=true for the target plan.
 * IMPORTANT: This also deletes all photo placements on the old active plan.
 */
export async function setPlanActive(projectId: string, planId: string): Promise<void> {
    try {
        // 1. Get the current active plan ID
        const { data: currentActivePlan } = await supabase
            .from('plans')
            .select('id')
            .eq('project_id', projectId)
            .eq('is_active', true)
            .single();

        // 2. Reset all plans for this project to inactive
        const { error: resetError } = await supabase
            .from('plans')
            .update({ is_active: false })
            .eq('project_id', projectId);

        if (resetError) throw new Error(resetError.message);

        // 3. Set the target plan to active
        const { error: setError } = await supabase
            .from('plans')
            .update({ is_active: true })
            .eq('id', planId);

        if (setError) throw new Error(setError.message);

        // 4. Delete all photo placements on the old active plan
        if (currentActivePlan && currentActivePlan.id !== planId) {
            const { error: deleteError } = await supabase
                .from('photo_placements')
                .delete()
                .eq('plan_id', currentActivePlan.id);

            if (deleteError) {
                console.error('Error deleting photo placements:', deleteError);
                // Don't throw - plan was already changed, just log the error
            }
        }

    } catch (error: any) {
        console.error('Error setting active plan:', error);
        throw new Error(`Failed to update active plan: ${error.message}`);
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

        // Check if this is the first plan (to set as active default)
        const { count } = await supabase
            .from('plans')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', projectId);

        const isFirstPlan = count === 0;

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
                is_active: isFirstPlan // Auto-set active if it's the first one
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

/**
 * Delete a plan (also deletes associated photo_placements via CASCADE)
 */
export async function deletePlan(planId: string): Promise<void> {
    try {
        // First get the plan to find the file URL
        const { data: plan, error: fetchError } = await supabase
            .from('plans')
            .select('file_url')
            .eq('id', planId)
            .single();

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        // Delete from database (CASCADE deletes photo_placements)
        const { error: deleteError } = await supabase
            .from('plans')
            .delete()
            .eq('id', planId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        // Delete file from storage
        if (plan?.file_url) {
            // Extract file path from URL
            // URL format: https://.../storage/v1/object/public/plans/{path}
            const urlParts = plan.file_url.split('/plans/');
            if (urlParts[1]) {
                await supabase.storage
                    .from('plans')
                    .remove([urlParts[1]]);
            }
        }
    } catch (error) {
        console.error('Error deleting plan:', error);
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
export async function uploadPhoto(
    projectId: string,
    file: File,
    autoPlace?: { planId: string; planWidth: number; planHeight: number }
): Promise<Photo> {
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

        // Handle Auto-Placement if requested
        if (autoPlace && photoData) {
            try {
                const { x, y } = generateRandomPlacement(autoPlace.planWidth, autoPlace.planHeight);

                await savePhotoPlacement({
                    plan_id: autoPlace.planId,
                    photo_id: photoData.id,
                    x,
                    y,
                    placement_method: 'gps_suggested'
                });
            } catch (err) {
                console.error("Auto-placement failed:", err);
                // Don't fail the entire upload if placement fails, just log it
            }
        }

        return photoData;
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
}

/**
 * Delete multiple photos
 */
export async function deletePhotos(photoIds: string[]): Promise<void> {
    try {
        // 1. Get file URLs to delete from storage
        const { data: photos, error: fetchError } = await supabase
            .from('photos')
            .select('file_url')
            .in('id', photoIds);

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        // 2. Delete from database (CASCADE should handle placements if set up, 
        // otherwise we might need to delete placements first. Assuming CASCADE for now)
        const { error: deleteError } = await supabase
            .from('photos')
            .delete()
            .in('id', photoIds);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        // 3. Delete files from storage
        const filesToDelete = photos
            ?.map(p => {
                const urlParts = p.file_url.split('/photos/');
                return urlParts[1];
            })
            .filter(Boolean) || [];

        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('photos')
                .remove(filesToDelete);

            if (storageError) {
                console.error('Error deleting files from storage:', storageError);
                // Don't throw here, as DB records are already gone
            }
        }
    } catch (error) {
        console.error('Error deleting photos:', error);
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

/**
 * Export a project (generates HTML report)
 */
export async function exportProject(projectId: string): Promise<{ project_id: string; export_url: string }> {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/export`, {
            method: 'POST',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to export project: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error exporting project:', error);
        throw error;
    }
}
