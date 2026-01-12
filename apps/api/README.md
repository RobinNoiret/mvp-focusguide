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
cp .env.example .env
# Then generate APP_KEY
node ace generate:key
\`\`\`

Required variables:
\`\`\`bash
NODE_ENV=development
PORT=3333
APP_KEY=<generated-with-node-ace-generate-key>
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_DATABASE=focus_guide
SESSION_DRIVER=cookie
FRONTEND_URL=http://localhost:3000
\`\`\`

## Database Setup

### Test Database Connection

\`\`\`bash
node ace db:ping
\`\`\`

### Migrations

\`\`\`bash
# Run migrations
node ace migration:run

# Rollback migrations
node ace migration:rollback

# Create new migration
node ace make:migration migration_name
\`\`\`

## Testing

\`\`\`bash
pnpm test
\`\`\`
