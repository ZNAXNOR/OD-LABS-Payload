# Documentation Index

This directory contains comprehensive documentation for the PayloadCMS project.

## 📋 Documentation Overview

### Core Documentation

- [**Project README**](../README.md) - Main project overview and quick start guide
- [**Development Guide**](../DEVELOPMENT.md) - Complete development setup and workflow
- [**Migration Guide**](MIGRATION.md) - Project restructuring and migration details
- [**Implementation Summaries**](IMPLEMENTATION_SUMMARIES.md) - Consolidated feature implementations

### Specifications and Design

- [**Project Specifications**](../.kiro/specs/) - Detailed feature specifications and design documents
  - [PayloadCMS Restructuring](../.kiro/specs/payloadcms-restructuring/) - Main restructuring specification
  - [Blocks Components Analysis](../.kiro/specs/blocks-components-analysis-improvement/) - Block system improvements
  - [Pages Stability Improvement](../.kiro/specs/pages-stability-improvement/) - Page system enhancements
  - [RichText Editor Enhancement](../.kiro/specs/richtext-editor-enhancement/) - Editor improvements

### Technical Documentation

#### Database and Configuration

- [**Database Identifier Optimization**](DATABASE_IDENTIFIER_OPTIMIZATION.md) - Comprehensive guide to PostgreSQL identifier optimization
- [**Identifier Guidelines**](IDENTIFIER_GUIDELINES.md) - Quick reference for maintaining identifier compliance
- [**dbName Quick Reference**](DBNAME_QUICK_REFERENCE.md) - Developer quick reference for dbName usage
- [**dbName Usage Examples**](DBNAME_USAGE_EXAMPLES.md) - Comprehensive examples of proper dbName patterns

#### Security and Best Practices

- [**Security Guidelines**](../.kiro/steering/security-critical.md) - Critical security patterns and practices
- [**PayloadCMS Best Practices**](../.kiro/steering/payload-overview.md) - Development rules and patterns
- [**Access Control**](../.kiro/steering/access-control.md) - Access control implementation guide
- [**Hooks**](../.kiro/steering/hooks.md) - PayloadCMS hooks best practices

#### Component and Block System

- [**Accessibility Guide**](../src/components/blocks/ACCESSIBILITY.md) - WCAG 2.1 AA compliance implementation
- [**Block System Documentation**](../src/blocks/BLOCK_PREVIEWS.md) - Content block system and previews
- [**Performance Guidelines**](../src/components/blocks/PERFORMANCE.md) - Component performance optimization

#### Development Tools

- [**Analysis Tools**](../src/analysis-tools/README.md) - Code analysis and quality assurance tools
- [**Rich Text Features**](../src/fields/README.md) - Lexical editor configurations and features
- [**GraphQL Optimization**](../src/utilities/GRAPHQL_OPTIMIZATION.md) - API performance and security

#### Testing Documentation

- [**Performance Testing**](../tests/performance/README.md) - Performance testing guidelines
- [**RichText Testing**](../src/components/ui/RichText/testing/) - Specialized RichText component testing

## 🗂️ Documentation Categories

### By Audience

#### **Developers**

- [Development Guide](../DEVELOPMENT.md) - Setup, workflow, and best practices
- [Database Identifier Optimization](DATABASE_IDENTIFIER_OPTIMIZATION.md) - PostgreSQL identifier compliance
- [dbName Quick Reference](DBNAME_QUICK_REFERENCE.md) - Quick reference for identifier naming
- [Security Guidelines](../.kiro/steering/security-critical.md) - Critical security patterns
- [Analysis Tools](../src/analysis-tools/README.md) - Code quality tools

#### **Content Editors**

- [Block System](../src/blocks/BLOCK_PREVIEWS.md) - Available content blocks
- [Rich Text Features](../src/fields/README.md) - Editor capabilities
- [Example Pages](../src/pages/examples/README.md) - Page templates and examples

#### **System Administrators**

- [Migration Guide](MIGRATION.md) - Deployment and migration procedures
- [GraphQL Optimization](../src/utilities/GRAPHQL_OPTIMIZATION.md) - API configuration
- [Performance Guidelines](../src/components/blocks/PERFORMANCE.md) - System optimization

#### **Project Managers**

- [Project README](../README.md) - Project overview and features
- [Implementation Summaries](IMPLEMENTATION_SUMMARIES.md) - Feature completion status
- [Project Specifications](../.kiro/specs/) - Feature requirements and designs

### By Topic

#### **Architecture & Design**

- [Project Specifications](../.kiro/specs/) - System architecture and design decisions
- [Implementation Summaries](IMPLEMENTATION_SUMMARIES.md) - Implementation details and patterns
- [Migration Guide](MIGRATION.md) - Structural changes and evolution

#### **Security & Access Control**

- [Security Guidelines](../.kiro/steering/security-critical.md) - Security implementation patterns
- [Access Control](../.kiro/steering/access-control.md) - Permission and role management
- [GraphQL Security](../src/utilities/GRAPHQL_OPTIMIZATION.md) - API security measures

#### **Performance & Optimization**

- [Performance Guidelines](../src/components/blocks/PERFORMANCE.md) - Component optimization
- [GraphQL Optimization](../src/utilities/GRAPHQL_OPTIMIZATION.md) - API performance
- [Performance Testing](../tests/performance/README.md) - Performance validation

#### **Configuration & Database**

- [Database Identifier Optimization](DATABASE_IDENTIFIER_OPTIMIZATION.md) - Complete optimization guide
- [Identifier Guidelines](IDENTIFIER_GUIDELINES.md) - PostgreSQL compliance guidelines
- [dbName Usage Examples](DBNAME_USAGE_EXAMPLES.md) - Comprehensive usage patterns
- [Migration Guide](MIGRATION.md) - Deployment and migration procedures

#### **Content Management**

- [Block System](../src/blocks/BLOCK_PREVIEWS.md) - Content block documentation
- [Rich Text Features](../src/fields/README.md) - Editor capabilities
- [Example Pages](../src/pages/examples/README.md) - Content templates

#### **Development & Testing**

- [Development Guide](../DEVELOPMENT.md) - Development workflow
- [Analysis Tools](../src/analysis-tools/README.md) - Code quality assurance
- [Testing Documentation](../tests/performance/README.md) - Testing strategies

## 🔍 Quick Reference

### Common Tasks

- **Getting Started**: [README](../README.md) → [Development Guide](../DEVELOPMENT.md)
- **Database Configuration**: [Identifier Guidelines](IDENTIFIER_GUIDELINES.md) → [dbName Quick Reference](DBNAME_QUICK_REFERENCE.md)
- **Adding Features**: [Specifications](../.kiro/specs/) → [Best Practices](../.kiro/steering/)
- **Security Implementation**: [Security Guidelines](../.kiro/steering/security-critical.md)
- **Content Creation**: [Block System](../src/blocks/BLOCK_PREVIEWS.md) → [Examples](../src/pages/examples/README.md)
- **Performance Optimization**: [Performance Guidelines](../src/components/blocks/PERFORMANCE.md)

### Troubleshooting

- **Build Issues**: [Development Guide](../DEVELOPMENT.md#troubleshooting)
- **Database Identifier Issues**: [Identifier Guidelines](IDENTIFIER_GUIDELINES.md#troubleshooting) → [dbName Quick Reference](DBNAME_QUICK_REFERENCE.md)
- **Security Issues**: [Security Guidelines](../.kiro/steering/security-critical.md)
- **Performance Issues**: [Performance Guidelines](../src/components/blocks/PERFORMANCE.md)
- **Migration Issues**: [Migration Guide](MIGRATION.md)

## 📝 Documentation Standards

### Writing Guidelines

- Use clear, concise language
- Include code examples where applicable
- Maintain consistent formatting and structure
- Update documentation when making changes
- Link to related documentation

### File Organization

- Place documentation close to relevant code when possible
- Use descriptive filenames and directory structure
- Maintain this index when adding new documentation
- Follow the established naming conventions

### Maintenance

- Review documentation quarterly for accuracy
- Update links when files are moved or renamed
- Ensure all examples are tested and working
- Keep implementation summaries current

---

**Last Updated**: January 2026  
**Maintained By**: Development Team
