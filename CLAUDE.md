# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Focus Guide is a personal productivity SaaS bridging project planning and daily execution. It uses a monorepo structure with Next.js 14 frontend and AdonisJS 6 backend, managed by pnpm.

### Core Features
- **Today** - Daily task execution board
- **Projets** - Strategic planning with kanban boards per project
- **Pomodoro** - Focused work timer with customizable settings
- **Calendar** - Planned feature (currently disabled in sidebar)

## Development Commands

### Running Services

```bash
# Both frontend and backend
pnpm dev

# Frontend only (Next.js, port 3000)
pnpm dev:web

# Backend only (AdonisJS, port 3333)
pnpm dev:api
```

### Code Quality & Tests

```bash
# Lint all workspaces
pnpm lint

# Format with Prettier
pnpm format

# Run frontend tests (Vitest)
pnpm test

# Run frontend tests once (no watch)
pnpm test:run

# Run backend tests
cd apps/api && node ace test
```

### Building

```bash
# Build all packages
pnpm build

# Build specific app
pnpm --filter @focus-guide/web build
pnpm --filter @focus-guide/api build
```

## Architecture

### Frontend (Next.js 14 App Router)

**Tech**: TypeScript, Tailwind CSS, Zustand, TanStack Query, dnd-kit, React Hook Form

**Structure**:
```
apps/web/src/app/
├── (auth)/              # Login, register, email verification
├── (dashboard)/         # Protected routes with sidebar layout
│   ├── today/           # Daily task board
│   ├── projets/         # Project kanban boards
│   ├── pomodoro/        # Timer interface
│   └── settings/        # User settings
├── api/                 # Next.js API routes (auth, data sync)
└── layout.tsx           # Root layout with auth provider

components/
├── kanban/              # Today page board components
├── projects/            # Project-specific components
├── pomodoro/            # Timer, settings, controls
├── layout/Sidebar.tsx   # Navigation sidebar (update navItems to add routes)
├── ui/                  # Base Radix UI components
└── modals/              # Reusable dialogs

hooks/                   # TanStack Query hooks for server state
stores/                  # Zustand stores: auth, ui, pomodoro, today
lib/                     # api-client.ts, error-handler, validations
```

**State Management**:
- Zustand: Client UI state (sidebar, modals, auth, pomodoro settings)
- TanStack Query: Server state (projects, tasks, calendar data)
- localStorage: Persisted settings

**Custom Hooks Pattern**:
```typescript
// hooks/use-calendar-events.ts
export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/calendar')
      return data
    },
  })
}
```

### Backend (AdonisJS 6)

**Tech**: TypeScript, PostgreSQL, Redis, Lucid ORM, session-based auth

**Structure**:
```
apps/api/
├── app/
│   ├── controllers/     # HTTP handlers (auth, projects, tasks)
│   ├── models/          # Lucid ORM: User, Project, Task
│   ├── middleware/      # Auth, guest, verification checks
│   └── validators/      # Input validation
├── routes.ts            # Route definitions
├── config/              # Database, auth, session config
└── database/            # Migrations
```

**Models**: User, Project, Task, VerificationToken

**Auth**: Session-based (Redis) with middleware guards on protected routes

## Adding a New Page

1. **Create route**: `apps/web/src/app/(dashboard)/calendar/page.tsx`
2. **Enable in sidebar**: Update `navItems` in `components/layout/Sidebar.tsx` (remove `disabled: true`)
3. **Add components**: Create `components/calendar/` subdirectory
4. **Add API route** (if needed): Create backend controller + route in `apps/api`
5. **Create data hook**: Use TanStack Query pattern in `hooks/use-calendar.ts`
6. **Add state** (if needed): Create Zustand store in `stores/`

## Key Integration Points

**Sidebar Navigation** (`components/layout/Sidebar.tsx`):
- `navItems` array defines available routes and icons
- Set `disabled: true` to hide unimplemented pages without removing code

**API Client** (`lib/api-client.ts`):
- Axios instance with automatic auth headers
- Used by all TanStack Query hooks

**Protected Routes**:
- Pages wrapped in `<ProtectedRoute>` component
- Auth state checked via Zustand `useAuthStore`

**Styling**:
- Tailwind CSS with custom palette
- Primary color: `chartreuse`
- Dark: `#0a0a0a`, Light: `#f8f8f8`
- No custom CSS files except `globals.css`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Backend (.env)
```
NODE_ENV=development
PORT=3333
APP_KEY=<generated via: node ace generate:key>
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<your_password>
DB_NAME=focus_guide
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SESSION_DRIVER=redis
```

## Testing

- **Frontend**: Vitest + React Testing Library, tests colocated in `__tests__` folders
- **Backend**: Japa test runner (run from `apps/api`)
- No E2E tests currently configured

## Key Dependencies

**Frontend**:
- Next.js 14, React 18
- @tanstack/react-query v5
- zustand (state management)
- zod (validation)
- lucide-react (icons)
- dnd-kit (drag & drop)

**Backend**:
- @adonisjs/core v6
- @adonisjs/lucid (ORM)
- @adonisjs/redis
- pg (PostgreSQL driver)
- bcrypt (password hashing)

## Notes for Implementation

- Keyboard shortcuts defined in Pomodoro: Space (start/pause), R (restart), S/Esc (stop), Comma (settings)
- Projects support kanban-style columns with drag & drop
- Tasks can exist in both projects and today boards (bidirectional sync planned)
- Session auth via cookies; ensure API client includes credentials
- Mobile layout: bottom navigation bar; desktop: left sidebar with collapse toggle
