# Homepage Redesign - Analysis & Requirements

**Date**: 2026-01-20
**Project**: AIGPC Website Homepage Implementation
**Status**: Planning Phase

---

## 1. Design Analysis from Resources

### 1.1 Homepage Design (02_Home 1(1).jpg)

Based on the design mockup, the homepage consists of the following sections:

#### **Header/Navigation**
- Logo: AIGPC with geometric icon
- Navigation items (right-aligned):
  - HOME
  - ABOUT US
  - R & D
  - AI OBSERVATORY
  - CAPACITY BUILDING
  - EXPERT NETWORK
  - ACTIVITIES & EVENTS
- Clean, minimal header with white background
- Sticky/fixed navigation on scroll

#### **Hero Section**
- **Full-width hero with dramatic background image** (Earth from space at night)
- **Primary Headline**: "ETHICAL AI IN ACTION"
- **Secondary Headline**: "FROM LOCAL WISDOM TO GLOBAL ALIGNMENT"
- **Subtitle/Description**: "From Local Wisdom To Global Alignment, We Drive The Future Of Responsible And Inclusive AI Adoption Worldwide."
- Dark overlay for text readability
- Typography: Bold, uppercase for main headings

#### **Events Feed Section**
- Section Title: "EVENTS FEED" (gold/yellow color)
- 3-column card grid layout
- Each event card contains:
  - Featured image with overlay
  - Date badge (format: DD/MM/YY)
  - Short description text
  - Card hover effects expected

#### **About AIGPC Section**
- Section Title: "ABOUT AIGPC" (gold/yellow color)
- Descriptive text about AIGPC's mission and establishment
- Quote box with:
  - Quote: "why unesco & why c2c"
  - Supporting text: "alignment with unesco outcome/ sdgs"
  - Yellow "More Details" button
- Dark background with wave/network visualization

#### **UNESCO Forum Banner**
- Full-width banner image
- Shows UNESCO Global Forum event photo
- Thai and UN flags visible
- Group photo of international participants

#### **SDG Dashboard Section**
- Section Title: "SDG DASHBOARD"
- Subtitle: "USER INTERACTION FLOW & VISUAL FEEDBACK"
- Interactive dashboard mockup showing:
  - User action inputs (left column)
  - SDG wheel visualization (center)
  - Feedback modals and outcomes (right)
  - Complex information architecture

#### **Collaboration Partners Section**
- Section Title: "IN COLLABORATION WITH"
- Logo grid displaying partner organizations:
  - UNESCO (multiple instances)
  - IRCAI
  - ICAIRE
  - Other partner logos
- Clean grid layout, grayscale or brand colors

#### **Footer**
- Dark background (#0B192E or similar)
- Left side:
  - AIGPC logo and name
  - Organization details: "AI Governance Practice Center" and "Electronic Transactions Development Agency"
- Right side:
  - Contact information (Tel, Email)
- Full-width, two-column layout

---

### 1.2 About Us Design (02_ABOUT.jpg)

The About page shows additional sections that inform the overall design system:

#### **Key Sections Identified**:
1. **About AIGPC Header** - Text-heavy section with organizational background
2. **Mission Section** - Icon-based cards showing key mission areas
3. **Objectives Section** - List-based content with visual elements
4. **Structure Diagram** - Organizational chart/flowchart showing governance structure
5. **AIGPC Team Section** - Team member cards with photos and roles

#### **Design Patterns**:
- Consistent use of gold/yellow (#FDB913) as accent color
- Dark sections (#0B192E) alternating with light sections
- Card-based layouts for content organization
- Icon usage for visual interest
- Network/globe imagery as recurring theme

---

## 2. Technical Requirements

### 2.1 Framework & Libraries

**Core Stack (Existing)**:
- Next.js 16.1.3 (App Router)
- React 19.2.3
- Payload CMS 3.72.0
- TypeScript 5.9.3

**New Dependencies to Add**:
1. **Framer Motion** (`framer-motion@^11.x`) - For animations
2. **Tailwind CSS 4.x** (upgrade from current version)
3. **next-intl** (`next-intl@^3.x`) - For multi-language support
4. **shadcn/ui** components - For consistent UI components
5. **@radix-ui/react-*** - Required by shadcn components

### 2.2 Animation Requirements

Based on modern web standards and the design's sophisticated nature:

#### **Scroll-based Animations** (using Framer Motion):
- Fade-in effects for sections as they enter viewport
- Parallax effects on hero section
- Card slide-up animations on Events Feed
- Stagger animations for partner logos
- Smooth scroll behavior

#### **Micro-interactions**:
- Button hover states with smooth transitions
- Card hover effects with scale/shadow changes
- Navigation hover indicators
- Logo animation on page load
- Smooth page transitions between routes

#### **Performance Considerations**:
- Use `will-change` CSS property sparingly
- Implement IntersectionObserver for scroll animations
- Lazy load images with blur placeholder
- Optimize animations for 60fps

### 2.3 Multi-Language Structure

**Required Languages**:
- English (en) - Primary
- Thai (th) - Secondary (given Thailand context)

**Implementation Approach**:
```
app/
├── [locale]/
│   ├── layout.tsx          # Locale-aware layout
│   ├── page.tsx            # Homepage
│   ├── about/
│   │   └── page.tsx
│   ├── research/
│   ├── observatory/
│   ├── capacity/
│   ├── expert/
│   └── activities/
├── middleware.ts           # Language detection
└── i18n/
    └── routing.ts          # Routing configuration
```

**Translation File Structure**:
```
locales/
├── en/
│   ├── common.json         # Shared translations
│   ├── home.json           # Homepage specific
│   ├── about.json
│   └── navigation.json
└── th/
    ├── common.json
    ├── home.json
    ├── about.json
    └── navigation.json
```

---

## 3. Design System Specifications

### 3.1 Color Palette

Based on the design mockups:

```css
/* Primary Colors */
--primary-blue: #0B192E;      /* Dark navy - headers, footer */
--primary-gold: #FDB913;      /* Gold/yellow - accents, CTAs */

/* Neutral Colors */
--white: #FFFFFF;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #4B5563;
--gray-800: #1F2937;
--gray-900: #111827;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 3.2 Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Space Grotesk', sans-serif; /* For headings */

/* Font Sizes (Tailwind Scale) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### 3.3 Spacing System

Following Tailwind CSS 4.x conventions:
- Base unit: 4px (0.25rem)
- Standard spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- Container max-width: 1280px (xl) with responsive padding

### 3.4 Component Patterns

**Card Component**:
- Border radius: 12px
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Hover: Lift effect with increased shadow
- Transition: 300ms ease-in-out

**Button Component**:
- Primary: Gold background, dark text
- Secondary: Outline with gold border
- Padding: 12px 24px
- Border radius: 8px
- Hover: Subtle scale (1.02) and brightness increase

**Section Spacing**:
- Padding top/bottom: 80px (desktop), 48px (mobile)
- Section title margin-bottom: 32px
- Content spacing: 24px between elements

---

## 4. Content Management Strategy

### 4.1 Payload CMS Integration

**Collections to Create**:

1. **Events Collection**
   ```typescript
   {
     title: string,
     slug: string,
     date: date,
     description: richText,
     featuredImage: upload,
     locale: 'en' | 'th',
   }
   ```

2. **Partners Collection**
   ```typescript
   {
     name: string,
     logo: upload,
     url: string,
     order: number,
   }
   ```

3. **Team Members Collection** (for About page)
   ```typescript
   {
     name: string,
     role: string,
     photo: upload,
     bio: richText,
     locale: 'en' | 'th',
   }
   ```

4. **Globals**
   - Homepage Content (hero, about section)
   - Site Settings (contact info, social links)
   - Navigation items (dynamic menu)

### 4.2 Localization in Payload

Enable localization in `payload.config.ts`:
```typescript
export default buildConfig({
  localization: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    fallback: true,
  },
  // ... rest of config
})
```

---

## 5. Performance Optimization

### 5.1 Image Optimization
- Use Next.js Image component for all images
- Implement blur placeholders
- Lazy load below-the-fold images
- Use WebP format with fallbacks
- Optimize hero image for different viewports

### 5.2 Code Splitting
- Dynamic imports for heavy components
- Lazy load Framer Motion components
- Split route bundles automatically (Next.js default)

### 5.3 Caching Strategy
- Static Generation (SSG) for all pages
- Revalidate on-demand from Payload webhooks
- Edge caching on Cloudflare

---

## 6. Accessibility Requirements

### 6.1 WCAG 2.1 AA Compliance
- Color contrast ratio: 4.5:1 minimum for text
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators on interactive elements
- Alt text for all images
- Semantic HTML structure

### 6.2 Responsive Design
- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### 6.3 Language Accessibility
- `lang` attribute on HTML element
- Proper language switching UI
- Translation of all UI elements including alt text

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Component rendering tests
- Translation key validation
- Utility function tests

### 7.2 Integration Tests
- Language switching functionality
- Navigation flow
- CMS data fetching

### 7.3 E2E Tests (Playwright)
- Complete user journey
- Multi-language navigation
- Form submissions
- Animation performance

### 7.4 Visual Regression Tests
- Screenshot comparison across languages
- Responsive design verification

---

## 8. Deployment Considerations

### 8.1 Cloudflare Workers Compatibility
- Ensure all animations are client-side compatible
- Minimize edge runtime dependencies
- Test middleware language detection on Cloudflare

### 8.2 Environment Variables
```
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,th
PAYLOAD_PUBLIC_SERVER_URL=https://aigpc.or.th
```

### 8.3 Build Optimization
- Analyze bundle size after adding new dependencies
- Monitor Core Web Vitals
- Target metrics:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

---

## 9. Migration Path

### 9.1 Phase 1: Setup
- Install dependencies (Framer Motion, next-intl, Tailwind 4.x)
- Configure multi-language routing
- Set up translation files
- Update Payload config for localization

### 9.2 Phase 2: Components
- Create base UI components with shadcn
- Implement animation wrappers
- Build reusable card components
- Create layout components

### 9.3 Phase 3: Homepage Implementation
- Build hero section with animations
- Implement Events Feed with CMS integration
- Create About section
- Add SDG Dashboard placeholder
- Build Partners section
- Update footer with translations

### 9.4 Phase 4: Testing & Refinement
- Test animations performance
- Verify language switching
- Responsive testing
- Accessibility audit
- Performance optimization

---

## 10. Success Metrics

### 10.1 Technical Metrics
- Page load time: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse Performance score: > 90
- Lighthouse Accessibility score: 100
- Zero console errors/warnings

### 10.2 User Experience Metrics
- Smooth 60fps animations
- Seamless language switching
- Mobile-friendly navigation
- Clear visual hierarchy
- Professional, modern aesthetic

---

## Next Steps

1. Review and approve this analysis
2. Create detailed implementation plan
3. Set up development environment
4. Begin Phase 1 implementation
5. Iterate based on feedback

---

**Document Version**: 1.0
**Last Updated**: 2026-01-20
