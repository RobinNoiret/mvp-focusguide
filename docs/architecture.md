# Focus Guide - Fullstack Architecture Document

**Version:** 1.0
**Last Updated:** 2026-01-09
**Architect:** Winston 🏗️

---

## Table of Contents

1. [Introduction](#introduction)
2. [High Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Security Architecture](#security-architecture)
5. [Data Models](#data-models)
6. [API Specification](#api-specification)
7. [Components](#components)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Unified Project Structure](#unified-project-structure)
11. [Development Workflow](#development-workflow)
12. [Deployment Architecture](#deployment-architecture)
13. [Testing Strategy](#testing-strategy)
14. [Monitoring & Observability](#monitoring--observability)

---

## Introduction

This document outlines the complete fullstack architecture for **Focus Guide**, a personal productivity SaaS that bridges the gap between project planning and daily execution. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Product Vision

Focus Guide helps users manage their productivity by providing three core capabilities:
1. **Projects Page** - Strategic planning with project kanban boards
2. **Today Page** - Daily execution board connecting project tasks to daily focus
3. **Pomodoro Timer** - Focused work execution tool

**Key Differentiator:** Focus Guide bridges the gap between long-term project planning and daily task execution, allowing tasks to exist in both contexts simultaneously with bidirectional synchronization.

### Starter Template

**N/A - Greenfield Project**

This is a new project built from scratch with no starter templates. The architecture is designed specifically for Focus Guide's requirements with flexibility to evolve through the 4-phase MVP build sequence (Today → Projects → Connect → Pomodoro).

### Multi-Client Architecture

The backend API is intentionally decoupled from the frontend to support **multiple client applications**:
- Web application (MVP Phases 1-4)
- Browser extension (post-MVP)
- Mobile applications (future)

This architectural decision ensures the API serves as a true platform, not just a backend for a single web app.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-09 | 1.0 | Initial architecture document | Winston (Architect) |

---

## High Level Architecture

### Technical Summary

Focus Guide is a fullstack productivity SaaS built with a **decoupled architecture** consisting of a Next.js frontend and an independent AdonisJS REST API backend. This separation is intentional to support **multiple client applications**: the web app (Phase 1-4), a planned browser extension, and potential future mobile apps.

The system follows a **phased MVP delivery strategy**, starting with a standalone Today page (Phase 1), adding Projects management (Phase 2), connecting them with bidirectional sync (Phase 3), and completing with Pomodoro timer (Phase 4). Each phase delivers independent user value while building toward the complete "bridge the gap between project planning and daily execution" vision.

**Key architectural characteristics:**
- **Frontend:** Next.js (React) with PWA capabilities, deployed as static/SSR hybrid, optimistic UI with client-side state management
- **Backend:** AdonisJS REST API serving multiple clients (web, extension), JWT authentication for multi-client support
- **Database:** PostgreSQL for relational data (users, projects, tasks, relationships)
- **Data Integrity:** Critical non-functional requirement - never lose user modifications. Implemented via optimistic updates with retry queue and server reconciliation
- **Deployment:** Serverless/edge deployment for frontend (Vercel), containerized backend service (Railway), managed PostgreSQL

This architecture balances **MVP speed** (2-person side project) with **future extensibility** (V2 collaboration, calendar sync, mobile apps) while maintaining **operational simplicity** for a small team.

### Platform and Infrastructure Choice

**Selected Platform:** Vercel (Frontend) + Railway (Backend + Database)

**Rationale:**
- **Vercel** is purpose-built for Next.js with zero-config deployments, edge optimization, and preview environments
- **Railway** simplifies AdonisJS + PostgreSQL deployment with Dockerfile-based deployment
- Combined free tiers sufficient for MVP development and early users
- Simple CI/CD: Git push → auto-deploy
- Easy CORS/domain configuration between services
- Can scale to thousands of users before needing migration

**Key Services:**
- **Frontend:** Vercel (Next.js SSR/SSG, Edge Functions, Preview Deployments)
- **Backend API:** Railway (AdonisJS container)
- **Database:** Railway PostgreSQL (managed instance)
- **Cache/Sessions:** Railway Redis (managed instance)
- **File Storage:** Deferred to V2 for custom fields
- **Authentication:** AdonisJS built-in auth + JWT tokens

**Deployment Regions:**
- **Vercel:** Global edge network (automatic)
- **Railway:** Single region initially (US-West or EU-West), expand if needed

### Repository Structure

**Structure:** Monorepo with npm workspaces

**Monorepo Tool:** npm workspaces (built-in, zero config)

**Package Organization:**
```
focus-guide/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # AdonisJS backend
├── packages/
│   ├── shared/       # Shared TypeScript types, constants, utils
│   └── config/       # Shared ESLint, TypeScript configs
└── package.json      # Root workspace config
```

**Why monorepo?** Share TypeScript types between frontend and backend (critical for API contracts), unified dependency management, simpler for 2-person team than separate repos.

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[Next.js Web App<br/>Vercel]
        Extension[Browser Extension<br/>Future]
        Mobile[Mobile App<br/>Future V3]
    end

    subgraph "CDN & Edge"
        Vercel[Vercel Edge Network<br/>Static Assets + SSR]
    end

    subgraph "API Layer - Railway"
        API[AdonisJS REST API<br/>Authentication & Business Logic]
    end

    subgraph "Data Layer - Railway"
        DB[(PostgreSQL<br/>Users, Projects, Tasks)]
        Redis[(Redis<br/>Rate Limiting, Caching)]
    end

    WebApp -->|HTTPS| Vercel
    Vercel -->|API Calls| API
    Extension -.->|API Calls<br/>Future| API
    Mobile -.->|API Calls<br/>Future| API

    API -->|SQL Queries| DB
    API -->|Cache/Sessions| Redis

    style WebApp fill:#61dafb
    style Extension fill:#ccc
    style Mobile fill:#ccc
    style API fill:#5a45ff
    style DB fill:#336791
    style Redis fill:#DC382D
```

### Architectural Patterns

- **Decoupled Frontend/Backend:** Next.js and AdonisJS communicate via REST API only. Enables multiple clients (web, extension, mobile) to share same backend. _Rationale:_ Future extensibility and separation of concerns.

- **API Gateway Pattern:** AdonisJS acts as single entry point for all business logic, authentication, and data access. _Rationale:_ Centralized auth, rate limiting, versioning, and monitoring.

- **Repository Pattern (Backend):** Abstract database access behind repository interfaces. _Rationale:_ Testability, future database migration flexibility, clean separation of concerns.

- **Component-Based UI (Frontend):** React components with TypeScript and composition patterns. _Rationale:_ Reusability, maintainability, type safety.

- **Optimistic UI with Reconciliation:** UI updates immediately, background API sync with retry queue, server-authoritative state. _Rationale:_ Meets critical "never lose data" requirement while providing responsive UX.

- **JWT Authentication:** Stateless tokens enable multi-client authentication (web, extension) with refresh token rotation. _Rationale:_ Scalability, multi-device support, extension compatibility.

- **Progressive Web App (PWA):** Service worker for offline capability and mobile installation. _Rationale:_ Mobile UX without native app complexity (for MVP).

- **REST API with OpenAPI Spec:** Standard HTTP endpoints with documented contracts. _Rationale:_ Easy to consume from multiple clients, excellent tooling ecosystem, future-proof.

---

## Tech Stack

This is the **DEFINITIVE technology selection** for Focus Guide. All development must use these exact technologies and versions. This table is the single source of truth.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe frontend code | Catches errors at compile-time, essential for shared types with backend, excellent IDE support |
| **Frontend Framework** | Next.js | 14.x (App Router) | React framework with SSR/SSG | Industry standard for React apps, built-in routing, excellent Vercel integration, supports PWA |
| **UI Component Library** | shadcn/ui + Radix UI | Latest | Accessible, customizable components | Unstyled primitives (Radix) + beautiful defaults (shadcn), copy-paste components (no bloat), keyboard navigation for a11y |
| **State Management** | Zustand | 4.4+ | Global client state | Lightweight (1kb), simpler than Redux, perfect for optimistic UI patterns, no boilerplate |
| **Data Fetching** | TanStack Query (React Query) | 5.x | Server state management, caching | Handles optimistic updates, retry logic, cache invalidation - CRITICAL for "never lose data" requirement |
| **Drag & Drop** | dnd-kit | 6.1+ | Kanban drag-and-drop | Modern, accessible, touch-friendly, actively maintained (100k+ weekly downloads), TypeScript-first |
| **Form Handling** | React Hook Form | 7.49+ | Form validation & state | Performant, minimal re-renders, integrates with TypeScript, good DX |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first styling | Fast development, consistent design system, excellent with Next.js, small production bundle |
| **Backend Language** | TypeScript | 5.3+ | Type-safe backend code | Shared types with frontend, modern async/await, same language as frontend (reduces context switching) |
| **Backend Framework** | AdonisJS | 6.x | Node.js MVC framework | Mature, Laravel-like DX for Node, built-in auth, ORM, validator, excellent for REST APIs |
| **API Style** | REST (OpenAPI 3.0) | OpenAPI 3.0 | RESTful HTTP API | Standard, easy to consume from web + extension, excellent tooling (Swagger UI), future-proof |
| **Database** | PostgreSQL | 15+ | Primary relational database | ACID compliance for data integrity, handles complex relationships (task-project-today), JSON support for flexibility |
| **ORM** | Lucid ORM (AdonisJS) | 20+ (bundled with Adonis 6) | Database access layer | Type-safe queries, migrations, seeders, relationships, built into AdonisJS |
| **Cache** | Redis (via Upstash) | 7+ | Session storage, API caching | Fast in-memory cache, Railway add-on available, handles session data, can cache frequent queries |
| **File Storage** | Deferred to V2 | - | Custom fields feature | Not needed for MVP (no file uploads), add Cloudinary or S3 when custom fields implemented |
| **Authentication** | AdonisJS Auth + JWT | Adonis Auth 9+ | Multi-client authentication | JWT tokens work for web + extension + future mobile, refresh tokens for security, Adonis handles all flows |
| **Frontend Testing** | Vitest | 1.1+ | Unit tests for components, hooks | Fast, Vite-native, compatible with Jest syntax, better DX than Jest |
| **Backend Testing** | Japa (AdonisJS) | 3.x | API endpoint tests | Built into AdonisJS, supports HTTP tests, database factories, test isolation |
| **E2E Testing** | Playwright | 1.40+ | User flow testing | Fast, reliable, multi-browser, excellent debugging, records videos on failure |
| **Build Tool** | Vite (via Next.js) | - | Frontend build | Next.js 14 uses Turbopack (dev) and Webpack (prod), no separate config needed |
| **Package Manager** | pnpm | 8.x+ | Monorepo dependency management | Faster than npm/yarn, efficient disk usage, excellent workspace support |
| **Linting** | ESLint | 8.x+ | Code quality enforcement | Catch bugs early, enforce conventions, integrates with TypeScript |
| **Formatting** | Prettier | 3.x+ | Code formatting | Consistent code style, integrates with ESLint, saves time on reviews |
| **CI/CD** | GitHub Actions | - | Automated testing & deployment | Free for public repos, easy Vercel/Railway integration, run tests on PR |
| **Monitoring** | Vercel Analytics + Railway Logs | - | Performance & error tracking | Vercel tracks Web Vitals, Railway provides log aggregation, free tiers sufficient for MVP |
| **Error Tracking** | Sentry | Latest | Frontend & backend errors | Industry standard, excellent error grouping, stack traces, user context, free tier generous |
| **API Documentation** | Swagger UI (OpenAPI) | 5.x | Interactive API docs | Auto-generated from OpenAPI spec, test endpoints in browser, helps extension development |

---

## Security Architecture

This section defines the measures de sécurité critiques pour protéger Focus Guide et ses utilisateurs. **Ces pratiques sont NON-NÉGOCIABLES pour un SaaS en production.**

### Authentication & Password Security

#### Password Hashing with Bcrypt

**ALL passwords are hashed with bcrypt (cost factor 10+). NEVER stored in plaintext. NEVER exposed in API responses.**

**Implementation:**
```typescript
// app/models/user.ts
export default class User extends BaseModel {
  @column({ serializeAs: null }) // CRITICAL: Never expose in API responses
  declare password: string

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      // Bcrypt with automatic salt (cost factor = 10)
      user.password = await Hash.make(user.password)
    }
  }
}
```

**Password Validation Rules:**
- Minimum 8 characters
- Must contain: uppercase, lowercase, digit, special character (@$!%*?&)
- Maximum 64 characters

#### JWT Token Strategy

**Architecture:**
- **Access Token:** Short-lived (15 minutes), sent with every API request
- **Refresh Token:** Long-lived (7 days), stored securely, used to get new access tokens

**Why?** Short access token limits damage if stolen, refresh token allows "remember me" functionality, supports multi-client (web, extension, mobile).

#### Email Verification

**Flow:**
1. User registers → account created with `emailVerified: false`
2. System sends email with verification token (UUID, expires in 24h)
3. User clicks link → token validated → `emailVerified: true`
4. Unverified users have limited access

#### Password Reset Flow

**Secure implementation:**
1. User requests reset → email sent with unique token (expires in 1 hour)
2. Token is single-use (deleted after password reset)
3. New password hashed with bcrypt
4. All existing sessions invalidated (logout all devices)

**Anti-abuse:** Max 3 reset requests per hour per email, generic messages to prevent email enumeration.

### API Security

#### CORS Configuration

```typescript
// config/cors.ts
export default {
  enabled: true,
  origin: [
    'https://focusguide.app',
    'https://staging.focusguide.app',
    'https://*.vercel.app', // Preview deployments
    // Extension domain will be added when extension is built
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  credentials: true,
}
```

#### Rate Limiting

- **Auth endpoints:** 5 requests/minute (brute-force protection)
- **Read endpoints:** 300 requests/minute
- **Write endpoints:** 100 requests/minute
- **Block duration:** 15 minutes after limit exceeded

#### Input Validation

**Every API endpoint validates input with AdonisJS validators** (VineJS). Protects against:
- SQL injection (ORM uses parameterized queries)
- XSS (React escapes by default, validators sanitize)
- Type confusion attacks
- Business logic bypass

#### User Data Isolation

**CRITICAL:** Every query must filter by authenticated user.

```typescript
// ✅ CORRECT
const projects = await auth.user!.related('projects').query().where('deleted_at', null)

// ❌ WRONG - Returns ALL users' projects!
const projects = await Project.query().where('deleted_at', null)
```

All routes require `auth` middleware, all queries scoped to `auth.user!`.

### Data Protection

#### Environment Variables (Secrets Management)

**NEVER commit secrets to git:**

```bash
# .env (in .gitignore - NEVER committed)
APP_KEY=randomly-generated-32-character-secret-key-here
JWT_SECRET=another-random-secret-for-jwt-signing-here
DATABASE_URL=postgresql://user:password@host:5432/focusguide
SMTP_PASSWORD=your-smtp-password-here
SENTRY_DSN=https://your-sentry-dsn-here
```

#### Database Encryption

Railway PostgreSQL provides:
- ✅ Encryption at rest (data files encrypted on disk)
- ✅ TLS in transit (connections encrypted)
- ✅ Automated backups (encrypted)
- ✅ Point-in-time recovery

#### HTTPS Everywhere

- Vercel: Automatic HTTPS with free SSL certificates
- Railway: Automatic HTTPS for backend
- HTTP requests automatically upgraded to HTTPS
- HSTS headers enforced

#### Logging Without Secrets

```typescript
// config/logger.ts
export default {
  redact: {
    paths: ['password', 'token', 'accessToken', 'refreshToken', 'authorization'],
    censor: '[REDACTED]',
  },
}
```

**Never log:** Passwords (plaintext or hashed), JWT tokens, API keys, credit card numbers.

### Pre-Production Security Checklist

**Complete this checklist before launching beta:**

#### Authentication & Authorization
- [ ] Passwords hashed with bcrypt (cost factor 10+)
- [ ] Password field has `serializeAs: null`
- [ ] JWT secret is strong (minimum 32 random characters)
- [ ] Access tokens expire (15 minutes)
- [ ] Refresh tokens implemented (7 days, revocable)
- [ ] Email verification required before full access
- [ ] Password reset flow works end-to-end
- [ ] Password strength validated

#### API Security
- [ ] CORS configured - Only whitelisted domains
- [ ] Rate limiting enabled on all routes
- [ ] Input validation on ALL endpoints
- [ ] User data isolation tested
- [ ] SQL injection protection (ORM for all queries)
- [ ] XSS protection (all user input sanitized)

#### Infrastructure & Secrets
- [ ] `.env` in `.gitignore`
- [ ] Environment variables set in Vercel and Railway
- [ ] HTTPS enforced
- [ ] TLS certificates valid
- [ ] Database backups enabled
- [ ] Database encryption at rest enabled

#### Monitoring & Logging
- [ ] Error tracking configured (Sentry)
- [ ] Logs never contain secrets
- [ ] Error messages generic in prod (no stack traces)
- [ ] Request IDs implemented

#### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint configured - no errors
- [ ] Prettier configured
- [ ] Tests passing
- [ ] No `console.log` in production

#### Dependency Security
- [ ] `pnpm audit` clean
- [ ] Dependencies up to date
- [ ] Dependabot enabled
- [ ] Lock file committed

#### Headers & Browser Security
- [ ] Security headers configured (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- [ ] CSP policy set
- [ ] No inline scripts

#### Testing & Validation
- [ ] Manual security test (try to access other user's data)
- [ ] Rate limit test
- [ ] CORS test
- [ ] Password validation test
- [ ] Email verification test

---

## Data Models

These are the core data entities that power Focus Guide, shared between frontend (TypeScript interfaces) and backend (database tables).

### User

**Purpose:** Represents a Focus Guide user with authentication credentials and settings.

**Key Attributes:**
- `id`: string (UUID) - Primary key
- `email`: string - Unique, used for login
- `password`: string - Hashed (bcrypt)
- `name`: string - Display name
- `emailVerified`: boolean - Email verification status
- `pomodoroSettings`: PomodoroSettings - Embedded configuration
- `createdAt`: DateTime
- `updatedAt`: DateTime

**TypeScript Interface:**

```typescript
interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  pomodoroSettings: PomodoroSettings
  createdAt: string
  updatedAt: string
}

interface PomodoroSettings {
  focusDuration: number  // minutes, default: 25
  breakDuration: number  // minutes, default: 5
  repetitions: number    // default: 3
  autoSwitch: boolean    // default: true
}
```

**Relationships:**
- Has many Projects
- Has many Tasks

### Project

**Purpose:** Represents a strategic project with its own kanban board of tasks.

**Key Attributes:**
- `id`: string (UUID)
- `userId`: string - Foreign key
- `title`: string - Required
- `description`: string | null
- `deadline`: DateTime | null
- `tags`: string[] - Array for categorization
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime | null - Soft delete

**Computed fields (not stored):**
- `completionPercentage`: number - Calculated from tasks
- `taskCounts`: { backlog, todo, inProgress, done }

**TypeScript Interface:**

```typescript
interface Project {
  id: string
  userId: string
  title: string
  description: string | null
  deadline: string | null
  tags: string[]
  completionPercentage?: number
  taskCounts?: {
    backlog: number
    todo: number
    inProgress: number
    done: number
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
```

**Relationships:**
- Belongs to User
- Has many Tasks

### Task

**Purpose:** Core entity enabling Focus Guide's unique value - can exist in Project, Today, or both simultaneously.

**Key Design:** Tasks have TWO optional placement contexts:
- `projectStatus` (if in a project)
- `todayStatus` (if in Today page)

**Key Attributes:**
- `id`: string (UUID)
- `userId`: string
- `projectId`: string | null
- `title`: string - Required
- `notes`: string | null
- `projectStatus`: TaskStatus | null
- `todayStatus`: TaskStatus | null
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime | null

**TaskStatus:** `'backlog' | 'todo' | 'in_progress' | 'done'`

**Business Rules:**
1. If `projectId` is null, `projectStatus` must be null
2. If `projectId` is set, `projectStatus` must be set
3. `todayStatus` is independent
4. When task marked `done` in Today, `projectStatus` also → `done` (bidirectional sync)
5. When task marked `done` in Project, `todayStatus` also → `done` (bidirectional sync)
6. When project deleted, cascade soft delete to tasks

**TypeScript Interface:**

```typescript
type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done'

interface Task {
  id: string
  userId: string
  projectId: string | null
  title: string
  notes: string | null
  projectStatus: TaskStatus | null
  todayStatus: TaskStatus | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  project?: Project
}
```

**Relationships:**
- Belongs to User
- Belongs to Project (optional)

### Data Model Diagram

```mermaid
erDiagram
    User ||--o{ Project : owns
    User ||--o{ Task : owns
    Project ||--o{ Task : contains

    User {
        uuid id PK
        string email UK
        string password
        string name
        boolean email_verified
        jsonb pomodoro_settings
        timestamp created_at
        timestamp updated_at
    }

    Project {
        uuid id PK
        uuid user_id FK
        string title
        text description NULL
        date deadline NULL
        string[] tags
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at NULL
    }

    Task {
        uuid id PK
        uuid user_id FK
        uuid project_id FK NULL
        string title
        text notes NULL
        enum project_status NULL
        enum today_status NULL
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at NULL
    }
```

---

## API Specification

Complete REST API specification following OpenAPI 3.0 standard. All clients (web app, browser extension, future mobile) consume this API.

### Base URL

- **Production:** `https://api.focusguide.app/v1`
- **Staging:** `https://staging-api.focusguide.app/v1`
- **Development:** `http://localhost:3333/v1`

### Authentication

Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Rate Limits

- Auth endpoints: 5 requests/minute
- Read endpoints: 300 requests/minute
- Write endpoints: 100 requests/minute

### Key Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user account |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (invalidate refresh token) |
| POST | `/auth/verify-email` | Verify email address |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update user profile |
| PATCH | `/users/me/pomodoro-settings` | Update Pomodoro settings |
| POST | `/users/me/change-password` | Change password |

#### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects (grid view) |
| POST | `/projects` | Create new project |
| GET | `/projects/:id` | Get project detail with tasks (kanban) |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Soft delete project |

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks with filters |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task detail |
| PATCH | `/tasks/:id` | Update task (with bidirectional sync) |
| DELETE | `/tasks/:id` | Soft delete task |
| POST | `/tasks/:id/add-to-today` | Add project task to Today |
| POST | `/tasks/:id/remove-from-today` | Remove task from Today |

#### Today

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/today` | Get Today page (tasks grouped by status) |

### Example Request/Response

**Create Task:**

```http
POST /v1/tasks
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Write chapter 3",
  "projectId": "proj-123",
  "projectStatus": "todo"
}
```

**Response:**

```json
{
  "id": "task-456",
  "userId": "user-123",
  "projectId": "proj-123",
  "title": "Write chapter 3",
  "notes": null,
  "projectStatus": "todo",
  "todayStatus": null,
  "createdAt": "2026-01-09T10:30:00Z",
  "updatedAt": "2026-01-09T10:30:00Z",
  "deletedAt": null
}
```

**Bidirectional Sync Example:**

```http
PATCH /v1/tasks/task-456
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "todayStatus": "done"
}
```

**Response (server applied sync):**

```json
{
  "id": "task-456",
  "projectStatus": "done",  // ← Automatically synced
  "todayStatus": "done",
  "updatedAt": "2026-01-09T11:00:00Z"
}
```

For complete OpenAPI 3.0 specification, see the full document in Section 5 of the detailed architecture document.

---

## Components

Major logical components across the fullstack application.

### Frontend Components (Next.js)

#### Authentication Components
- `LoginForm`, `RegisterForm`
- `ForgotPasswordForm`, `ResetPasswordForm`
- `EmailVerificationBanner`
- `ProtectedRoute` (HOC for auth guards)

#### Today Page Components
- `TodayKanbanBoard` - 4-column kanban
- `TaskColumn` - Single column component
- `TaskCard` - Individual task display
- `ProjectTaskSelectorPanel` - Side panel to drag from projects

#### Projects Page Components
- `ProjectsGrid` - Grid view of all projects
- `ProjectCard` - Project card component
- `ProjectKanbanBoard` - Project task kanban
- `ProjectHeader`, `ProjectInfoPanel`

#### Pomodoro Components
- `TimerDisplay` - Large countdown
- `TimerControls` - Start, pause, stop, reset
- `PomodoroSettings` - Configuration

#### Shared Components
- `Navbar` - Left sidebar navigation
- `UserMenu` - User dropdown
- shadcn/ui primitives (Button, Input, Modal, etc.)

#### Services Layer
- `AuthService`, `UserService`
- `ProjectService`, `TaskService`
- `TodayService`
- `apiClient` (Axios with interceptors)

#### State Management
- **Zustand Stores:** AuthStore, TodayStore, PomodoroStore
- **TanStack Query:** Server state with caching, optimistic updates

### Backend Components (AdonisJS)

#### Controllers
- `AuthController` - Registration, login, tokens
- `UsersController` - Profile management
- `ProjectsController` - Project CRUD
- `TasksController` - Task CRUD + bidirectional sync
- `TodayController` - Today page data

#### Services
- `AuthService` - JWT generation, token rotation
- `TaskSyncService` - Bidirectional sync logic
- `ProjectStatsService` - Calculate completion %
- `EmailService` - Send verification/reset emails

#### Repositories
- `UserRepository`, `ProjectRepository`, `TaskRepository`
- Encapsulate database queries
- Testable data access layer

#### Models (Lucid ORM)
- `User`, `Project`, `Task`
- Relationships, hooks, soft deletes

#### Middleware
- `AuthMiddleware` - JWT verification
- `RateLimiterMiddleware` - Rate limiting
- `CorsMiddleware` - CORS validation

### Shared Components

**packages/shared/src/types:**
- TypeScript interfaces for User, Project, Task
- Shared enums (TaskStatus)
- API DTOs (CreateTaskDto, UpdateTaskDto)

---

## Frontend Architecture

### Component Organization

Next.js 14 App Router structure:

```
apps/web/src/
├── app/
│   ├── (auth)/           # Auth pages (no sidebar)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── (dashboard)/      # Protected pages (with sidebar)
│       ├── today/
│       ├── projects/
│       ├── pomodoro/
│       └── account/
├── components/           # React components
│   ├── auth/
│   ├── today/
│   ├── projects/
│   ├── pomodoro/
│   └── ui/              # shadcn/ui components
├── services/            # API client services
├── stores/              # Zustand stores
├── hooks/               # Custom hooks
└── lib/                 # Utilities
```

### State Management

**Dual State Management:**

1. **Zustand** for UI state:
   - `useAuthStore()` - user, tokens, isAuthenticated
   - `useTodayStore()` - isPanelOpen, selectedProjectId
   - `usePomodoroStore()` - isRunning, timeRemaining

2. **TanStack Query** for server state:
   - `useToday()` - Today page data with caching
   - `useProjects()` - Projects list
   - `useProject(id)` - Single project detail
   - Optimistic updates with rollback on error

### Routing

**Route Groups:**
- `(auth)` - No sidebar, centered layout
- `(dashboard)` - With sidebar navigation

**Protected Routes:** Dashboard layout checks for auth token, redirects to /login if missing.

### API Client

**Axios with Interceptors:**

```typescript
// services/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Request: Add auth token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      // Retry original request with new token
    }
    return Promise.reject(error)
  }
)
```

---

## Backend Architecture

### Project Structure

```
apps/api/
├── app/
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   ├── models/           # Lucid ORM
│   ├── validators/       # Input validation
│   └── middleware/       # Request pipeline
├── config/               # Configuration
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Test data
└── start/
    └── routes.ts         # Route definitions
```

### Controllers

Thin HTTP layer - validate input, delegate to services, return responses.

**Example:**

```typescript
export default class TasksController {
  async update({ auth, params, request }: HttpContext) {
    const data = await request.validate(updateTaskValidator)
    const task = await Task.findOrFail(params.id)

    // Verify ownership
    if (task.userId !== auth.user!.id) {
      return response.forbidden()
    }

    // Apply bidirectional sync
    this.taskSyncService.applyBidirectionalSync(task, data)

    task.merge(data)
    await task.save()

    return response.ok(task)
  }
}
```

### Services

Business logic and orchestration.

**TaskSyncService:**

```typescript
export default class TaskSyncService {
  applyBidirectionalSync(task: Task, updates: Partial<Task>): void {
    // If todayStatus → done, sync projectStatus
    if (updates.todayStatus === 'done' && task.projectStatus !== 'done') {
      updates.projectStatus = 'done'
    }

    // If projectStatus → done, sync todayStatus
    if (updates.projectStatus === 'done' && task.todayStatus !== 'done') {
      updates.todayStatus = 'done'
    }
  }
}
```

### Repositories

Data access abstraction.

```typescript
export default class TaskRepository {
  async findInToday(userId: string): Promise<Task[]> {
    return Task.query()
      .where('user_id', userId)
      .whereNotNull('today_status')
      .whereNull('deleted_at')
      .orderBy('updated_at', 'desc')
  }
}
```

### Models (Lucid ORM)

**User Model:**

```typescript
export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

### Database Migrations

**Tasks Table:**

```typescript
export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().references('users.id')
      table.uuid('project_id').nullable().references('projects.id')
      table.string('title', 500).notNullable()
      table.text('notes').nullable()
      table.enum('project_status', ['backlog', 'todo', 'in_progress', 'done']).nullable()
      table.enum('today_status', ['backlog', 'todo', 'in_progress', 'done']).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()

      // Indexes
      table.index('user_id')
      table.index('project_id')
      table.index('today_status')
      table.index('deleted_at')
    })
  }
}
```

---

## Unified Project Structure

Complete monorepo structure:

```
focus-guide/
├── .github/workflows/        # CI/CD
├── apps/
│   ├── web/                  # Next.js frontend
│   └── api/                  # AdonisJS backend
├── packages/
│   ├── shared/               # Shared types
│   └── config/               # Shared configs
├── docs/                     # Documentation
├── scripts/                  # Build scripts
├── .bmad-core/               # BMAD framework
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## Development Workflow

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### Initial Setup

```bash
# Clone and install
git clone https://github.com/your-org/focus-guide.git
cd focus-guide
pnpm install

# Configure environment
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Setup database
cd apps/api
pnpm db:migrate
cd ../..

# Start development
pnpm dev  # Starts both frontend and backend
```

### Development Commands

```bash
# All workspaces
pnpm dev           # Start all services
pnpm build         # Build all packages
pnpm test          # Run all tests
pnpm lint          # Lint all code

# Frontend only
pnpm dev:web       # Start Next.js (localhost:3000)
pnpm test:web      # Run frontend tests

# Backend only
pnpm dev:api       # Start AdonisJS (localhost:3333)
pnpm test:api      # Run backend tests
```

### Environment Variables

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333/v1
```

**Backend (.env):**

```bash
NODE_ENV=development
PORT=3333
APP_KEY=your-secret-app-key
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/focusguide
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

---

## Deployment Architecture

### Deployment Strategy

- **Frontend:** Vercel (automatic deployments on push to main)
- **Backend:** Railway (Docker container deployment)
- **Database:** Railway PostgreSQL (managed)
- **Cache:** Railway Redis (managed)

### Frontend Deployment (Vercel)

1. Connect GitHub repository
2. Set root directory: `apps/web`
3. Configure environment variable: `NEXT_PUBLIC_API_URL`
4. Vercel auto-deploys on push to main

**Preview Deployments:** Every PR gets automatic preview URL.

### Backend Deployment (Railway)

1. Create Dockerfile in `apps/api`
2. Connect GitHub repository
3. Railway auto-provisions PostgreSQL and Redis
4. Configure environment variables
5. Run migrations: `railway run node ace migration:run --force`

**Deployment Flow:** Push to main → Railway builds Docker image → Deploys container

### CI/CD Pipeline (GitHub Actions)

**CI Workflow:** Runs on PR
- Install dependencies
- Type check
- Lint
- Run tests (frontend + backend)
- Build

**Deploy Workflows:**
- Frontend: Vercel GitHub integration
- Backend: Railway GitHub integration

### Environments

| Environment | Frontend | Backend | Purpose |
|-------------|----------|---------|---------|
| Development | localhost:3000 | localhost:3333 | Local dev |
| Staging | staging.focusguide.app | staging-api.focusguide.app | Pre-prod |
| Production | focusguide.app | api.focusguide.app | Live |

---

## Testing Strategy

### Testing Pyramid

- **70% Unit Tests** (Vitest for frontend, Japa for backend)
- **20% Integration Tests** (Component tests, API tests)
- **10% E2E Tests** (Playwright)

### Frontend Testing (Vitest)

```typescript
// tests/unit/components/TaskCard.test.tsx
describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test task')).toBeInTheDocument()
  })
})
```

### Backend Testing (Japa)

```typescript
// tests/functional/tasks.spec.ts
test('bidirectional sync: mark done in today syncs project', async ({ client, assert }) => {
  const task = await createTask({ projectStatus: 'in_progress', todayStatus: 'in_progress' })

  const response = await client
    .patch(`/v1/tasks/${task.id}`)
    .json({ todayStatus: 'done' })

  assert.equal(response.body().todayStatus, 'done')
  assert.equal(response.body().projectStatus, 'done') // Synced!
})
```

### E2E Testing (Playwright)

```typescript
// tests/e2e/today-page.spec.ts
test('drag task from backlog to todo', async ({ page }) => {
  await page.goto('/today')

  const task = page.locator('[data-task-id]').first()
  const todoColumn = page.locator('[data-column="todo"]')

  await task.dragTo(todoColumn)

  await expect(todoColumn).toContainText('Test task')
})
```

---

## Monitoring & Observability

### Error Tracking

**Sentry** for frontend and backend:
- Automatic error capture
- Stack traces with source maps
- User context
- Performance monitoring

### Performance Monitoring

**Vercel Analytics:**
- Core Web Vitals (LCP, FID, CLS)
- Real User Monitoring

**Railway Metrics:**
- CPU, memory, network usage
- Request rates and latencies

### Logging

**Backend (AdonisJS Logger):**
- Structured logging
- Automatic secret redaction
- Log levels (info, warn, error)

### Key Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| LCP | < 2.5s | > 4s |
| API Response Time | < 200ms | > 1s |
| Error Rate | < 0.5% | > 2% |
| CPU Usage | < 50% | > 80% |

---

## Conclusion

This architecture document defines a complete, production-ready fullstack application that:

✅ Supports phased MVP delivery (Today → Projects → Connect → Pomodoro)
✅ Enables multi-client access (web, extension, mobile)
✅ Maintains data integrity with optimistic UI + retry logic
✅ Provides enterprise-grade security (bcrypt, JWT, rate limiting, CORS)
✅ Balances side project constraints with scalability needs
✅ Includes comprehensive testing and monitoring strategies

**Next Steps:**

1. **Phase 1:** Implement Today page (standalone)
2. **Phase 2:** Add Projects page
3. **Phase 3:** Connect Projects and Today with bidirectional sync
4. **Phase 4:** Add Pomodoro timer

**For Development Questions:** Refer to this document as the single source of truth.

**For API Reference:** See complete OpenAPI specification in Section 6.

**For Security:** Follow pre-production checklist in Section 4 before beta launch.

---

*Architecture designed by Winston 🏗️ using BMAD-METHOD™ framework*
*Document version: 1.0 | Last updated: 2026-01-09*
