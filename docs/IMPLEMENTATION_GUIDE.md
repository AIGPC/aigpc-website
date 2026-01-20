# AIGPC Website - Implementation Guide

**Last Updated**: 2026-01-20
**Version**: 1.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Multi-Language Architecture](#multi-language-architecture)
4. [Animation Strategy](#animation-strategy)
5. [Component Architecture](#component-architecture)
6. [Payload CMS Integration](#payload-cms-integration)
7. [Styling Guidelines](#styling-guidelines)
8. [Performance Optimization](#performance-optimization)
9. [Accessibility](#accessibility)
10. [Testing Strategy](#testing-strategy)

---

## Project Overview

The AIGPC (AI Governance Practice Center) website is a multilingual, content-managed platform built with Next.js 16 and Payload CMS, featuring:

- **Modern animations** using Framer Motion
- **Multi-language support** (English/Thai) with next-intl
- **CMS-powered content** via Payload CMS
- **Tailwind CSS 4.x** with shadcn/ui components
- **Cloudflare Workers** deployment for global edge distribution

### Key Features
- Responsive design (mobile-first approach)
- Scroll-triggered animations
- Language switching with URL-based routing
- Dynamic content from Payload CMS
- Optimized performance for Core Web Vitals

---

## Tech Stack

### Core Framework
- **Next.js 16.1.3** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5.9.3** - Type safety

### Styling & Animation
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Reusable component library
- **Radix UI** - Headless UI primitives

### Content Management
- **Payload CMS 3.72.0** - Headless CMS
- **Cloudflare D1** - SQLite database
- **Cloudflare R2** - Object storage for media

### Internationalization
- **next-intl** - i18n for Next.js App Router

### Deployment
- **Cloudflare Workers** - Edge runtime
- **@opennextjs/cloudflare** - Next.js adapter for Cloudflare

---

## Multi-Language Architecture

### Routing Structure

The application uses path-based routing with locale prefixes:

```
/                  → Default locale (en)
/en/about          → English About page
/th/about          → Thai About page
```

### Directory Structure

```
src/
├── app/
│   ├── [locale]/              # Dynamic locale segment
│   │   ├── layout.tsx         # Locale-aware layout
│   │   ├── page.tsx           # Homepage
│   │   └── [routes]/          # Other pages
│   └── middleware.ts          # Language detection
├── i18n/
│   ├── request.ts             # Server-side i18n config
│   └── routing.ts             # Routing configuration
└── locales/
    ├── en/                    # English translations
    │   ├── common.json
    │   ├── home.json
    │   └── navigation.json
    └── th/                    # Thai translations
        ├── common.json
        ├── home.json
        └── navigation.json
```

### Translation File Structure

**Common translations** (`common.json`):
```json
{
  "siteName": "AIGPC",
  "siteDescription": "AI Governance Practice Center",
  "contactEmail": "contact@aigpc.or.th",
  "contactPhone": "+66 2 123 1234"
}
```

**Page-specific translations** (`home.json`):
```json
{
  "hero": {
    "title": "Ethical AI In Action",
    "subtitle": "From Local Wisdom To Global Alignment"
  },
  "events": {
    "title": "Events Feed"
  }
}
```

### Using Translations

**In Server Components**:
```typescript
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

// Option 1: Hook (in client components)
const t = useTranslations('home')
<h1>{t('hero.title')}</h1>

// Option 2: Server function (in server components)
const t = await getTranslations('home')
<h1>{t('hero.title')}</h1>
```

**Locale-aware Navigation**:
```typescript
import { Link } from '@/i18n/routing'

<Link href="/about">About Us</Link>
// Automatically becomes /en/about or /th/about
```

### Language Switcher Component

```typescript
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div>
      <button onClick={() => switchLanguage('en')}>EN</button>
      <button onClick={() => switchLanguage('th')}>TH</button>
    </div>
  )
}
```

---

## Animation Strategy

### Animation Library: Framer Motion

Framer Motion provides declarative animations with excellent performance.

### Key Animation Patterns

#### 1. Scroll-Triggered Animations

**Reusable Component** (`components/ui/AnimatedSection.tsx`):
```typescript
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  delay = 0
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Usage**:
```typescript
<AnimatedSection>
  <h2>This section fades in on scroll</h2>
</AnimatedSection>
```

#### 2. Stagger Animations

For animating lists or grids:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-3 gap-6"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      <EventCard {...item} />
    </motion.div>
  ))}
</motion.div>
```

#### 3. Hero Section Animation

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    {t('hero.title')}
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    {t('hero.description')}
  </motion.p>
</motion.div>
```

#### 4. Card Hover Animations

```typescript
<motion.div
  whileHover={{ scale: 1.03, y: -5 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
  className="card"
>
  <EventCard {...props} />
</motion.div>
```

### Performance Best Practices

1. **Use CSS transforms** (x, y, scale, rotate) instead of layout properties
2. **Enable GPU acceleration** with transform3d
3. **Respect user preferences**:
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const animations = prefersReducedMotion ? {} : {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}
```

4. **Use `once: true`** for scroll animations to prevent re-triggering
5. **Lazy load Framer Motion** for components below the fold

---

## Component Architecture

### Component Categories

#### 1. Layout Components (`components/layout/`)

**Header.tsx**:
- Logo
- Navigation menu
- Language switcher
- Mobile hamburger menu

**Footer.tsx**:
- Organization info
- Contact details
- Social links
- Copyright

**Container.tsx**:
```typescript
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
```

#### 2. Section Components (`components/sections/`)

**HeroSection.tsx**:
- Full-width background image
- Animated headline and text
- Parallax effect

**EventsFeed.tsx**:
- Fetch events from CMS
- Grid of event cards
- Stagger animation

**AboutSection.tsx**:
- Text content
- Quote box
- CTA button

**CollaborationSection.tsx**:
- Partner logo grid
- Hover effects

#### 3. UI Components (`components/ui/`)

**EventCard.tsx**:
```typescript
interface EventCardProps {
  title: string
  date: Date
  description: string
  image: string
  slug: string
}

export function EventCard({
  title,
  date,
  description,
  image,
  slug
}: EventCardProps) {
  const locale = useLocale()

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group relative overflow-hidden rounded-xl"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
        <div className="absolute bottom-0 p-6">
          <time className="text-yellow-400 text-sm font-semibold">
            {formatDate(date, locale)}
          </time>
          <h3 className="text-white text-xl font-bold mt-2">{title}</h3>
          <p className="text-gray-200 text-sm mt-2">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
```

### Component Patterns

#### Server vs Client Components

**Use Server Components** (default) for:
- Static content
- Data fetching from CMS
- SEO-important content

**Use Client Components** (`'use client'`) for:
- Animations (Framer Motion)
- Interactive elements
- State management
- Browser APIs

#### Composition Pattern

Break large sections into smaller components:

```typescript
// ❌ Bad: Monolithic component
export function Homepage() {
  return (
    <div>
      {/* 500 lines of code */}
    </div>
  )
}

// ✅ Good: Composed from smaller components
export function Homepage() {
  return (
    <>
      <HeroSection />
      <EventsFeed />
      <AboutSection />
      <CollaborationSection />
    </>
  )
}
```

---

## Payload CMS Integration

### Collections

#### Events Collection

**Purpose**: Manage event listings for homepage and events page

**Fields**:
- `title` (localized) - Event name
- `slug` (unique) - URL-friendly identifier
- `date` - Event date
- `description` (localized) - Short description
- `featuredImage` - Main image
- `content` (localized) - Full rich text content

**Fetching Events**:
```typescript
const payload = await getPayloadHMR({ config })

const events = await payload.find({
  collection: 'events',
  locale: params.locale,
  limit: 3,
  sort: '-date',
  where: {
    date: {
      greater_than_equal: new Date()
    }
  }
})
```

#### Partners Collection

**Purpose**: Manage collaboration partner logos

**Fields**:
- `name` - Partner organization name
- `logo` - Logo image
- `url` - Partner website
- `order` - Display order

**Fetching Partners**:
```typescript
const partners = await payload.find({
  collection: 'partners',
  sort: 'order',
  limit: 12
})
```

### Globals

#### Homepage Global

**Purpose**: Manage homepage-specific content

**Sections**:
- Hero (background image, title, subtitle, description)
- About (description, quote)
- UNESCO banner image

**Fetching Homepage Data**:
```typescript
const homepage = await payload.findGlobal({
  slug: 'homepage',
  locale: params.locale
})
```

### Enabling Localization

In `payload.config.ts`:
```typescript
export default buildConfig({
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'th', label: 'ไทย' }
    ],
    defaultLocale: 'en',
    fallback: true
  },
  // ...
})
```

Mark fields as localized:
```typescript
{
  name: 'title',
  type: 'text',
  localized: true  // ← This field has different values per language
}
```

---

## Styling Guidelines

### Tailwind CSS 4.x

#### Color Palette

Define custom colors in `tailwind.config.ts`:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        'aigpc-blue': '#0B192E',
        'aigpc-gold': '#FDB913',
      }
    }
  }
}
```

Usage:
```tsx
<div className="bg-aigpc-blue text-aigpc-gold">
  AIGPC
</div>
```

#### Typography

```tsx
// Headings
<h1 className="text-5xl md:text-7xl font-bold">Hero Title</h1>
<h2 className="text-3xl md:text-5xl font-semibold">Section Title</h2>

// Body text
<p className="text-base md:text-lg text-gray-600">
  Description text
</p>
```

#### Spacing

Follow consistent spacing:
```tsx
// Section padding
<section className="py-20 md:py-32">

// Container spacing
<div className="space-y-8">  {/* Vertical spacing between children */}
<div className="space-x-4">  {/* Horizontal spacing */}
```

#### Responsive Design

Mobile-first approach:
```tsx
<div className="
  grid
  grid-cols-1     /* Mobile: 1 column */
  md:grid-cols-2  /* Tablet: 2 columns */
  lg:grid-cols-3  /* Desktop: 3 columns */
  gap-6
">
```

### shadcn/ui Components

#### Button

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  More Details
</Button>

<Button variant="outline">
  Learn More
</Button>
```

#### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Event Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Event description</p>
  </CardContent>
</Card>
```

### CSS Custom Properties

For theme values:
```css
:root {
  --color-primary: #0B192E;
  --color-accent: #FDB913;
  --spacing-section: 5rem;
}

@media (max-width: 768px) {
  :root {
    --spacing-section: 3rem;
  }
}
```

---

## Performance Optimization

### Image Optimization

Always use Next.js Image component:
```tsx
import Image from 'next/image'

<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  fill
  priority  // For above-the-fold images
  className="object-cover"
  sizes="100vw"
/>

<Image
  src={event.image}
  alt={event.title}
  width={400}
  height={300}
  loading="lazy"  // For below-the-fold images
  placeholder="blur"
  blurDataURL={event.blurDataURL}
/>
```

### Code Splitting

Lazy load heavy components:
```typescript
import dynamic from 'next/dynamic'

const SDGDashboard = dynamic(
  () => import('@/components/sections/SDGDashboard'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false  // If component doesn't need SSR
  }
)
```

### Caching Strategy

Static generation for all pages:
```typescript
// Generate static pages for all locales
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'th' }
  ]
}

// Revalidate when CMS content changes
export const revalidate = 3600  // Revalidate every hour
```

### Bundle Optimization

```typescript
// Analyze bundle size
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Monitor:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

Ensure 4.5:1 ratio for normal text, 3:1 for large text:
```tsx
// ✅ Good contrast
<div className="bg-aigpc-blue text-white">  {/* High contrast */}

// ❌ Poor contrast
<div className="bg-gray-200 text-gray-300">  {/* Low contrast */}
```

#### Keyboard Navigation

All interactive elements must be keyboard accessible:
```tsx
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Click me
</button>
```

#### Focus Indicators

Ensure visible focus states:
```css
button:focus-visible {
  @apply ring-2 ring-aigpc-gold outline-none;
}
```

#### Semantic HTML

Use proper HTML elements:
```tsx
// ✅ Good
<nav>
  <ul>
    <li><Link href="/about">About</Link></li>
  </ul>
</nav>

// ❌ Bad
<div>
  <div>
    <div><a href="/about">About</a></div>
  </div>
</div>
```

#### Alt Text

Descriptive alt text for images:
```tsx
// ✅ Good
<Image
  src="/event.jpg"
  alt="Participants discussing AI ethics at the 2024 UNESCO Forum"
/>

// ❌ Bad
<Image src="/event.jpg" alt="event" />
```

#### ARIA Labels

Use ARIA for screen readers:
```tsx
<button aria-label="Switch to Thai language" onClick={switchToThai}>
  TH
</button>

<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

#### Reduced Motion

Respect user preferences:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    duration: 0.5,
    ease: "easeOut"
  }}
  // Disable animation if user prefers reduced motion
  {...(prefersReducedMotion && {
    initial: {},
    animate: {},
    transition: { duration: 0 }
  })}
>
```

---

## Testing Strategy

### Unit Tests (Vitest)

Test individual components:
```typescript
// EventCard.test.tsx
import { render, screen } from '@testing-library/react'
import { EventCard } from '@/components/ui/EventCard'

test('renders event card with title', () => {
  render(
    <EventCard
      title="Test Event"
      date={new Date('2024-12-01')}
      description="Test description"
      image="/test.jpg"
      slug="test-event"
    />
  )

  expect(screen.getByText('Test Event')).toBeInTheDocument()
})
```

### E2E Tests (Playwright)

Test user flows:
```typescript
// homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage displays all sections', async ({ page }) => {
  await page.goto('/en')

  // Check hero section
  await expect(page.getByRole('heading', {
    name: 'Ethical AI In Action'
  })).toBeVisible()

  // Check events section
  await expect(page.getByText('Events Feed')).toBeVisible()

  // Check events load
  const eventCards = page.locator('[data-testid="event-card"]')
  await expect(eventCards).toHaveCount(3)
})

test('language switcher works', async ({ page }) => {
  await page.goto('/en')

  // Switch to Thai
  await page.click('[data-testid="language-switcher"]')
  await page.click('[data-testid="language-th"]')

  // Verify URL changed
  await expect(page).toHaveURL(/\/th/)

  // Verify content changed (would need actual Thai text)
  await expect(page.getByRole('heading', {
    name: /ไทย text here/
  })).toBeVisible()
})
```

### Accessibility Tests

```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/en')
  await injectAxe(page)
  await checkA11y(page)
})
```

### Performance Tests

```typescript
test('homepage loads quickly', async ({ page }) => {
  const start = Date.now()
  await page.goto('/en')
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - start

  expect(loadTime).toBeLessThan(3000)  // < 3 seconds
})
```

---

## Quick Reference

### File Structure
```
src/
├── app/[locale]/           # Locale-based routes
├── collections/            # Payload collections
├── components/
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── globals/               # Payload globals
├── i18n/                  # i18n configuration
├── lib/                   # Utility functions
└── locales/               # Translation files
```

### Key Commands
```bash
pnpm dev                    # Development server
pnpm build                  # Production build
pnpm generate:types         # Generate Payload types
pnpm lint                   # Run linter
pnpm test:int               # Unit tests
pnpm test:e2e               # E2E tests
pnpm deploy                 # Deploy to Cloudflare
```

### Import Aliases
```typescript
import { Button } from '@/components/ui/button'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Link } from '@/i18n/routing'
import config from '@/payload.config'
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Document maintained by**: Development Team
**Last reviewed**: 2026-01-20
