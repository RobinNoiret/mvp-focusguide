# Focus Guide

Personal productivity SaaS bridging project planning and daily execution.

## Description

Focus Guide helps users manage their productivity by providing three core capabilities:
- **Projects Page** - Strategic planning with project kanban boards
- **Today Page** - Daily execution board connecting project tasks to daily focus
- **Pomodoro Timer** - Focused work execution tool

**Key Differentiator:** Focus Guide bridges the gap between long-term project planning and daily task execution, allowing tasks to exist in both contexts simultaneously with bidirectional synchronization.

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR/SSG
- **TypeScript 5.3+** - Type-safe code
- **Tailwind CSS** - Utility-first styling with custom colors
- **Zustand** - Global client state management
- **TanStack Query** - Server state management and caching
- **dnd-kit** - Drag-and-drop functionality
- **driver.js** - Onboarding features

### Backend
- **AdonisJS 6** - Node.js MVC framework
- **TypeScript 5.3+** - Type-safe backend code
- **PostgreSQL 15+** - Primary relational database
- **Lucid ORM** - Database access layer
- **Redis 7+** - Session storage and API caching

### Development Tools
- **pnpm 8+** - Monorepo package manager
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Vitest** - Frontend unit tests
- **Japa** - Backend API tests
- **Playwright** - E2E user flow testing

## Prerequisites

- **Node.js** 20+ (LTS version recommended)
- **pnpm** 8.x+ (install with `npm install -g pnpm@8`)
- **PostgreSQL** 15+ (required for Story 1.2+)
- **Redis** 7+ (required for Story 1.2+)

## Installation

\`\`\`bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Configure your environment variables in the .env files
\`\`\`

## Database Setup

After installation, you must run migrations to set up the database schema:

\`\`\`bash
# Navigate to API directory
cd apps/api

# Run all pending migrations
node ace migration:run

# (Optional) Rollback migrations
node ace migration:rollback
\`\`\`

**Important:** Migrations must be run after pulling new changes that include schema updates. Check the `apps/api/database/migrations/` folder for recent changes.

## Development

**First time setup:** Make sure to run [Database Setup](#database-setup) before starting the development server.

\`\`\`bash
# Start all services (frontend + backend + watch mode)
pnpm dev

# Start frontend only (Next.js on localhost:3000)
pnpm dev:web

# Start backend only (AdonisJS on localhost:3333)
pnpm dev:api

# Run linting
pnpm lint

# Run formatting
pnpm format

# Run tests
pnpm test

### After pulling new changes
If you pull changes that include database migrations:
\`\`\`bash
cd apps/api
node ace migration:run
\`\`\`

## Keyboard Shortcuts

### Pomodoro Timer
- **Space** - Start/Pause timer
- **R** - Restart current timer
- **S** or **Esc** - Stop timer
- **,** (Comma) - Open settings

## Project Structure

\`\`\`
focus-guide/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   └── api/          # AdonisJS 6 backend (REST API)
├── packages/
│   ├── shared/       # Shared TypeScript types, constants, utils
│   └── config/       # Shared ESLint, TypeScript configs
├── docs/             # Project documentation
├── .bmad-core/       # BMAD framework
├── pnpm-workspace.yaml
├── package.json      # Root workspace config
└── README.md
\`\`\`

**Why monorepo?**
- Share TypeScript types between frontend and backend (critical for API contracts)
- Unified dependency management
- Simpler for 2-person team than separate repositories
- Single CI/CD pipeline

## Contributing

This project uses the BMAD-METHOD™ framework for structured development. See the \`docs/\` folder for PRD, architecture, and story documentation.

## License

UNLICENSED - Private project
