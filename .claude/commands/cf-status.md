---
description: Check Cloudflare resources status
---

# Cloudflare Status

## Check Wrangler Authentication

// turbo

```bash
pnpm wrangler whoami
```

## List D1 Databases

// turbo

```bash
pnpm wrangler d1 list
```

## List R2 Buckets

// turbo

```bash
pnpm wrangler r2 bucket list
```

## List Workers

// turbo

```bash
pnpm wrangler deployments list
```

## View Worker Logs (Tail)

```bash
pnpm wrangler tail
```

## Check D1 Database Info

// turbo

```bash
pnpm wrangler d1 info D1 --env=production
```
