# Homepage Implementation Plan

**Project**: AIGPC Website - Homepage Redesign with Multi-Language Support
**Date**: 2026-01-20
**Target Completion**: TBD
**Status**: Ready for Implementation

---

## Overview

This document outlines the step-by-step implementation plan for rebuilding the AIGPC homepage with:
- Modern animations using Framer Motion
- Tailwind CSS 4.x styling with shadcn/ui components
- Multi-language support (English/Thai) using next-intl
- Payload CMS integration for content management
- Optimized performance for Cloudflare Workers deployment

---

## Phase 1: Foundation Setup

### 1.1 Install Core Dependencies

**Package Installations**:
```bash
# Animation library
pnpm add framer-motion

# Multi-language support
pnpm add next-intl

# UI component utilities
pnpm add class-variance-authority clsx tailwind-merge
pnpm add @radix-ui/react-slot

# Icons
pnpm add lucide-react

# Development dependencies
pnpm add -D @tailwindcss/typography
```

### 1.2 Upgrade Tailwind CSS to 4.x

**Action Items**:
1. Update `tailwind.config.ts` to v4 syntax
2. Migrate from `@apply` to CSS layers if needed
3. Test existing styles for compatibility
4. Update PostCSS configuration if required

**Files to Modify**:
- `tailwind.config.ts`
- `src/app/(frontend)/styles.css`

### 1.3 Initialize shadcn/ui

**Setup Commands**:
```bash
# Initialize shadcn (if not already done)
npx shadcn@latest init

# Add essential components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add navigation-menu
npx shadcn@latest add separator
```

**Configuration**:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Component path: `@/components/ui`

### 1.4 Set Up Multi-Language Structure

**Directory Structure to Create**:
```
src/
├── app/
│   ├── [locale]/              # New locale-based routing
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── research/
│   │   ├── observatory/
│   │   ├── capacity/
│   │   ├── expert/
│   │   └── activities/
│   └── middleware.ts          # Language detection
├── i18n/
│   ├── request.ts             # Server-side i18n
│   └── routing.ts             # Routing configuration
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── home.json
    │   └── navigation.json
    └── th/
        ├── common.json
        ├── home.json
        └── navigation.json
```

**Files to Create**:

1. **`src/i18n/routing.ts`**
```typescript
import { defineRouting } from 'next-intl/routing'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
```

2. **`src/i18n/request.ts`**
```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`@/locales/${locale}/common.json`)).default
  }
})
```

3. **`src/middleware.ts`**
```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(th|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
}
```

### 1.5 Configure Payload CMS for Localization

**Modify `src/payload.config.ts`**:
```typescript
export default buildConfig({
  // ... existing config
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'th',
        label: 'ไทย',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  // ... rest of config
})
```

### 1.6 Create Translation Files

**Initial Translation Keys**:

**`locales/en/common.json`**:
```json
{
  "siteName": "AIGPC",
  "siteDescription": "AI Governance Practice Center",
  "contactEmail": "contact@aigpc.or.th",
  "contactPhone": "+66 2 123 1234",
  "organizationFull": "Electronic Transactions Development Agency"
}
```

**`locales/en/navigation.json`**:
```json
{
  "home": "Home",
  "about": "About Us",
  "research": "R & D",
  "observatory": "AI Observatory",
  "capacity": "Capacity Building",
  "expert": "Expert Network",
  "activities": "Activities & Events"
}
```

**`locales/en/home.json`**:
```json
{
  "hero": {
    "title": "Ethical AI In Action",
    "subtitle": "From Local Wisdom To Global Alignment",
    "description": "From Local Wisdom To Global Alignment, We Drive The Future Of Responsible And Inclusive AI Adoption Worldwide."
  },
  "events": {
    "title": "Events Feed",
    "viewAll": "View All Events"
  },
  "about": {
    "title": "About AIGPC",
    "description": "The AI Governance Practice Center (AIGPC) is a new initiative proposed for formal establishment since 2023, representing the strategic evolution and international expansion of the existing AI governance center (AIGC), which was established in 2021 under the Electronic Transactions Development Agency (ETDA).",
    "quoteTitle": "Why UNESCO & Why C2C",
    "quoteDescription": "Alignment with UNESCO Outcome/ SDGs",
    "moreDetails": "More Details"
  },
  "sdg": {
    "title": "SDG Dashboard",
    "subtitle": "User Interaction Flow & Visual Feedback"
  },
  "collaboration": {
    "title": "In Collaboration With"
  }
}
```

**Thai translations** (`locales/th/*.json`): TBD - will need translation services

---

## Phase 2: Component Development

### 2.1 Create Base Layout Components

**Components to Build**:

1. **`components/layout/Header.tsx`**
   - Logo component with Next.js Image
   - Navigation menu with locale-aware links
   - Language switcher dropdown
   - Responsive mobile menu
   - Sticky header behavior

2. **`components/layout/Footer.tsx`**
   - Organization info
   - Contact details with translation support
   - Social media links
   - Copyright notice

3. **`components/layout/LanguageSwitcher.tsx`**
   - Dropdown for language selection
   - Persists locale in cookie/URL
   - Smooth transition between languages

### 2.2 Create Reusable UI Components

**Components to Build**:

1. **`components/ui/AnimatedSection.tsx`**
```typescript
// Wrapper for scroll-triggered animations
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function AnimatedSection({ children, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

2. **`components/ui/EventCard.tsx`**
   - Card with image, date, description
   - Hover animations (scale, shadow)
   - Locale-aware date formatting
   - Link to full event details

3. **`components/ui/PartnerLogo.tsx`**
   - Logo image with hover effect
   - Grayscale to color transition
   - Optional link to partner website

4. **`components/ui/Container.tsx`**
   - Max-width wrapper with responsive padding
   - Consistent spacing across sections

### 2.3 Create Homepage Sections

**Section Components**:

1. **`components/sections/HeroSection.tsx`**
   - Full-width background with Next.js Image
   - Animated text with stagger effect
   - Parallax scrolling on background
   - Translatable content

2. **`components/sections/EventsFeed.tsx`**
   - Fetches events from Payload CMS
   - Grid layout with EventCard components
   - Stagger animation on cards
   - Filter by locale

3. **`components/sections/AboutSection.tsx`**
   - Two-column layout (text + quote box)
   - Animated quote box entrance
   - CTA button with hover effect
   - Network visualization background

4. **`components/sections/SDGDashboard.tsx`**
   - Placeholder for interactive dashboard
   - Static mockup for Phase 1
   - Animation on scroll into view

5. **`components/sections/CollaborationSection.tsx`**
   - Fetches partners from Payload CMS
   - Logo grid with hover effects
   - Stagger animation on logos
   - Responsive grid (6 cols → 3 → 2)

---

## Phase 3: Payload CMS Collections

### 3.1 Create Events Collection

**File**: `src/collections/Events.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'locale'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
```

### 3.2 Create Partners Collection

**File**: `src/collections/Partners.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Partner website URL',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
}
```

### 3.3 Create Homepage Global

**File**: `src/globals/Homepage.ts`

```typescript
import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About Section',
      fields: [
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'quoteTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'quoteDescription',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'unescoImage',
      type: 'upload',
      relationTo: 'media',
      label: 'UNESCO Forum Banner Image',
    },
  ],
}
```

### 3.4 Update Payload Config

**Modify `src/payload.config.ts`**:
```typescript
import { Events } from './collections/Events'
import { Partners } from './collections/Partners'
import { Homepage } from './globals/Homepage'

export default buildConfig({
  collections: [
    Users,
    Media,
    Events,     // Add
    Partners,   // Add
  ],
  globals: [
    Homepage,   // Add
  ],
  // ... rest of config
})
```

### 3.5 Generate Database Migrations

```bash
pnpm generate:types
pnpm payload migrate:create add-events-and-partners
```

---

## Phase 4: Homepage Implementation

### 4.1 Create Locale Layout

**File**: `src/app/[locale]/layout.tsx`

```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '@/app/(frontend)/styles.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 4.2 Implement Homepage

**File**: `src/app/[locale]/page.tsx`

```typescript
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import HeroSection from '@/components/sections/HeroSection'
import EventsFeed from '@/components/sections/EventsFeed'
import AboutSection from '@/components/sections/AboutSection'
import SDGDashboard from '@/components/sections/SDGDashboard'
import CollaborationSection from '@/components/sections/CollaborationSection'

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const payload = await getPayloadHMR({ config })

  // Fetch data
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    locale,
  })

  const events = await payload.find({
    collection: 'events',
    locale,
    limit: 3,
    sort: '-date',
  })

  const partners = await payload.find({
    collection: 'partners',
    sort: 'order',
  })

  return (
    <div className="homepage">
      <HeroSection data={homepage.hero} />
      <EventsFeed events={events.docs} />
      <AboutSection data={homepage.about} />
      <div className="w-full">
        <img
          src={homepage.unescoImage.url}
          alt="UNESCO Global Forum"
          className="w-full h-auto"
        />
      </div>
      <SDGDashboard />
      <CollaborationSection partners={partners.docs} />
    </div>
  )
}
```

### 4.3 Implement Animations

**Animation Patterns**:

1. **Hero Section**:
   - Title: Fade in + slide up with 0.2s delay
   - Subtitle: Fade in + slide up with 0.4s delay
   - Description: Fade in + slide up with 0.6s delay
   - Background: Subtle parallax on scroll

2. **Events Cards**:
   - Container: Fade in on scroll
   - Cards: Stagger animation (0.1s between each)
   - Hover: Scale 1.03, shadow increase

3. **About Section**:
   - Text: Fade in from left
   - Quote box: Fade in from right with delay
   - Button: Hover scale 1.05

4. **Partner Logos**:
   - Grid: Fade in on scroll
   - Logos: Stagger animation (0.05s between each)
   - Hover: Grayscale 0 → 100%, scale 1.1

### 4.4 Responsive Styling

**Breakpoint Strategy**:
```css
/* Mobile First */
.hero-title {
  @apply text-3xl md:text-5xl lg:text-6xl xl:text-7xl;
}

.events-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.partner-grid {
  @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8;
}

.container {
  @apply mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
}
```

---

## Phase 5: Testing & Optimization

### 5.1 Unit Tests

**Test Files to Create**:
- `__tests__/components/sections/HeroSection.test.tsx`
- `__tests__/components/layout/LanguageSwitcher.test.tsx`
- `__tests__/i18n/routing.test.ts`

### 5.2 E2E Tests

**Playwright Test Scenarios**:
```typescript
// tests/e2e/homepage.spec.ts
test('homepage loads correctly in English', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { name: 'Ethical AI In Action' })).toBeVisible()
})

test('language switcher changes content', async ({ page }) => {
  await page.goto('/en')
  await page.click('[data-testid="language-switcher"]')
  await page.click('[data-testid="language-th"]')
  await expect(page.url()).toContain('/th')
})

test('events are displayed', async ({ page }) => {
  await page.goto('/en')
  const eventCards = page.locator('[data-testid="event-card"]')
  await expect(eventCards).toHaveCount(3)
})
```

### 5.3 Performance Testing

**Metrics to Measure**:
- Lighthouse CI in GitHub Actions
- Bundle size analysis
- Core Web Vitals monitoring
- Animation frame rate (should be 60fps)

**Optimization Checklist**:
- [ ] Images optimized with Next.js Image
- [ ] Lazy loading below-the-fold content
- [ ] Code splitting for heavy components
- [ ] Minimize JavaScript bundle size
- [ ] Use CSS transforms for animations (not margin/padding)
- [ ] Implement proper caching headers

### 5.4 Accessibility Audit

**Testing Tools**:
- axe DevTools
- WAVE browser extension
- Manual keyboard navigation testing
- Screen reader testing (VoiceOver/NVDA)

**Checklist**:
- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works on all interactive elements
- [ ] Focus indicators are visible
- [ ] Language switching is accessible
- [ ] Animations respect `prefers-reduced-motion`

---

## Phase 6: Deployment

### 6.1 Pre-Deployment Checklist

- [ ] Run `pnpm generate:types`
- [ ] Run `pnpm lint` - zero errors
- [ ] Run `tsc --noEmit` - zero errors
- [ ] Run `pnpm test:int` - all tests pass
- [ ] Run `pnpm test:e2e` - all tests pass
- [ ] Test build locally: `pnpm build`
- [ ] Test preview: `pnpm preview`
- [ ] Verify environment variables in Cloudflare

### 6.2 Database Migration

```bash
# Staging environment
CLOUDFLARE_ENV=staging pnpm deploy:database

# Production environment
CLOUDFLARE_ENV=production pnpm deploy:database
```

### 6.3 Application Deployment

```bash
# Staging
CLOUDFLARE_ENV=staging pnpm deploy:app

# Production
CLOUDFLARE_ENV=production pnpm deploy:app
```

### 6.4 Post-Deployment Verification

- [ ] Homepage loads in both languages
- [ ] Language switcher works
- [ ] Events display correctly
- [ ] Partner logos load
- [ ] Animations perform smoothly
- [ ] Mobile responsiveness verified
- [ ] Console has zero errors
- [ ] Lighthouse scores meet targets

---

## Timeline Estimates

**Phase 1: Foundation Setup** - 2-3 hours
**Phase 2: Component Development** - 4-6 hours
**Phase 3: Payload CMS Collections** - 2-3 hours
**Phase 4: Homepage Implementation** - 3-4 hours
**Phase 5: Testing & Optimization** - 3-4 hours
**Phase 6: Deployment** - 1-2 hours

**Total Estimated Time**: 15-22 hours

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Tailwind CSS 4.x Breaking Changes**
   - Mitigation: Thorough testing, maintain v3 fallback
   - Rollback plan: Pin to Tailwind CSS 3.x

2. **next-intl Middleware Conflicts with Cloudflare**
   - Mitigation: Test middleware locally with Cloudflare Workers
   - Alternative: Client-side language detection

3. **Animation Performance on Mobile**
   - Mitigation: Use CSS transforms, test on real devices
   - Fallback: Disable complex animations on low-end devices

4. **Payload CMS Localization Complexity**
   - Mitigation: Start with simple fields, expand gradually
   - Reference: Payload docs on localization

---

## Success Criteria

### Must-Have (MVP)
- ✅ Multi-language support (English/Thai)
- ✅ All homepage sections implemented
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Basic animations on scroll
- ✅ CMS-managed content
- ✅ Accessibility compliance (WCAG AA)

### Nice-to-Have (Future Iterations)
- Advanced interactive SDG Dashboard
- Video backgrounds in hero section
- Advanced animation sequences
- More granular language switching per component
- User preference persistence

---

## Appendix

### A. Useful Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm devsafe                # Clean start

# Code Quality
pnpm lint                   # Run ESLint
tsc --noEmit                # Type check

# Testing
pnpm test:int               # Unit tests
pnpm test:e2e               # E2E tests

# Payload
pnpm generate:types         # Generate TS types
pnpm generate:importmap     # Update import map
pnpm payload migrate:create # Create migration

# Deployment
pnpm deploy                 # Full deploy
```

### B. Key Files Reference

- Configuration: `src/payload.config.ts`, `tailwind.config.ts`
- Routing: `src/middleware.ts`, `src/i18n/routing.ts`
- Layout: `src/app/[locale]/layout.tsx`
- Homepage: `src/app/[locale]/page.tsx`
- Collections: `src/collections/*.ts`
- Globals: `src/globals/*.ts`
- Components: `src/components/**/*.tsx`
- Translations: `src/locales/**/*.json`

### C. External Resources

- Next.js 16 Docs: https://nextjs.org/docs
- next-intl Docs: https://next-intl-docs.vercel.app/
- Framer Motion Docs: https://www.framer.com/motion/
- Tailwind CSS 4 Docs: https://tailwindcss.com/
- shadcn/ui Components: https://ui.shadcn.com/
- Payload CMS Docs: https://payloadcms.com/docs

---

**Document Version**: 1.0
**Last Updated**: 2026-01-20
**Status**: Ready for Implementation
