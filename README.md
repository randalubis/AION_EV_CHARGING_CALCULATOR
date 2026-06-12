# evhub.id - Platform EV Charging Indonesia

Platform lengkap untuk pemilik kendaraan listrik di Indonesia. Kalkulator charging, peta SPKLU, trip planner, dan komunitas EV dalam satu tempat.

## Fitur

- **Kalkulator Charging** - Hitung waktu pengisian, biaya listrik, dan jarak tempuh untuk 73+ model EV dari 18 merek
- **Peta SPKLU** - Temukan stasiun pengisian kendaraan listrik umum terdekat
- **Trip Planner** - Rencanakan perjalanan dengan rekomendasi charging stop optimal
- **TCO Calculator** - Bandingkan biaya kepemilikan EV vs mobil bensin
- **Multi-Page Architecture** - SPA dengan routing untuk setiap fitur utama

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS 3** - Utility-first styling
- **GSAP** + **ScrollTrigger** - Scroll-driven animations and parallax
- **Lenis** - Smooth scroll
- **Swiper** - Testimonials carousel
- **Radix UI** - Accessible accordion component
- **Lucide React** - Icon library
- **React Router DOM** - Client-side routing

## Quick Start

```bash
npm install
npm run dev
```

## Configuration

All content is managed through `src/config.ts`. Each section has its own typed configuration object.

### Config Objects

- `siteConfig` - Site title, description, language
- `heroConfig` - Hero section with navigation
- `introGridConfig` - Introduction and portfolio grid
- `featuredProjectsConfig` - Platform features showcase
- `servicesConfig` - Services offered
- `whyChooseMeConfig` - Why choose evhub.id section
- `testimonialsConfig` - User testimonials
- `faqConfig` - FAQ items, CTA button
- `footerConfig` - Logo, contact info, navigation, social links, copyright

## Pages

- `/` - Landing page
- `/kalkulator` - EV Charging Calculator
- `/peta-spklu` - SPKLU Map
- `/trip-planner` - Trip Planner
- `/tco-calculator` - Total Cost of Ownership Calculator
- `/komunitas` - Community Page

## Required Images

Place images in the `public/` directory:

- **Hero**: Hero image for landing page
- **Portfolio**: 5 images for the masonry grid
- **Featured Projects**: 1 image per feature (4:3 aspect ratio recommended)
- **Why Choose Me**: 2 portrait images (3:4 aspect ratio), 1 wide landscape
- **Testimonials**: 1 avatar image per testimonial (square, small)

## Design

- **Color Theme**: Deep forest charcoal (#0d1310) with off-white (#f4f4f4) alternating sections, yellow accent (#FFC300)
- **Typography**: Manrope (headings), Playfair Display (italic accents), DM Sans (body)
- **Animations**: GSAP ScrollTrigger with clip-path reveals, parallax, scale effects, and staggered entrances

## Brand

**evhub.id** - Platform EV Charging Indonesia
