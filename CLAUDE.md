# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Start Next.js dev server with Turbopack
pnpm build                  # Build for production
pnpm lint                   # Run ESLint
pnpm format                 # Format code with Prettier
pnpm check-types           # TypeScript type checking (in apps/web)
```

## Architecture Overview

### Monorepo Structure

-   **Framework**: Turbo-powered monorepo with pnpm workspaces
-   **Main App**: `/apps/web/` - Next.js 15 app with App Router
-   **Package Manager**: pnpm v10.10.0 (strict version enforcement)

### Core Application Flow

InstaBoostLab is an AI-powered Instagram A/B testing tool:

1. User uploads 2 images + captions + context (genre/target audience)
2. Images upload directly to Cloudinary (client-side)
3. OpenAI GPT-4o-mini analyzes both posts with vision capabilities
4. Returns structured recommendations and improvements

### Schema-Driven Architecture

-   **Pattern**: Zod schemas in `/src/app/schema.ts` serve as single source of truth
-   **Type Generation**: Automatic TypeScript types via `z.infer`
-   **Validation**: Runtime validation + React Hook Form integration
-   **Structure**: `evaluateModel` object pattern for field definitions with descriptions and limits

### API Architecture

-   **Endpoint**: `/api/vision-evaluate` - Node.js runtime
-   **Model**: GPT-4o-mini with multi-modal messages (text + image URLs)
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
# Required in .env.local
OPENAI_API_KEY=sk-xxxxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxxx
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

-   **Next.js 15** (App Router, React 19, TypeScript)
-   **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
-   **Forms**: React Hook Form, Zod
-   **AI**: OpenAI GPT-4o-mini with vision
-   **Images**: Cloudinary
-   **Build**: Turbo, pnpm workspaces
