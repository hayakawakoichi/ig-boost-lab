# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Start both web and API servers
# OR start individually:
pnpm --filter web dev       # Start Next.js dev server (port 3000)
pnpm --filter api dev       # Start Hono API server (port 3001)

# Production
pnpm build                  # Build all apps
pnpm start                  # Start all apps in production mode

# Code Quality
pnpm lint                   # Run ESLint
pnpm format                 # Format code with Prettier
pnpm check-types           # TypeScript type checking
```

## Architecture Overview

### Monorepo Structure

-   **Framework**: Turbo-powered monorepo with pnpm workspaces
-   **Web App**: `/apps/web/` - Next.js 15 app with App Router (port 3000)
-   **API Server**: `/apps/api/` - Hono API server (port 3001)
-   **Package Manager**: pnpm v10.10.0 (strict version enforcement)

### Core Application Flow

InstaBoostLab is an AI-powered Instagram A/B testing tool:

1. **Frontend** (Next.js): User uploads 2 images + captions + context
2. **Image Upload**: Direct client-to-Cloudinary upload
3. **API Call**: Frontend calls Hono API server with image URLs + text
4. **AI Analysis**: Hono server calls OpenAI GPT-4o-mini with vision
5. **Response**: Structured recommendations returned to frontend

### Schema-Driven Architecture

-   **Shared Schema**: Zod schemas in both `/apps/web/src/app/schema.ts` and `/apps/api/src/schema.ts`
-   **Type Generation**: Automatic TypeScript types via `z.infer`
-   **Validation**: Runtime validation in both frontend forms and API endpoints
-   **Structure**: `evaluateModel` object pattern for field definitions with descriptions and limits

### API Architecture

-   **Server**: Hono framework on Node.js (port 3001)
-   **Endpoint**: `POST /vision-evaluate`
-   **Model**: GPT-4o-mini with multi-modal messages (text + image URLs)
-   **CORS**: Configured for localhost development
-   **Input**: Cloudinary URLs + captions + context
-   **Output**: Structured JSON with recommendation and improvements

### Image Upload Pattern

-   **Strategy**: Direct client-to-Cloudinary upload (no backend proxy)
-   **Security**: Uses upload presets defined in environment
-   **Library**: Custom upload utility in `/src/lib/uploadToCloudinary.ts`

### UI Component System

-   **Base**: shadcn/ui "new-york" style with Radix UI primitives
-   **Styling**: Tailwind CSS v4 with CSS variables and OKLCH color space
-   **Forms**: React Hook Form + Zod resolver pattern
-   **Icons**: Lucide React
-   **Theming**: Built-in dark mode support

## Environment Requirements

```bash
# Web App (.env.local in apps/web/)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxxx
NEXT_PUBLIC_API_URL=http://localhost:3001  # Optional, defaults to localhost:3001

# API Server (.env in apps/api/)
OPENAI_API_KEY=sk-xxxxx
```

## Key Development Patterns

### Form Implementation

-   Use React Hook Form with Zod resolver
-   FormField wrapper components for consistent styling
-   Real-time validation with character counting
-   Loading states with toast notifications (Sonner)

### Component Development

-   Follow shadcn/ui patterns for new components
-   Use Class Variance Authority for variant management
-   Implement compound component patterns where appropriate
-   Ensure accessibility with ARIA attributes

### Type Safety

-   Schema-first development with Zod
-   End-to-end TypeScript from forms to API responses
-   Runtime validation at API boundaries

## Tech Stack

### Frontend (apps/web)
-   **Next.js 15** (App Router, React 19, TypeScript)
-   **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
-   **Forms**: React Hook Form, Zod
-   **Images**: Cloudinary

### Backend (apps/api)
-   **Hono** (Fast web framework)
-   **Runtime**: Node.js with tsx for development
-   **AI**: OpenAI GPT-4o-mini with vision
-   **Validation**: Zod

### Development
-   **Build**: Turbo, pnpm workspaces
-   **TypeScript**: Full type safety across frontend and backend
