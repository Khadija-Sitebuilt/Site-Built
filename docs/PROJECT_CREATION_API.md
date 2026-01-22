# Project Creation API Integration

## Overview

The project creation functionality has been integrated with the backend API. When users create a new project through the `/projects/new` wizard, the following data is stored in the `projects` table:

- **name**: Project name (from the wizard form)
- **description**: Project description including location and other metadata
- **owner_id**: Automatically mapped from the authenticated user's ID

## Files Modified

### `/lib/api.ts` (NEW)
API utility functions for backend integration:
- `getAuthUserId()`: Retrieves the Supabase auth user ID
- `createProject()`: Creates a project via POST `/projects` endpoint
- `getProjects()`: Fetches all projects for the authenticated user

### `/app/projects/new/page.tsx`
- Integrated real API calls instead of mock processing
- Added error handling and display
- Updated success screen to link to created project
- Stores name and description only (plans/photos handled separately)

## Authentication Flow

```
1. User signs up/logs in → Supabase Auth creates auth.users record
2. Signup handler → Creates public.users record with auth_uid
3. User creates project → Frontend gets auth user ID from Supabase
4. Frontend → Sends auth user ID in X-User-Id header to backend
5. Backend → Looks up public.users where auth_uid matches
6. Backend → Uses users.id as owner_id in projects table
```

## Environment Variables

Required in `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>

# Backend API
NEXT_PUBLIC_BACKEND_URL=https://sitebuilt-backend.onrender.com
```

## Database Schema

### `public.users`
```sql
create table public.users (
  id uuid not null primary key,
  auth_uid character varying not null,
  created_at timestamp with time zone default now(),
  constraint ix_users_auth_uid unique (auth_uid)
);
```

### `public.projects`
```sql
create table public.projects (
  id uuid not null primary key,
  owner_id uuid not null references public.users(id),
  name varchar not null,
  description text,
  created_at timestamp with time zone default now()
);
```

## Next Steps

Future enhancements could include:
- Floor plan upload API integration (POST `/projects/{id}/plans`)
- Photo upload API integration (POST `/projects/{id}/photos`)
- GPS calibration data storage
- Project metadata fields (timeline, budget, etc.)
