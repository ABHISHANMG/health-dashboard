# MedFlow | Healthcare Dashboard

A B2B Healthcare SaaS dashboard built with React, demonstrating frontend architecture, real-world authentication, service worker notifications, and responsive design patterns.

## What We Built

### Authentication (Firebase)
- **Google OAuth** sign-in via popup with one-click login
- **Email/Password** registration and login with full form validation
- Field-level error messages with on-blur validation
- Password strength indicator (Weak / Fair / Strong)
- Firebase error codes mapped to user-friendly messages
- Session persistence via `browserLocalPersistence` — survives tab close and browser restarts
- `onAuthStateChanged` listener auto-restores session on page load
- Protected routes redirect unauthenticated users to `/login`
- Loading spinner while auth state resolves

### Dashboard
- KPI stat cards with trend indicators (patients, revenue, satisfaction)
- Revenue overview area chart (Revenue vs Expenses, 12-month)
- Department distribution donut chart
- Upcoming appointments table
- Real-time activity feed

### Patients (Grid + List View)
- **Toggle switch** to switch between Grid View and List View
- **Grid View** — responsive card layout with color-coded risk accent bars, avatars, badges, and patient details
- **List View** — compact row layout with column headers, inline contact info, and status badges
- Multi-filter system: search by name/ID, filter by status, department, and risk level
- Patient detail modal with two-column layout
- Empty state handling when no results match

### Analytics
- Monthly revenue trend (line chart)
- Insurance distribution (pie chart)
- Department revenue (bar chart)
- Appointments by day of week (bar chart)
- Patient age distribution (bar chart)

### Notifications (Service Worker)
- Custom service worker (`public/sw.js`) with install, activate, fetch, push, and message handlers
- Network-first caching strategy with cache fallback for offline support
- `useNotifications` custom hook — handles SW registration, permission state, and notification dispatch
- **3 working notification use cases:**
  1. Appointment confirm/cancel triggers both in-app + OS-level push notification
  2. Timed appointment reminder fires automatically 60s after login
  3. Test notification button in header sends a critical patient alert
- Permission UX: gradient banner for `default` state, muted icon for `denied` state
- Unread count badge on bell icon
- Scrollable notification dropdown with mark-all-read
- Notification click handler focuses existing tab or opens the app

### Mobile Responsive
- **Hamburger menu** on mobile — sidebar slides in as a full-height overlay
- Dark backdrop overlay with click-to-close
- X close button inside sidebar
- Nav links auto-close the mobile menu
- Separate `mobileMenuOpen` state from desktop `sidebarCollapsed`
- All grids, tables, and filters adapt to mobile breakpoints
- Page headers stack vertically on small screens

## Tech Stack & Packages

| Package | Version | Purpose |
|---|---|---|
| **react** | ^19.2.5 | UI library |
| **react-dom** | ^19.2.5 | DOM rendering |
| **react-router-dom** | ^7.14.2 | Client-side routing with protected routes |
| **firebase** | ^12.12.1 | Authentication (Google OAuth + Email/Password) |
| **recharts** | ^3.8.1 | Data visualization (area, bar, line, pie charts) |
| **lucide-react** | ^1.11.0 | Icon system (consistent, tree-shakeable SVG icons) |
| **react-scripts** | 5.0.1 | Build tooling (Create React App) |

## Project Structure

```
src/
  context/
    AppContext.js          # Global state (patients, notifications, sidebar, filters)
    AuthContext.js         # Firebase auth state (user, login, logout)
  components/
    layout/
      Layout.js            # App shell (sidebar + header + outlet)
      Sidebar.js           # Navigation with mobile hamburger support
      Header.js            # Search, notifications, user avatar, logout
    dashboard/
      StatCard.js           # KPI card with trend indicator
      RevenueChart.js       # Area chart (revenue vs expenses)
      DepartmentChart.js    # Donut chart (patients by department)
      RecentAppointments.js # Upcoming appointments table
      ActivityFeed.js       # Recent activity timeline
    common/
      ProtectedRoute.js     # Auth guard with loading state
  pages/
    Login.js               # Google + Email/Password auth
    Dashboard.js           # KPI overview page
    Patients.js            # Grid/List view with filters + detail modal
    Analytics.js           # Charts and data insights
  hooks/
    useNotifications.js    # Service worker + notification API hook
  data/
    mockData.js            # Mock patients, appointments, doctors, stats
  firebase.js              # Firebase config and auth exports
  styles/
    index.css              # Full design system (CSS custom properties)
public/
  sw.js                    # Service worker (caching, push, notification click)
```

## Best Practices

### Architecture
- **Component-based architecture** — small, focused components with single responsibilities
- **Context + useReducer** for global state — predictable state updates without external libraries
- **Separation of concerns** — data, context, hooks, components, and pages in dedicated directories
- **Custom hooks** (`useNotifications`) to encapsulate complex browser API logic

### Authentication & Security
- Firebase API keys stored in `.env` file, excluded via `.gitignore`
- `.env.example` provided as a template (no secrets committed)
- Protected routes at the router level — not just UI hiding
- Auth state checked on every route change via `onAuthStateChanged`
- Firebase error codes handled exhaustively with user-friendly messages

### State Management
- `useReducer` over `useState` for complex state with multiple related actions
- `useCallback` on all dispatch wrappers to prevent unnecessary re-renders
- `useMemo` for derived/filtered data (patient filtering)
- Separate state for mobile menu vs desktop sidebar collapse

### Performance
- **Service Worker** with network-first caching for offline resilience
- **Tree-shakeable** icon imports from lucide-react (only import what you use)
- No unnecessary re-renders — memoized callbacks and derived state
- CSS transitions over JavaScript animations for layout changes

### UX & Accessibility
- Form validation with on-blur feedback and inline error messages
- Loading states for auth operations (disabled buttons, "Please wait...")
- Empty states with helpful messages when data/search returns nothing
- Click-outside-to-close for dropdowns and modals
- Notification permission requested contextually (not on page load)
- `title` attributes on icon-only buttons for screen readers

### Responsive Design
- **Mobile-first** media queries at 768px and 1200px breakpoints
- CSS Grid with `auto-fill` and `minmax()` for fluid card layouts
- Hamburger overlay pattern on mobile — not just a collapsed sidebar
- Tables hide less-important columns progressively at smaller breakpoints
- Filters stack vertically on mobile

### Code Quality
- Consistent naming conventions (PascalCase components, camelCase functions)
- No inline styles for reusable patterns — CSS custom properties as design tokens
- Centralized mock data for easy replacement with real APIs
- Clean import structure — no unused imports

## Getting Started

```bash
# Install dependencies
npm install

# Add your Firebase config
cp .env.example .env
# Fill in your Firebase credentials in .env

# Start development server
npm start

# Production build
npm run build
```

## Deployment (Cloudflare Pages)

This application is deployed on **Cloudflare Pages** for fast global delivery via Cloudflare's edge network.

### Why Cloudflare Pages
- **Global CDN** — assets served from 300+ edge locations worldwide, sub-50ms TTFB
- **Automatic HTTPS** — SSL certificates provisioned and renewed automatically
- **Zero cold starts** — static assets served instantly, no server spin-up
- **Free tier** — unlimited bandwidth, 500 builds/month
- **Git integration** — auto-deploys on every push to `main`
- **Preview deployments** — every PR gets a unique preview URL

### Deploy Steps

#### Option 1: Git Integration (Recommended)

1. Push the repository to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages**
3. Connect your GitHub account and select the repository
4. Configure build settings:
   - **Framework preset:** Create React App
   - **Build command:** `npm run build`
   - **Build output directory:** `build`
5. Add environment variables under **Settings > Environment variables**:
   ```
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
6. Click **Save and Deploy** — Cloudflare builds and deploys automatically
7. Every subsequent push to `main` triggers a new deployment

#### Deployment

Vercel deployment CI/CD setup by auto deploy by github pushes


## Environment Variables

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```
