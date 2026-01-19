---
description: Deploy to Cloudflare Workers
---

# Deploy to Cloudflare

Follow these steps to deploy the application:

## Pre-flight Checks

1. Ensure you are authenticated with Cloudflare:

   ```bash
   pnpm wrangler whoami
   ```

2. Check for TypeScript errors:

   ```bash
   tsc --noEmit
   ```

3. Run tests:
   ```bash
   pnpm test:int
   ```

## Deploy

// turbo-all

1. Create migrations if there are schema changes:

   ```bash
   pnpm payload migrate:create
   ```

2. Set the environment and deploy:
   ```bash
   CLOUDFLARE_ENV=production pnpm deploy
   ```

This runs:

- Database migrations to D1
- OpenNext build
- Deploy to Cloudflare Workers
