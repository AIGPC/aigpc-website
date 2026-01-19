# AIGPC Website

Payload CMS + Next.js website deployed on Cloudflare Workers.

## Tech Stack

- **Framework**: Next.js 16.1.3, React 19
- **CMS**: Payload CMS 3.70
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Package Manager**: pnpm

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm devsafe          # Clean start (clears .next & .open-next)

# Code Quality
pnpm lint             # ESLint
tsc --noEmit          # TypeScript check

# Testing
pnpm test:int         # Vitest unit tests
pnpm test:e2e         # Playwright e2e tests

# Code Generation
pnpm generate:types   # Generate TypeScript types
pnpm generate:importmap  # Regenerate Payload import map

# Deployment
pnpm deploy           # Full deploy (migrate + build + deploy)
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/     # Public frontend routes
│   └── (payload)/      # Payload admin panel
├── collections/        # Payload collection configs
├── migrations/         # Database migrations
├── payload.config.ts   # Main Payload configuration
└── payload-types.ts    # Generated types
```

## Key Guidelines

1. **TypeScript-First**: Always use proper Payload types
2. **Run `pnpm generate:types`** after schema changes
3. **Pass `req`** to nested operations in hooks for transaction safety
4. **Set `overrideAccess: false`** when passing `user` to Local API

## Reference Documentation

- **[AGENTS.md](./AGENTS.md)** - Comprehensive Payload CMS development rules
- **[.cursor/rules/](./cursor/rules/)** - Detailed context files:
  - `security-critical.mdc` - Critical security patterns
  - `access-control.md` - Permission patterns
  - `hooks.md` - Lifecycle hooks
  - `components.md` - Custom admin components
  - `collections.md` - Collection configurations
