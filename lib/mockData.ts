// Mock data for projects, plans, and photos
// This will be replaced with real API calls once backend is ready

export interface Project {
    id: string;
    name: string;
    location: string;
    description: string;
    status: 'active' | 'archived' | 'completed';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Plan {
    id: string;
    projectId: string;
    name: string;
    fileUrl: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    uploadedAt: string;
}

export interface PhotoExif {
    latitude?: number;
    longitude?: number;
    timestamp?: string;
    cameraMake?: string;
    cameraModel?: string;
    orientation?: number;
}

export interface Detection {
    id: string;
    photoId: string;
    label: string;
    confidence: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface PinPosition {
    x: number; // X coordinate as percentage (0-100) of plan width
    y: number; // Y coordinate as percentage (0-100) of plan height
    planId: string; // Which plan this pin is on
}

export interface Photo {
    id: string;
    projectId: string;
    filename: string;
    fileUrl: string;
    thumbnailUrl: string;
    exif: PhotoExif;
    placementStatus: 'placed' | 'unplaced';
    uploadedAt: string;
    pinPosition?: PinPosition;
    detections?: Detection[];
}

export interface ProjectWithDetails extends Project {
    plans: Plan[];
    photos: Photo[];
}

// Mock projects
export const mockProjects: ProjectWithDetails[] = [
    {
        id: 'proj-001',
        name: 'Downtown Office Complex',
        location: '123 Main St, City Center',
        description: '5-story commercial building renovation project with modern amenities',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
        plans: [
            {
                id: 'plan-001',
                projectId: 'proj-001',
                name: 'Ground Floor Plan',
                fileUrl: '/images/projects/floorplan.png',
                thumbnailUrl: '/images/projects/floorplan.png',
                width: 2400,
                height: 1800,
                uploadedAt: '2024-01-20T10:30:00Z',
            },
            {
                id: 'plan-002',
                projectId: 'proj-001',
                name: 'Second Floor Plan',
                fileUrl: 'https://placehold.co/2400x1800/e5e7eb/64748b?text=Second+Floor+Plan',
                thumbnailUrl: 'https://placehold.co/400x300/e5e7eb/64748b?text=Second+Floor',
                width: 2400,
                height: 1800,
                uploadedAt: '2024-01-21T11:15:00Z',
            },
        ],
        photos: [
            {
                id: 'photo-001',
                projectId: 'proj-001',
                filename: 'entrance-view.jpg',
                fileUrl: 'https://placehold.co/1920x1080/94a3b8/1e293b?text=Entrance+View',
                thumbnailUrl: 'https://placehold.co/400x300/94a3b8/1e293b?text=Entrance',
                exif: {
                    latitude: 40.7589,
                    longitude: -73.9851,
                    timestamp: '2024-02-15T14:22:00Z',
                    cameraMake: 'Apple',
                    cameraModel: 'iPhone 13 Pro',
                },
                placementStatus: 'placed',
                uploadedAt: '2024-02-15T14:22:30Z',
                pinPosition: {
                    x: 25,
                    y: 30,
                    planId: 'plan-001'
                },
                detections: [
                    {
                        id: 'det-001',
                        photoId: 'photo-001',
                        label: 'Door Frame',
                        confidence: 0.95,
                        boundingBox: { x: 0.1, y: 0.2, width: 0.3, height: 0.6 }
                    },
                    {
                        id: 'det-002',
                        photoId: 'photo-001',
                        label: 'Signage',
                        confidence: 0.88,
                        boundingBox: { x: 0.6, y: 0.3, width: 0.15, height: 0.1 }
                    }
                ]
            },
            {
                id: 'photo-002',
                projectId: 'proj-001',
                filename: 'lobby-renovation.jpg',
                fileUrl: 'https://placehold.co/1920x1080/94a3b8/1e293b?text=Lobby+Renovation',
                thumbnailUrl: 'https://placehold.co/400x300/94a3b8/1e293b?text=Lobby',
                exif: {
                    latitude: 40.7590,
                    longitude: -73.9850,
                    timestamp: '2024-02-16T09:15:00Z',
                    cameraMake: 'Canon',
                    cameraModel: 'EOS R5',
                },
                placementStatus: 'placed',
                uploadedAt: '2024-02-16T09:20:00Z',
                pinPosition: {
                    x: 65,
                    y: 45,
                    planId: 'plan-001'
                },
            },
            {
                id: 'photo-003',
                projectId: 'proj-001',
                filename: 'ceiling-work.jpg',
                fileUrl: 'https://placehold.co/1920x1080/94a3b8/1e293b?text=Ceiling+Work',
                thumbnailUrl: 'https://placehold.co/400x300/94a3b8/1e293b?text=Ceiling',
                exif: {
                    timestamp: '2024-02-17T13:45:00Z',
                    cameraMake: 'Samsung',
                    cameraModel: 'Galaxy S21',
                },
                placementStatus: 'unplaced',
                uploadedAt: '2024-02-17T13:50:00Z',
            },
        ],
    },
    {
        id: 'proj-002',
        name: 'Riverside Apartment Complex',
        location: '456 River Rd, Waterfront District',
        description: 'New construction of 3-building residential complex',
        status: 'active',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
        createdAt: '2024-01-25T10:00:00Z',
        updatedAt: '2024-02-18T16:20:00Z',
        plans: [],
        photos: [],
    },
    {
        id: 'proj-003',
        name: 'Tech Campus Expansion',
        location: '789 Innovation Blvd, Tech Park',
        description: 'Expansion of existing tech campus with new R&D facilities',
        status: 'completed',
        startDate: '2023-06-01',
        endDate: '2023-12-31',
        createdAt: '2023-05-15T08:00:00Z',
        updatedAt: '2024-01-05T12:00:00Z',
        plans: [
            {
                id: 'plan-003',
                projectId: 'proj-003',
                name: 'Site Plan',
                fileUrl: '/samples/floor-plan-sample.png',
                thumbnailUrl: '/samples/floor-plan-thumb.png',
                width: 3000,
                height: 2000,
                uploadedAt: '2023-06-10T09:00:00Z',
            },
        ],
        photos: [],
    },
    {
        id: 'proj-004',
        name: 'Retail Mall Renovation',
        location: '100 Shopping Plaza, Suburban Center',
        description: 'Major renovation of 200,000 sq ft shopping center',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        createdAt: '2024-02-20T11:00:00Z',
        updatedAt: '2024-03-15T09:45:00Z',
        plans: [],
        photos: [],
    },
    {
        id: 'proj-005',
        name: 'Historic Building Restoration',
        location: '22 Heritage Lane, Old Town',
        description: 'Restoration of 1920s landmark building',
        status: 'archived',
        startDate: '2023-01-01',
        endDate: '2023-08-31',
        createdAt: '2022-11-10T08:00:00Z',
        updatedAt: '2023-09-15T16:00:00Z',
        plans: [],
        photos: [],
    },
    {
        id: 'proj-006',
        name: 'University Science Building',
        location: '500 Campus Dr, University District',
        description: 'New 4-story science and research facility',
        status: 'completed',
        startDate: '2022-09-01',
        endDate: '2023-12-31',
        createdAt: '2022-07-01T10:00:00Z',
        updatedAt: '2024-01-15T14:00:00Z',
        plans: [],
        photos: [],
    },
];

// Helper function to get project by ID
export function getProjectById(id: string): ProjectWithDetails | undefined {
    return mockProjects.find(project => project.id === id);
}

// Helper function to get all projects
export function getAllProjects(): Project[] {
    return mockProjects.map(({ plans, photos, ...project }) => project);
}
