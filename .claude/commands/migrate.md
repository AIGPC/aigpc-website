---
description: Database migration commands for Payload CMS
---

# Database Migrations

## Create New Migration

After making changes to collections or fields, create a migration:

// turbo

```bash
pnpm payload migrate:create
```

## Run Migrations Locally

// turbo

```bash
pnpm payload migrate
```

## Run Migrations on Remote D1

// turbo

```bash
CLOUDFLARE_ENV=production pnpm run deploy:database
```

## Check Migration Status

// turbo

```bash
pnpm payload migrate:status
```

## Important Notes

- Always run `pnpm generate:types` after schema changes
- Test migrations locally before deploying to production
- Migrations are stored in `src/migrations/`
