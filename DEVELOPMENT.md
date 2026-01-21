# Development Guide

This guide covers the development workflow, best practices, and common tasks for the PayloadCMS project.

## Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+
- PostgreSQL database

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your configuration
# Required variables:
# - DATABASE_URL: PostgreSQL connection string
# - PAYLOAD_SECRET: Generate with: openssl rand -base64 32
```

### 3. Generate Types

```bash
# Generate TypeScript types from Payload schema
pnpm generate:types
```

### 4. Start Development Server

```bash
# Start the development server with hot reload
pnpm dev

# The application will be available at:
# - Frontend: http://localhost:3000
# - Admin Panel: http://localhost:3000/admin
```

## Development Scripts

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm dev:prod` - Clean build and start production server locally

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm validate` - Run all checks (type-check, lint, format)

### Testing

- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:watch` - Run tests in watch mode

### Payload CMS

- `pnpm generate:types` - Generate TypeScript types
- `pnpm generate:importmap` - Generate import map
- `pnpm payload` - Run Payload CLI commands

### Maintenance

- `pnpm clean` - Clean build cache
- `pnpm clean:all` - Clean all build artifacts and node_modules cache
- `pnpm reinstall` - Clean reinstall of dependencies

## Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/        # Frontend routes
│   │   └── (payload)/         # Payload admin routes
│   ├── collections/           # Payload collections
│   ├── globals/               # Payload globals
│   ├── pages/                 # Page collections (Blogs, Services, etc.)
│   ├── blocks/                # Content blocks
│   ├── components/            # React components
│   ├── fields/                # Reusable field configurations
│   ├── hooks/                 # Payload hooks
│   ├── access/                # Access control functions
│   ├── utilities/             # Utility functions
│   ├── plugins/               # Payload plugins configuration
│   ├── payload.config.ts      # Payload configuration
│   └── payload-types.ts       # Generated TypeScript types
├── public/                    # Static assets
├── tests/                     # Test files
│   ├── int/                   # Integration tests
│   └── e2e/                   # End-to-end tests
└── .kiro/                     # Kiro specs and documentation
```

## Development Workflow

### 1. Making Changes

1. Create a new branch for your feature/fix
2. Make your changes
3. Run validation: `pnpm validate`
4. Commit your changes

### 2. Adding New Collections

1. Create collection config in `src/collections/` or `src/pages/`
2. Add to `payload.config.ts`
3. Generate types: `pnpm generate:types`
4. Create frontend components if needed

### 3. Modifying Schema

1. Update collection/global configuration
2. Generate types: `pnpm generate:types`
3. Update any affected components
4. Test changes thoroughly

### 4. Adding New Features

1. Update requirements in `.kiro/specs/`
2. Implement feature following design patterns
3. Add tests for new functionality
4. Update documentation

## Code Quality Standards

### TypeScript

- Strict mode is enabled
- All code must pass type checking
- Use proper types, avoid `any`
- Generate types after schema changes

### ESLint

- Follow Next.js and TypeScript best practices
- Fix all linting errors before committing
- Use `pnpm lint:fix` for auto-fixable issues

### Prettier

- Code is automatically formatted
- Use `pnpm format` before committing
- Configuration in `.prettierrc.json`

### Git Hooks

Pre-commit hooks run automatically:

- Type checking
- Linting
- Format checking

## Testing

### Integration Tests

Located in `tests/int/`, these test:

- API endpoints
- Database operations
- Revalidation logic

```bash
pnpm test:int
```

### End-to-End Tests

Located in `tests/e2e/`, these test:

- Frontend functionality
- User workflows
- Full application behavior

```bash
pnpm test:e2e
```

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Secret key for JWT tokens (min 32 chars)

### Optional

- `NEXT_PUBLIC_SERVER_URL` - Base URL (required for production)
- `GA_PROPERTY_ID` - Google Analytics property ID
- `GA_CREDENTIALS_PATH` - Path to GA credentials JSON
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - GA measurement ID

See `.env.example` for complete list.

## Common Tasks

### Reset Database

```bash
# Drop and recreate database (PostgreSQL)
psql -U postgres -c "DROP DATABASE your_database;"
psql -U postgres -c "CREATE DATABASE your_database;"

# Restart dev server to run migrations
pnpm dev
```

### Clear Cache

```bash
# Clear Next.js cache
pnpm clean

# Full clean including node_modules cache
pnpm clean:all
```

### Update Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update <package-name>

# Check for outdated packages
pnpm outdated
```

## Troubleshooting

### Type Errors After Schema Changes

```bash
pnpm generate:types
pnpm type-check
```

### Build Errors

```bash
pnpm clean
pnpm reinstall
pnpm build
```

### Database Connection Issues

1. Check `DATABASE_URL` in `.env`
2. Verify PostgreSQL is running
3. Check database credentials
4. Ensure database exists

### Port Already in Use

```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Best Practices

### Security

- Never commit `.env` files
- Use strong `PAYLOAD_SECRET` (32+ chars)
- Always pass `req` in hooks for transaction safety
- Set `overrideAccess: false` when using Local API with user context

### Performance

- Use proper image optimization
- Implement caching strategies
- Optimize database queries
- Use proper indexing

### Code Organization

- Keep components small and focused
- Use TypeScript types consistently
- Follow existing patterns
- Document complex logic

### Git Workflow

- Write clear commit messages
- Keep commits focused and atomic
- Run validation before pushing
- Review your own changes first

## Resources

### External Documentation

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Project Documentation

- [Project Specifications](.kiro/specs/) - Feature specifications and design documents
- [Implementation Summaries](docs/IMPLEMENTATION_SUMMARIES.md) - Consolidated implementation details
- [Migration Guide](docs/MIGRATION.md) - Detailed migration and restructuring information

### Development Guidelines

- [Security Guidelines](.kiro/steering/security-critical.md) - Critical security patterns
- [Payload CMS Best Practices](.kiro/steering/payload-overview.md) - Development rules and patterns
- [Component Guidelines](src/components/blocks/ACCESSIBILITY.md) - Accessibility implementation guide
- [Analysis Tools](src/analysis-tools/README.md) - Code analysis and quality tools

## Getting Help

- Check existing documentation
- Review similar implementations in codebase
- Consult Payload CMS documentation
- Ask team members for guidance
