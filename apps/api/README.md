# Focus Guide - Backend API

AdonisJS 6 backend REST API for Focus Guide.

## Tech Stack

- AdonisJS 6
- TypeScript 5.3+
- PostgreSQL 15+ with Lucid ORM
- Redis 7+ for sessions and caching
- Session-based authentication

## Prerequisites

- PostgreSQL 15+ running
- Redis 7+ running

## Development

\`\`\`bash
# From workspace root
pnpm dev:api

# Or from this directory
pnpm dev
\`\`\`

API runs on `http://localhost:3333`

## Environment Variables

Create a `.env` file based on `.env.example`:

\`\`\`bash
NODE_ENV=development
PORT=3333
APP_KEY=your-secret-app-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/focusguide
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
\`\`\`

## Database Migrations

\`\`\`bash
# Run migrations
pnpm db:migrate

# Rollback migrations
pnpm db:rollback

# Create new migration
pnpm ace make:migration migration_name
\`\`\`

## Testing

\`\`\`bash
pnpm test
\`\`\`
