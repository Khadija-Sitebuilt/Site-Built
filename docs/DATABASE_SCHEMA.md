# SiteBuilt Database Schema Reference

Complete database schema for the SiteBuilt construction documentation platform.

## Overview

The database consists of 5 main tables forming a relational structure:
- `users` - User accounts linked to Supabase auth
- `projects` - Construction projects owned by users
- `plans` - Floor plan files for projects
- `photos` - Geo-tagged construction photos
- `photo_placements` - Links photos to specific locations on floor plans

---

## Tables

### `users`
User accounts that bridge Supabase authentication with application data.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | User's unique identifier in app database |
| `auth_uid` | varchar | NOT NULL, UNIQUE | Links to Supabase auth.users.id |
| `created_at` | timestamptz | DEFAULT now() | Account creation timestamp |

**Relationships:**
- One user → Many projects (via `projects.owner_id`)

**Notes:**
- `auth_uid` is indexed for fast lookups
- Created during signup process
- Maps external auth to internal user records

---

### `projects`
Construction projects that contain plans, photos, and documentation.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Project's unique identifier |
| `name` | varchar | NOT NULL | Project name |
| `description` | varchar | NULL | Project description/details |
| `owner_id` | uuid | NOT NULL, FK → users(id) | User who owns the project |
| `created_at` | timestamptz | DEFAULT now() | Project creation timestamp |

**Relationships:**
- Many projects → One user (via `owner_id`)
- One project → Many plans (via `plans.project_id`)
- One project → Many photos (via `photos.project_id`)

**API Endpoints:**
- `POST /projects` - Create new project
- `GET /projects` - List user's projects
- `GET /projects/{id}` - Get single project (not yet implemented)

---

### `plans`
Floor plan files uploaded to projects.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Plan's unique identifier |
| `project_id` | uuid | NOT NULL, FK → projects(id) | Project this plan belongs to |
| `file_url` | varchar | NOT NULL | URL/path to stored plan file |
| `width` | integer | NOT NULL | Plan image width in pixels |
| `height` | integer | NOT NULL | Plan image height in pixels |
| `created_at` | timestamptz | DEFAULT now() | Upload timestamp |

**Relationships:**
- Many plans → One project (via `project_id`)
- One plan → Many photo_placements (via `photo_placements.plan_id`)

**File Formats:**
- PDF, PNG, JPG, DXF

**API Endpoints:**
- `POST /projects/{project_id}/plans` - Upload floor plan (multipart/form-data)
- `GET /projects/{project_id}/plans` - List project plans (not yet implemented)

**Notes:**
- Width/height are extracted automatically by backend during upload
- File is stored externally; `file_url` contains the reference

---

### `photos`
Geo-tagged construction site photos with EXIF metadata.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Photo's unique identifier |
| `project_id` | uuid | NOT NULL, FK → projects(id) | Project this photo belongs to |
| `file_url` | varchar | NOT NULL | URL/path to stored photo file |
| `exif_lat` | float8 | NULL | GPS latitude from EXIF data |
| `exif_lng` | float8 | NULL | GPS longitude from EXIF data |
| `exif_timestamp` | timestamptz | NULL | Photo timestamp from EXIF |
| `created_at` | timestamptz | DEFAULT now() | Upload timestamp |

**Relationships:**
- Many photos → One project (via `project_id`)
- One photo → Many photo_placements (via `photo_placements.photo_id`)

**API Endpoints:**
- `POST /projects/{project_id}/photos` - Upload photos (planned)
- `GET /projects/{project_id}/photos` - List project photos (planned)

**Notes:**
- EXIF data (lat, lng, timestamp) extracted automatically by backend
- Used for geo-referencing and placement suggestions

---

### `photo_placements`
Junction table linking photos to specific locations on floor plans.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Placement's unique identifier |
| `photo_id` | uuid | NOT NULL, FK → photos(id) | Photo being placed |
| `plan_id` | uuid | NOT NULL, FK → plans(id) | Floor plan it's placed on |
| `x` | float8 | NOT NULL | X coordinate on plan (0-1 normalized) |
| `y` | float8 | NOT NULL | Y coordinate on plan (0-1 normalized) |
| `placement_method` | enum | NOT NULL | How the pin was placed |
| `created_at` | timestamptz | DEFAULT now() | Placement timestamp |

**Relationships:**
- Many placements → One photo (via `photo_id`)
- Many placements → One plan (via `plan_id`)

**Placement Methods:**
- `manual` - User manually placed the pin
- `gps` - Automatically placed using GPS coordinates
- `ai` - AI-suggested placement (future)

**Notes:**
- A photo can be placed on multiple plans
- Coordinates are normalized (0-1) relative to plan dimensions
- To get pixel coordinates: `pixel_x = x * plan.width`

---

## Entity Relationship Diagram

```
users (1) ──────< (many) projects
                      │
                      ├──────< (many) plans ────────┐
                      │                              │
                      └──────< (many) photos         │
                                  │                  │
                                  └──────< photo_placements >─────┘
```

## Data Flow

### User Signup
1. Supabase creates record in `auth.users`
2. Frontend creates record in `public.users` with `auth_uid`

### Project Creation
1. User authenticated via Supabase
2. Frontend sends `POST /projects` with `X-User-Id: {auth_uid}`
3. Backend looks up `users` where `auth_uid` matches
4. Backend creates project with `owner_id = users.id`

### Floor Plan Upload
1. User selects file in PlansTab
2. Frontend sends `POST /projects/{id}/plans` (multipart/form-data)
3. Backend:
   - Stores file to cloud storage
   - Extracts image dimensions
   - Creates `plans` record with `file_url`, `width`, `height`
4. Frontend displays uploaded plan

### Photo Upload (Planned)
1. User uploads photos
2. Backend extracts EXIF data (GPS, timestamp)
3. Creates `photos` records with metadata
4. Photos available for placement on plans

### Photo Placement (Planned)
1. User opens plan in Review tab
2. Drags photo pin onto plan location
3. Frontend calculates normalized coordinates
4. Creates `photo_placements` record linking photo to plan

---

## Migration Tracking

**Table:** `alembic_version`
- Tracks database schema migrations using Alembic
- Contains current migration version number

---

## Implementation Status

✅ **Implemented:**
- `users` table (signup integration)
- `projects` table (create & list)
- `plans` table (upload functionality)

🚧 **In Progress:**
- `plans` GET endpoint for fetching uploaded plans

📋 **Planned:**
- `photos` table (upload & EXIF extraction)
- `photo_placements` table (pin placement system)
- Review interface for placing pins

---

## Notes for Developers

### Foreign Key Constraints
All foreign keys use `ON DELETE CASCADE`, meaning:
- Deleting a user → deletes all their projects
- Deleting a project → deletes all its plans, photos, and photo placements
- Deleting a plan → deletes all photo placements on that plan
- Deleting a photo → deletes all its placements

### UUIDs
All primary keys use UUID v4 for:
- Distributed system compatibility
- Security (non-sequential IDs)
- No collision risk across tables

### Timestamps
All `created_at` fields use `timestamptz` (timestamp with timezone) for:
- Consistent time handling across timezones
- Automatic timezone conversion
- Sortable chronological ordering
