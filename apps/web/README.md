# Focus Guide - Frontend

Next.js 14 frontend application for Focus Guide.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript 5.3+
- Tailwind CSS with custom colors
- Zustand for state management
- TanStack Query for server state
- dnd-kit for drag-and-drop

## Development

\`\`\`bash
# From workspace root
pnpm dev:web

# Or from this directory
pnpm dev
\`\`\`

Frontend runs on `http://localhost:3000`

## Environment Variables

Create a `.env.local` file based on `.env.example`:

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:3333/v1
\`\`\`

## Building

\`\`\`bash
pnpm build
pnpm start
\`\`\`
