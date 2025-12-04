# SiteBuilt – 30-Day MVP Roadmap

## Internal Developer Execution Plan (2 Dev Interns)

### Executive Summary

In 30 days, the goal is to ship a working MVP that proves the core SiteBuilt loop:

**Upload floor plan → Upload geo-tagged photos → Extract EXIF → Place photos on the plan (GPS + manual adjust) → Review placements in a web UI → Export a simple, shareable As-Built report.**

This is a proof of concept, not the full system. MEP detection and BIM integration will be stubs or very basic, but the full "feel" of the product should be real: real uploads, real EXIF, real plan viewer, real review flow, and a basic export.

---

## Infrastructure Overview

### Frontend Hosting:
- Next.js + Tailwind on Vercel
- GA4 + PostHog for analytics and behavior tracking

### Backend Hosting:
- FastAPI on Render (single service for API + background jobs for now)

### Database & Auth:
- Supabase (PostgreSQL + Auth)
- Supabase Storage for plans and photos (no S3 complexity in Month 1)

### CV / Processing Stack (MVP level):
- Python + FastAPI backend
- OpenCV for EXIF extraction helper and image utilities
- Optional: Ultralytics YOLOv8 as a "preview only" endpoint (1–2 demo images) or stubbed detection responses

### Monitoring & Observability:
- Sentry for frontend + backend error tracking
- Supabase logs + Render logs
- GA4 + PostHog for funnel and session analytics

### CI/CD & Version Control:
- GitHub repo (monorepo: /frontend, /backend)
- GitHub Actions for: tests + lint + auto-deploy to Vercel and Render on main branch

---

## Team Composition & KPIs

### Intern A – Backend & Infra Lead

**Responsibilities:**
- Own FastAPI service on Render
- Implement core APIs: project, plan, photo, EXIF extraction, placement storage
- Wire Supabase DB + Auth + Storage
- Integrate Sentry on backend and expose basic health/metrics endpoints

**KPIs:**
- All core APIs documented in OpenAPI by Day 30
- 90%+ of API endpoints covered by automated tests (unit + basic integration)
- End-to-end flow latency for a single photo (upload → EXIF → stored) under 3 seconds in test

### Intern B – Frontend & UX Lead

**Responsibilities:**
- Own Next.js frontend on Vercel
- Implement auth, dashboard, project view, uploads, and map/plan viewer
- Implement review UI: pins on plan, photo preview, acceptance workflow
- Integrate GA4 + PostHog + Sentry into frontend

**KPIs:**
- 0 blocking UI bugs in the main flow by Day 30 (upload → review → export)
- Fully responsive UI (desktop and tablet; mobile acceptable but not pixel-perfect)
- At least 3 instrumented funnels tracked in GA4/PostHog (e.g. "Create Project → Upload Plan → Upload Photos → Export")

---

## MVP Scope (What We Actually Build In 30 Days)

### In scope for this month:
- Supabase-backed multi-project structure (no deep RBAC yet, just user-level separation)
- Upload floor plans (PDF → single page PNG) and store raster in Supabase Storage
- Upload photos (JPEG) with EXIF extraction on backend
- Basic mapping:
  - Phase 1: manual pin placement
  - Phase 2: if EXIF GPS present, auto-drop approximate pin and allow drag to correct
- Simple review UI: list of photos, click to highlight pins and open preview
- Simple "As-Built" HTML/PDF export:
  - Floor plan image with numbered pins
  - Table of photos: ID, timestamp, coordinates, reviewer
- Minimal MEP detection: either a fake/stubbed endpoint or run YOLOv8 on 1–2 bundled sample images only, clearly labeled "demo only"

### Out of scope this month (explicitly):
- Full BIM / IFC integration
- Real-time large-scale object detection across arbitrary uploads
- ArUco marker / feature-matching registration
- Complex multi-tenant billing and roles

---

## Weekly Milestones (0–30 Days)

### Week 1 – Foundations, Repo, Auth, and Basic Data Model

**Objectives:**
Get the scaffolding right so you are not refactoring everything in Week 3.

#### Intern A – Backend/Infra
- Set up FastAPI project structure in /backend with:
  - Basic health endpoint /health
  - Config loading (env-based) for Supabase and Render
- Connect backend to Supabase Postgres:
  - Define initial tables (via SQL or Prisma/SQLAlchemy migrations):
    - users (map to Supabase auth UID)
    - projects
    - plans
    - photos
    - photo_placements
- Implement simple endpoints:
  - POST /projects (create)
  - GET /projects (list for current user)
- Configure Render service:
  - Auto deploy on main
  - Health check passing

#### Intern B – Frontend/UX
- Scaffold Next.js + Tailwind app in /frontend
- Integrate Supabase Auth:
  - Email/password sign-up and login
  - Keep session in Next.js using Supabase client
- Create base pages:
  - /login, /signup, /dashboard
- Implement a basic Dashboard view that lists projects from /projects API
- Hook up Sentry on frontend for error logging

#### Joint Tasks
- Set up GitHub repo (monorepo) and GitHub Actions:
  - Lint + basic test workflow
  - Auto-deploy frontend to Vercel, backend to Render on merge to main
- Agree on JSON schemas for:
  - Project
  - Plan
  - Photo
  - PhotoPlacement

**Week 1 KPIs:**
- Both apps deploy successfully (Vercel + Render)
- User can sign up, log in, and create a project that persists in Supabase
- CI pipeline green on main

---

### Week 2 – File Uploads, EXIF Extraction, and Plan Viewer Skeleton

**Objectives:**
Support real plan + photo uploads, store metadata, and show the plan in the UI.

#### Intern A – Backend/Infra
- Integrate Supabase Storage:
  - Bucket plans for plan images
  - Bucket photos for uploaded photos
- Implement plan upload:
  - Endpoint POST /projects/{id}/plans:
    - Accepts file metadata and Supabase Storage path
    - Simple PDF handling:
      - Client sends PDF → backend uses pdf2image to convert first page to PNG
      - Store PNG in plans bucket, persist URL and dimensions in DB
- Implement photo upload endpoint:
  - POST /projects/{id}/photos to register uploaded file path and enqueue EXIF extraction
- Implement EXIF extraction worker function (still synchronous is fine):
  - Use Pillow + piexif to parse GPS, timestamp, orientation:
    - Save exif_lat, exif_lng, timestamp into photos table

#### Intern B – Frontend/UX
- Build "Project Detail" page:
  - Tabs or sections:
    - "Plans"
    - "Photos"
- Implement Plan upload UI:
  - Drag-and-drop component
  - Call backend to upload + register plan
  - Show list of plans with thumbnail and upload date
- Implement Photo upload UI:
  - Drag-and-drop multiple photos
  - Show upload progress and final status
- Build Plan viewer skeleton:
  - Show the rasterized plan image full-width in a container
  - Overlay an empty canvas layer where pins will eventually go

#### Joint Tasks
- Agree on format for plan raster metadata:
  - Width/height in pixels
  - Origin and scale defaults (for now, simple 0,0 in top-left, 1 unit = 1 pixel)
- Add GA4 + PostHog basic tracking in frontend:
  - Track events for:
    - Project created
    - Plan uploaded
    - Photos uploaded

**Week 2 KPIs:**
- User flow: login → create project → upload plan PDF → see rasterized plan thumbnail and view
- User flow: upload photos → see them listed with parsed EXIF (lat/lng visible in UI table)
- EXIF parsing successful on at least 2 real sample photos from a device you care about

---

### Week 3 – Placement Logic, Review UI, and Basic "Detection" Stub

**Objectives:**
Make the system feel like SiteBuilt: pins on a plan and a review experience.

#### Intern A – Backend/Infra
- Implement simple placement logic:
  - Phase 1: Manual-only
    - Endpoint POST /photos/{id}/placement
    - Accepts plan_id, plan_x, plan_y, placement_method="manual"
  - Phase 2: GPS-assisted stub
    - If photo has EXIF lat/lng and project has a simple "reference point" (e.g. set manually once per project), compute rough plan_x, plan_y using a constant scale, and return as a suggestion
- Implement listing APIs:
  - GET /projects/{id}/plan/{plan_id}/photos-with-placements
    - Returns plan metadata + photos + their placements
- Implement basic detection stub endpoint:
  - GET /photos/{id}/detections
    - For MVP: either:
      - Return a hardcoded list of fake detections for a test photo id, or
      - Run YOLOv8 on a single included sample image just as a tech preview
    - Store detection records in DB if you decide to persist

#### Intern B – Frontend/UX
- Implement pin placement UI:
  - In plan viewer, clicking on the plan creates/moves a pin for the selected photo
  - Send placement to backend via POST /photos/{id}/placement
- Implement review sidebar:
  - Left: Plan image with pins
  - Right: List of photos
  - Select a photo → highlights its pin on the plan
  - Show thumbnail, timestamp, EXIF data
- Add basic status indicators:
  - Photo "unplaced" vs "placed"
  - Small filter to show only unplaced photos
- (Optional if time) Visualize detection stub:
  - For a specific demo photo, show detection bounding boxes or icons in the photo viewer pane

#### Joint Tasks
- Add basic Sentry context:
  - Tag user id and project id on errors
  - Log EXIF parsing failures and placement errors
- Add analytics events:
  - Pin placed
  - Placement adjusted
  - Review session started

**Week 3 KPIs:**
- User can:
  - Open a project
  - See plan
  - Select a photo and drop a pin for it on the plan
  - See which photos are still unplaced
- GPS-assisted suggestion returns something non-nonsense for at least one test project where you manually set a reference

---

### Week 4 – Export, Polish, QA, and Demo Prep

**Objectives:**
Make it look like a product, not a science fair project.

#### Intern A – Backend/Infra
- Implement basic export:
  - Endpoint POST /projects/{id}/export
    - Generates an HTML or PDF file with:
      - Plan image
      - Numbered pins (e.g. 1..N)
      - Table: photo ID, timestamp, coordinates, placement method
    - Store export in Supabase Storage and return URL
- Harden APIs:
  - Basic auth guards (project scoped to current user)
  - Input validation (pydantic schemas)
  - Error responses with consistent structure
- Add a small suite of automated tests:
  - Project creation, plan upload (mocked), photo registration, placement creation, export creation

#### Intern B – Frontend/UX
- Export UI:
  - "Export As-Built" button on project page
  - Show spinner → then link to generated report (new tab)
- UI polish:
  - Clean up layout of project detail page:
    - Tabs: Plans / Photos / Review / Export
  - Make sure it scales to laptop + tablet
  - Visual affordances for pins (hover state, selected state)
- Analytics & UX:
  - Confirm GA4 + PostHog events are firing for main funnel:
    - Project created
    - Plan uploaded
    - First photo uploaded
    - First pin placed
    - Export generated

#### Joint Tasks
- QA checklist:
  - Test 2–3 dummy projects end-to-end
  - Cross-browser test: at least Chrome + Edge
  - Try "bad" inputs:
    - No EXIF photo
    - Corrupted PDF
    - Oversized image
- Create a short internal demo script:
  - 3–5 minute flow from login to export

**Week 4 KPIs:**
- End-to-end scenario works without manual database hacking
- Export file is usable and readable by a project manager
- No critical console errors in frontend during normal usage

---

## Definition of Done (Day 30)

By Day 30, the SiteBuilt MVP is considered "done for internal POC" if all of the following are true:

### Core Flow Works
- A new user can sign up, log in, and create a project.
- They can upload at least one floor plan PDF and see it rasterized as a PNG in the app.
- They can upload multiple photos and see EXIF metadata extracted (where present).
- They can place photos on the plan via pins and see which ones are unplaced.

### Review & Export Are Real
- The review screen shows the plan with pins and a list of photos.
- Clicking a photo highlights its location on the plan.
- The user can trigger an export and receive an HTML or PDF As-Built report with:
  - Plan snapshot
  - Pin numbers
  - Table of photo metadata and coordinates

### Technical Foundations Are Acceptable
- Backend is live on Render with FastAPI and connected to Supabase (DB + Storage).
- Frontend is live on Vercel with Supabase Auth.
- Sentry is capturing errors from both frontend and backend.
- GA4 and PostHog are capturing at least the main funnel and 3–5 key events.

### Quality Bar
- No blocking bugs in the main happy path (login → create project → upload plan → upload photos → place pins → export).
- At least a basic automated test suite for core APIs and one "smoke test" for the frontend build.
- At least 2 internal trial projects have been run end-to-end.

### Clear Next Steps
A short list of "v2" items documented:
- ArUco / feature-based alignment
- Real object detection in photos
- BIM/IFC linking
- Multi-tenant roles and proper pricing page integration

