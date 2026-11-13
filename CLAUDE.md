# SalesPulse — Multi-Tenant SaaS Analytics Platform

SalesPulse is a multi-tenant SaaS analytics platform.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, next-themes
- **UI Components & Icons**: shadcn/ui, Lucide icons
- **Charts & Visualization**: Recharts
- **Forms & Validation**: React Hook Form, Zod
- **Data Fetching & State**: TanStack Query

## Project Structure
The project has no `src/` folder. Root directories include:
- `app/` — Next.js App Router (pages, layouts, route handlers, server actions)
- `components/` — Application and feature components
  - `components/ui/` — Base shadcn/ui primitives (do not edit unless strictly necessary)
- `lib/` — Shared utilities, query clients, schemas, and helper functions
- `docs/PROJECT.md` — Project plan, architecture, and design rules

## Core Guidelines & Development Rules

1. **Multi-Tenant Data Isolation**:
   - Every tenant data query must be scoped by `organization_id`.
   - Never query or mutate tenant data without enforcing the `organization_id` boundary.

2. **Server-Side Permission Checks**:
   - Permission and authorization checks must always happen on the server (Server Components, Server Actions, Route Handlers).
   - Client-side checks are strictly for UI presentation, never security enforcement.

3. **Input Validation**:
   - Every input (form submissions, URL query params, API request bodies, action payloads) must be validated with Zod.

4. **Screen States**:
   - Every screen and view must handle all 4 states:
     - **Loading**: Skeleton or loading indicator during data retrieval.
     - **Empty**: User-friendly state when no data exists.
     - **Error**: Clear error message with recovery/retry options.
     - **Success**: Populated data view.

5. **Component Organization**:
   - shadcn components stay in `components/ui/`. Do not edit them unless necessary.
   - Place feature and domain-specific components directly in `components/` or organized subfolders outside `components/ui/`.

6. **Scope Discipline**:
   - Only do what the prompt asks. Do not build extra features.

7. **Package Management**:
   - Ask me before installing new packages.
