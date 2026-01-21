# PayloadCMS Project

A modern, full-stack web application built with PayloadCMS 3, Next.js 15, and TypeScript. This project features a comprehensive content management system with a rich block-based editor, user authentication, and optimized performance.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate types
pnpm generate:types

# Start development server
pnpm dev
```

Visit:

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📋 Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+
- PostgreSQL database

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/        # Public website routes
│   │   └── (payload)/         # Admin panel routes
│   ├── collections/           # PayloadCMS collections
│   ├── pages/                 # Page-type collections
│   ├── blocks/                # Content blocks (25 types)
│   ├── components/            # React components
│   ├── utilities/             # Utility functions
│   ├── fields/                # Reusable field configurations
│   ├── hooks/                 # PayloadCMS hooks
│   ├── access/                # Access control functions
│   └── payload.config.ts      # PayloadCMS configuration
├── tests/                     # Test suites
├── .kiro/                     # Project specifications
└── docs/                      # Documentation
```

## 🎯 Key Features

### Content Management

- **25 Content Blocks** organized in 7 categories (Hero, Content, Services, Portfolio, Technical, CTA, Layout)
- **Rich Text Editor** with Lexical and comprehensive formatting options
- **Media Management** with automatic processing and optimization
- **User Authentication** with role-based access control

### Performance & Security

- **Next.js 15** with App Router and Server Components
- **GraphQL Optimization** with query complexity limiting and rate limiting
- **Automatic Revalidation** for optimal caching and performance
- **Security Best Practices** with proper access control and validation

### Developer Experience

- **TypeScript** throughout with strict type checking
- **Comprehensive Testing** (unit, integration, e2e, performance, property-based)
- **Code Analysis Tools** for quality assurance
- **Hot Reloading** and development optimizations

## 📚 Documentation

### Getting Started

- [**Development Guide**](DEVELOPMENT.md) - Complete setup and development workflow
- [**Migration Guide**](docs/MIGRATION.md) - Project restructuring and migration details

### Implementation Details

- [**Implementation Summaries**](docs/IMPLEMENTATION_SUMMARIES.md) - Consolidated feature implementations
- [**Project Specifications**](.kiro/specs/) - Detailed feature specifications and designs

### Development Guidelines

- [**Security Guidelines**](.kiro/steering/security-critical.md) - Critical security patterns
- [**PayloadCMS Best Practices**](.kiro/steering/payload-overview.md) - Development rules and patterns
- [**Accessibility Guide**](src/components/blocks/ACCESSIBILITY.md) - WCAG 2.1 AA compliance

### Technical References

- [**Analysis Tools**](src/analysis-tools/README.md) - Code analysis and quality tools
- [**GraphQL Optimization**](src/utilities/GRAPHQL_OPTIMIZATION.md) - API performance and security
- [**Rich Text Features**](src/fields/README.md) - Lexical editor configurations
- [**Block System**](src/blocks/BLOCK_PREVIEWS.md) - Content block documentation

## 🛠️ Development Scripts

### Core Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm generate:types   # Generate TypeScript types
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking
pnpm validate         # Run all checks
```

### Testing

```bash
pnpm test             # Run all tests
pnpm test:int         # Integration tests
pnpm test:e2e         # End-to-end tests
pnpm test:perf        # Performance tests
pnpm test:pbt         # Property-based tests
```

### Maintenance

```bash
pnpm clean            # Clean build cache
pnpm clean:all        # Full clean including node_modules
pnpm reinstall        # Clean reinstall dependencies
```

## 🏛️ Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **CMS**: PayloadCMS 3 with PostgreSQL
- **Language**: TypeScript with ES Modules
- **Styling**: Tailwind CSS with CSS Modules
- **Editor**: Lexical Rich Text Editor
- **Testing**: Vitest, Playwright, Property-Based Testing

### Key Patterns

- **Server Components** for optimal performance
- **Index-based Exports** for clean imports
- **Category-based Organization** for maintainability
- **Hook-based Architecture** for extensibility
- **Type-safe Operations** throughout

## 🔒 Security

This project implements comprehensive security measures:

- **Access Control**: Role-based permissions on all collections and fields
- **Input Validation**: Comprehensive validation rules and sanitization
- **GraphQL Security**: Query complexity limiting and rate limiting
- **Authentication**: Secure JWT-based authentication with proper session management
- **CSRF Protection**: Built-in protection against cross-site request forgery

See [Security Guidelines](.kiro/steering/security-critical.md) for detailed security patterns.

## 🎨 Content Blocks

The project includes 25 content blocks organized in 7 categories:

| Category             | Blocks | Purpose                            |
| -------------------- | ------ | ---------------------------------- |
| **Hero**             | 1      | Prominent header sections          |
| **Content**          | 4      | General content and media          |
| **Services**         | 4      | Service offerings and pricing      |
| **Portfolio**        | 4      | Project showcases and case studies |
| **Technical**        | 5      | Code, features, and documentation  |
| **CTA & Conversion** | 4      | Lead generation and conversion     |
| **Layout**           | 3      | Structural elements and spacing    |

See [Block Documentation](src/blocks/BLOCK_PREVIEWS.md) for detailed information.

## 🧪 Testing

Comprehensive testing strategy with multiple test types:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database integration testing
- **End-to-End Tests**: Full user workflow testing with Playwright
- **Performance Tests**: Load and performance benchmarking
- **Property-Based Tests**: Formal correctness verification

All tests are configured to run in CI/CD pipelines with proper coverage reporting.

## 🚀 Deployment

### Environment Variables

Required environment variables:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/database
PAYLOAD_SECRET=your-32-character-secret-key
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

See `.env.example` for complete list of environment variables.

### Production Deployment

1. **Build the application**:

   ```bash
   pnpm build
   ```

2. **Set up database**:
   - Ensure PostgreSQL is running
   - Database migrations run automatically

3. **Start production server**:
   ```bash
   pnpm start
   ```

### Docker Deployment

```bash
# Build Docker image
docker build -t payloadcms-project .

# Run container
docker run -p 3000:3000 --env-file .env payloadcms-project
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the development guidelines
4. **Run tests**: `pnpm validate && pnpm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode requirements
- Maintain test coverage for new features
- Follow accessibility guidelines (WCAG 2.1 AA)
- Use semantic commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Development Guide](DEVELOPMENT.md)
- **Issues**: Open an issue on GitHub
- **Security**: Report security issues privately
- **Community**: Join the PayloadCMS Discord community

## 🙏 Acknowledgments

- [PayloadCMS](https://payloadcms.com/) for the excellent headless CMS
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel](https://vercel.com/) for deployment platform
- All contributors and the open-source community

---

**Built with ❤️ using PayloadCMS, Next.js, and TypeScript**
