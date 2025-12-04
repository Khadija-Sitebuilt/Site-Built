# Frontend Analysis - SiteBuilt MVP Roadmap

## Role: Intern B – Frontend & UX Lead

---

## 📋 Executive Summary

As the Frontend Lead, I'm responsible for building the Next.js application that serves as the user interface for SiteBuilt. The MVP needs to demonstrate the complete user journey: authentication → project management → file uploads → interactive plan viewer → review workflow → export functionality.

---

## 🎯 Key Responsibilities & Deliverables

### Primary Responsibilities:
1. **Own Next.js frontend on Vercel**
2. **Implement auth, dashboard, project view, uploads, and map/plan viewer**
3. **Implement review UI: pins on plan, photo preview, acceptance workflow**
4. **Integrate GA4 + PostHog + Sentry into frontend**

### Success Metrics (KPIs):
- ✅ 0 blocking UI bugs in the main flow by Day 30 (upload → review → export)
- ✅ Fully responsive UI (desktop and tablet; mobile acceptable but not pixel-perfect)
- ✅ At least 3 instrumented funnels tracked in GA4/PostHog

---

## 📅 Week-by-Week Breakdown

### Week 1: Foundations & Auth

**Tasks:**
- [ ] Scaffold Next.js + Tailwind app in `/frontend`
- [ ] Integrate Supabase Auth (email/password sign-up and login)
- [ ] Create base pages: `/login`, `/signup`, `/dashboard`
- [ ] Implement basic Dashboard view that lists projects from `/projects` API
- [ ] Hook up Sentry on frontend for error logging

**Key Technical Decisions:**
- Use Supabase client library for Next.js (likely `@supabase/supabase-js` with `@supabase/auth-helpers-nextjs`)
- Session management via Supabase client in Next.js
- Tailwind CSS for styling (already configured)

**Dependencies:**
- Backend must have `/projects` endpoint ready
- Need Supabase project credentials
- Need Sentry DSN

**Deliverable:** User can sign up, log in, and see a dashboard with their projects.

---

### Week 2: File Uploads & Plan Viewer

**Tasks:**
- [ ] Build "Project Detail" page with tabs/sections (Plans, Photos)
- [ ] Implement Plan upload UI:
  - Drag-and-drop component
  - Call backend to upload + register plan
  - Show list of plans with thumbnail and upload date
- [ ] Implement Photo upload UI:
  - Drag-and-drop multiple photos
  - Show upload progress and final status
- [ ] Build Plan viewer skeleton:
  - Show rasterized plan image full-width
  - Overlay empty canvas layer for pins

**Key Technical Decisions:**
- File upload library: Consider `react-dropzone` or native HTML5 drag-and-drop
- Progress tracking: Use fetch with progress events or a library like `axios` with progress callbacks
- Image display: Use Next.js `Image` component for optimization
- Canvas overlay: Use HTML5 Canvas or SVG for pin layer (SVG might be easier for interactivity)

**Dependencies:**
- Backend endpoints:
  - `POST /projects/{id}/plans`
  - `POST /projects/{id}/photos`
- Need to understand plan raster metadata format (width/height, origin, scale)
- Need Supabase Storage bucket URLs for displaying images

**Analytics Integration:**
- Track events: Project created, Plan uploaded, Photos uploaded
- Set up GA4 and PostHog basic tracking

**Deliverable:** User can upload plans and photos, see them in the UI, and view the plan image.

---

### Week 3: Placement Logic & Review UI

**Tasks:**
- [ ] Implement pin placement UI:
  - Clicking on plan creates/moves pin for selected photo
  - Send placement to backend via `POST /photos/{id}/placement`
- [ ] Implement review sidebar:
  - Left: Plan image with pins
  - Right: List of photos
  - Select photo → highlights its pin on plan
  - Show thumbnail, timestamp, EXIF data
- [ ] Add status indicators:
  - Photo "unplaced" vs "placed"
  - Filter to show only unplaced photos
- [ ] (Optional) Visualize detection stub for demo photo

**Key Technical Decisions:**
- Pin rendering: SVG pins that can be clicked/dragged, or Canvas-based
- State management: Consider Zustand or React Context for managing selected photo, pins, etc.
- Coordinate system: Need to map click coordinates to plan coordinates (considering image scaling)
- Photo selection: Highlight active pin when photo is selected

**Dependencies:**
- Backend endpoints:
  - `POST /photos/{id}/placement`
  - `GET /projects/{id}/plan/{plan_id}/photos-with-placements`
  - `GET /photos/{id}/detections` (for optional detection visualization)

**Analytics Integration:**
- Track: Pin placed, Placement adjusted, Review session started

**Deliverable:** User can place pins on the plan, see which photos are placed/unplaced, and review placements interactively.

---

### Week 4: Export & Polish

**Tasks:**
- [ ] Export UI:
  - "Export As-Built" button on project page
  - Show spinner → link to generated report (new tab)
- [ ] UI polish:
  - Clean up project detail page layout
  - Tabs: Plans / Photos / Review / Export
  - Responsive design (laptop + tablet)
  - Visual affordances for pins (hover, selected states)
- [ ] Analytics verification:
  - Confirm GA4 + PostHog events firing for main funnel

**Key Technical Decisions:**
- Export trigger: Simple button that calls `POST /projects/{id}/export` and polls for completion
- Loading states: Use loading spinner or skeleton screens
- Tab navigation: Use a tab component (could be custom or from a UI library)
- Pin styling: CSS transitions for hover/selected states

**Dependencies:**
- Backend endpoint: `POST /projects/{id}/export`
- Need to handle async export generation (polling or webhook)

**Deliverable:** Polished UI with export functionality, fully responsive, with analytics tracking.

---

## 🛠️ Technical Stack Summary

### Core Technologies:
- **Framework:** Next.js (App Router based on project structure)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (for displaying images)
- **Analytics:** GA4 + PostHog
- **Error Tracking:** Sentry
- **Hosting:** Vercel

### Key Libraries to Consider:
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-helpers-nextjs` - Auth helpers
- `react-dropzone` - File uploads
- `zustand` or React Context - State management
- `@sentry/nextjs` - Sentry integration
- `posthog-js` - PostHog integration
- `@google-analytics/gtag` or `next/script` for GA4

---

## 🎨 UI/UX Considerations

### Main User Flows:
1. **Authentication Flow:**
   - Sign up → Email verification → Login → Dashboard

2. **Project Creation Flow:**
   - Dashboard → Create Project → Project Detail Page

3. **Upload Flow:**
   - Project Detail → Upload Plan → Upload Photos → See metadata

4. **Placement Flow:**
   - Review Tab → Select Photo → Click on Plan → Pin Placed

5. **Export Flow:**
   - Export Tab → Click Export → Wait → Download/View Report

### Design Requirements:
- **Responsive:** Desktop and tablet (mobile acceptable but not pixel-perfect)
- **Visual Feedback:** Loading states, success/error messages, hover states
- **Accessibility:** Basic keyboard navigation, semantic HTML

---

## 🔗 API Integration Points

### Expected Backend Endpoints:

#### Week 1:
- `POST /projects` - Create project
- `GET /projects` - List user's projects

#### Week 2:
- `POST /projects/{id}/plans` - Upload plan
- `POST /projects/{id}/photos` - Upload photos
- Need: Plan image URLs from Supabase Storage
- Need: Photo URLs from Supabase Storage

#### Week 3:
- `POST /photos/{id}/placement` - Create/update placement
- `GET /projects/{id}/plan/{plan_id}/photos-with-placements` - Get plan with photos
- `GET /photos/{id}/detections` - Get detections (optional)

#### Week 4:
- `POST /projects/{id}/export` - Generate export
- Need: Export file URL from Supabase Storage

### Data Schemas to Agree On:
- Project object
- Plan object (with metadata: width, height, origin, scale, storage URL)
- Photo object (with EXIF: lat, lng, timestamp, storage URL)
- PhotoPlacement object (plan_id, plan_x, plan_y, placement_method)

---

## 🧪 Testing Considerations

### Frontend Testing (MVP Level):
- At least one "smoke test" for the frontend build
- Manual QA: Test main flow end-to-end
- Cross-browser: Chrome + Edge minimum

### Error Handling:
- Network errors (API failures)
- File upload errors (size, format)
- Auth errors (session expired)
- Display errors gracefully with user-friendly messages

---

## 📊 Analytics Events to Track

### Funnel Events:
1. **Project created**
2. **Plan uploaded**
3. **First photo uploaded**
4. **First pin placed**
5. **Export generated**

### Additional Events:
- Pin placed
- Placement adjusted
- Review session started
- Photo selected in review
- Filter applied (unplaced photos)

---

## ⚠️ Potential Challenges & Considerations

1. **File Upload Handling:**
   - Large files (PDFs, high-res photos)
   - Progress tracking
   - Error handling for failed uploads
   - Multiple file uploads

2. **Plan Viewer Coordinate Mapping:**
   - Converting click coordinates to plan coordinates
   - Handling image scaling/zooming
   - Maintaining pin positions on resize

3. **State Management:**
   - Managing selected photo, pins, placements
   - Syncing with backend
   - Optimistic updates

4. **Performance:**
   - Loading large plan images
   - Rendering many pins
   - Image optimization

5. **Real-time Updates:**
   - If multiple users work on same project (not in MVP scope, but consider for future)

---

## 🚀 Next Steps (Post-MVP)

### V2 Features to Consider:
- ArUco / feature-based alignment UI
- Real-time object detection visualization
- BIM/IFC integration UI
- Multi-tenant roles and permissions UI
- Advanced filtering and search
- Batch operations (bulk pin placement, etc.)

---

## 📝 Notes & Questions for Backend Team

1. **File Upload:**
   - Should we upload directly to Supabase Storage from frontend, or through backend?
   - What are the file size limits?
   - What formats are accepted?

2. **Plan Metadata:**
   - What coordinate system are we using? (pixels, meters, etc.)
   - How do we handle different plan scales?

3. **Export:**
   - Is export generation synchronous or async?
   - How do we know when export is ready?
   - What format should we expect? (HTML, PDF, both?)

4. **GPS-Assisted Placement:**
   - How does the reference point work?
   - What's the expected accuracy?

5. **Error Responses:**
   - What's the standard error response format from backend?

---

## ✅ Definition of Done Checklist (Frontend)

By Day 30, the frontend is "done" if:

- [ ] User can sign up and log in
- [ ] User can create and view projects
- [ ] User can upload plans and see them displayed
- [ ] User can upload photos and see EXIF metadata
- [ ] User can place pins on plans
- [ ] User can review placements (select photo → see pin)
- [ ] User can export As-Built report
- [ ] UI is responsive (desktop + tablet)
- [ ] No blocking bugs in main flow
- [ ] Sentry is capturing errors
- [ ] GA4 + PostHog are tracking main funnel
- [ ] At least 2 end-to-end test projects completed
- [ ] Code is deployed to Vercel and accessible

---

## 📚 Resources & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [PostHog Docs](https://posthog.com/docs)
- [GA4 Setup](https://developers.google.com/analytics/devguides/collection/ga4)

