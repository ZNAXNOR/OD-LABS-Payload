# Project Overview: Payload Website Template

This project is a high-performance, enterprise-grade website and content management system built with **Payload CMS (3.x)** and **Next.js (App Router)**. It leverages a modern tech stack including **TypeScript**, **Tailwind CSS**, and **shadcn/ui** for a robust and scalable architecture.

## Core Technologies
- **CMS**: Payload CMS 3.x (Modular, Type-safe)
- **Frontend**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS 4.x, shadcn/ui
- **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
- **Type Safety**: TypeScript (Strict mode)
- **Editor**: Lexical Rich Text Editor
- **Testing**: Vitest (Integration) and Playwright (E2E)

## Project Structure
- `src/app/`: Next.js App Router structure.
  - `(frontend)/`: Main website routes and components.
  - `(payload)/`: Payload Admin Panel routes.
- `src/collections/`: Payload collection configurations (Pages, Posts, Media, Categories, Users).
- `src/blocks/`: Modular layout-building blocks (Hero, Content, Media, Call To Action, etc.).
- `src/components/`: Shared React components (AdminBar, UI elements, etc.).
- `src/fields/`: Reusable Payload field configurations.
- `src/plugins/`: Payload plugin configurations (SEO, Search, Redirects, etc.).
- `tests/`: Testing suite.
  - `int/`: Integration tests (Vitest).
  - `e2e/`: End-to-end tests (Playwright).

## Building and Running

### Development
```bash
# Install dependencies
pnpm install

# Start development server (Payload + Next.js)
pnpm dev
```

### Production
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Type Generation
```bash
# Generate Payload types based on collections/globals
pnpm generate:types

# Generate import map for admin components
pnpm generate:importmap

# Generate both
pnpm generate:all
```

### Testing
```bash
# Run all tests
pnpm test

# Run integration tests (Vitest)
pnpm test:int

# Run E2E tests (Playwright)
pnpm test:e2e
```

## Development Conventions

### Payload Development
- **Modular Blocks**: New layout features should be added as blocks in `src/blocks/`. Each block should have a configuration file and a corresponding React component.
- **Type Safety**: Always run `pnpm generate:types` after modifying collection or global schemas to keep `src/payload-types.ts` updated.
- **Access Control**: Follow established patterns in `src/access/` for consistent security across collections.
- **Hooks**: Use collection and field hooks for side effects (e.g., `populatePublishedAt`, `revalidateRedirects`).

### Frontend Development
- **Tailwind CSS**: Use Tailwind for all styling. Custom CSS should be minimal and located in `src/app/(frontend)/globals.css`.
- **shadcn/ui**: Use and extend components from the `src/components/ui/` directory.
- **Live Preview**: Ensure components are compatible with Payload's Live Preview by using the appropriate hooks and props.

### Deployment
- This project is optimized for deployment on **Vercel** but can be self-hosted.
- Ensure environment variables are correctly configured in production (see `.env.example`).
- Use `pnpm payload migrate` to run database migrations in production.
