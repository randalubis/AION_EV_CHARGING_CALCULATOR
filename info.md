# evhub.id

Platform lengkap untuk pemilik kendaraan listrik di Indonesia. Kalkulator charging, peta SPKLU, trip planner, dan komunitas EV dalam satu tempat.

## Language

Bahasa Indonesia (id)

## Features

- Full-screen parallax layered hero with large background text, cutout model image, and overlay tagline
- Masonry image grid with per-image directional clip-path reveals, Ken Burns zoom, and varied-depth parallax
- Two-column services section with icon-mapped cards in a 2x2 grid
- Feature cards with clip-path reveal, animated stat counters, and wide landscape image with center-expand reveal
- Alternating layout featured project cards with viewfinder overlays, clip-path reveals, and staggered text
- Auto-playing Swiper testimonials carousel with hover color-invert effect
- Radix UI FAQ accordion with staggered reveal animations and CTA
- Footer with massive SVG logo, three-column layout (contact, navigation, social links)
- Each section has null check - renders nothing when config is empty
- Multi-page SPA with React Router DOM

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 3
- GSAP + ScrollTrigger (scroll-driven animations, parallax)
- Lenis (smooth scroll)
- Swiper (testimonials carousel)
- Radix UI (accordion)
- Lucide React (icons)
- React Router DOM (routing)

## Quick Start

```bash
npm install
npm run dev
```

## Configuration

All content is in `src/config.ts`. Each section has a typed config object with empty placeholder values.

**Note:** The content is in Bahasa Indonesia to match the target audience.

### siteConfig

```ts
{
  language: "id",           // HTML lang attribute
  siteTitle: "",          // Browser tab title
  siteDescription: "",    // Meta description
}
```

### heroConfig

```ts
{
  backgroundText: "",     // Large text behind the hero image (e.g. "CHARGE ON")
  heroImage: "",          // MUST be transparent-background PNG
  heroImageAlt: "",       // Alt text for hero image
  overlayText: "",        // Italic text in bottom-right
  brandName: "",          // Top-left brand name in nav
  navLinks: [],           // Array of { label: string, href: string }
}
```

### introGridConfig

```ts
{
  titleLine1: "",         // First line of title (bold sans-serif)
  titleLine2: "",         // Second line (italic serif)
  description: "",        // Paragraph text below title
  portfolioImages: [],    // Array of { src: string, alt: string } (5 images for masonry grid)
  accentText: "",         // Small uppercase text bottom-right
}
```

### featuredProjectsConfig

```ts
{
  subtitle: "",           // Small uppercase label
  titleRegular: "",       // Bold part of heading
  titleItalic: "",        // Italic part of heading
  viewAllText: "",        // "View All Projects" link text
  viewAllHref: "",        // Link href for view all
  viewProjectText: "",    // Per-project link text
  projects: [],           // Array of { id, title, category, year, image, description }
}
```

### servicesConfig

```ts
{
  subtitle: "",           // Small uppercase label
  titleLine1: "",         // First line of heading
  titleLine2Italic: "",   // Italic second line
  description: "",        // Paragraph below heading
  services: [],           // Array of { iconName, title, description }
                          // iconName: "Zap" | "MapPin" | "Route" | "Wallet"
}
```

### whyChooseMeConfig

```ts
{
  subtitle: "",           // Small uppercase label
  titleRegular: "",       // Bold part of heading
  titleItalic: "",        // Italic part of heading
  statsLabel: "",         // Label above stats
  stats: [],              // Array of { value: number, suffix: string, label: string }
  featureCards: [],        // Array of { image, imageAlt, title, description } (2 cards)
  wideImage: "",          // Wide landscape image path
  wideImageAlt: "",       // Alt text for wide image
  wideTitle: "",          // Title overlay on wide image
  wideDescription: "",    // Description overlay on wide image
}
```

### testimonialsConfig

```ts
{
  subtitle: "",           // Small uppercase label
  titleRegular: "",       // Bold part of heading
  titleItalic: "",        // Italic part of heading
  testimonials: [],       // Array of { id, name, role, image, quote }
}
```

### faqConfig

```ts
{
  subtitle: "",           // Small uppercase label
  titleRegular: "",       // Bold part of heading
  titleItalic: "",        // Italic part of heading
  ctaText: "",            // Text above CTA button
  ctaButtonText: "",      // CTA button text
  ctaHref: "",            // CTA link href
  faqs: [],               // Array of { id: string, question: string, answer: string }
}
```

### footerConfig

```ts
{
  logoText: "",           // Large SVG text logo
  contactLabel: "",       // Label above email
  email: "",              // Contact email address
  locationText: "",       // Location text (supports newlines with \n)
  navigationLabel: "",    // Label above nav links
  navLinks: [],           // Array of { label: string, href: string }
  socialLabel: "",        // Label above social icons
  socialLinks: [],        // Array of { iconName, href, label }
                          // iconName: "Instagram" | "Twitter" | "Linkedin" | "Mail"
  tagline: "",            // Small text below social links (supports \n)
  copyright: "",          // Copyright text in bottom bar
  bottomLinks: [],        // Array of { label, href } for bottom bar links
}
```

## Required Images

Place in `public/` directory:

- **Hero**: 1 cutout image (**MUST be a transparent-background PNG**; it is layered between background text and overlay, so non-transparent backgrounds will look broken; ~500px wide recommended)
- **Portfolio Grid**: 5 images (various aspect ratios, for masonry layout)
- **Featured Projects**: 1 image per project (4:3 aspect ratio)
- **Why Choose Me**: 2 portrait images (3:4), 1 wide landscape (21:9 or 3:1)
- **Testimonials**: 1 square avatar per testimonial

## Design

- **Theme**: Deep forest charcoal (#0d1310) alternating with off-white (#f4f4f4) sections, yellow accent (#FFC300)
- **Typography**: Manrope (headings), Playfair Display (italic accents), DM Sans (body text)
- **Animations**: GSAP ScrollTrigger clip-path reveals, parallax, scale, staggered entrances
- **Layout**: Dark/light alternating sections, max-width 7xl container
- **Special Effects**: Viewfinder corner overlays on images, crosshair hover on projects, hover color-invert on testimonial cards

## Notes

- Service icons use `iconName` field mapped to Lucide components: `Zap`, `MapPin`, `Route`, `Wallet`
- Footer social icons use `iconName` mapped to: `Instagram`, `Twitter`, `Linkedin`, `Mail`
- Lenis smooth scroll is connected to GSAP ticker for synchronized animations
- Swiper carousel auto-plays with responsive breakpoints (1.2 to 3 slides visible)
- All sections return `null` when their config objects are empty (no title and no array items)
