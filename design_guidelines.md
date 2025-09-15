# Design Guidelines for SKILL+ Career Counselor Portfolio

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern professional service websites like LinkedIn and Notion, focusing on clean layouts with strategic use of gradients and smooth interactions.

## Color Palette
**Primary Colors:**
- Brand Blue: 220 85% 45% (matching SKILL+ logo)
- Deep Blue: 220 90% 35% 
- Light Blue: 220 75% 85%

**Background Gradients:**
- Hero: Subtle diagonal gradient from 220 20% 98% to 220 40% 95%
- Section alternates: Light blue tints (220 30% 98%) and pure white
- Card hover states: Gentle blue glow effect

**Text Colors:**
- Primary text: 220 15% 20%
- Secondary text: 220 10% 45%
- White text on blue backgrounds

## Typography
**Font Stack:** Inter (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight  
- Logo/Brand: 700 weight
- Sizes: text-sm to text-6xl following Tailwind scale

## Layout System
**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 24
- Consistent padding: p-8 for sections, p-6 for cards
- Margins: mb-8 between sections, mb-4 for smaller elements
- Container max-width: max-w-6xl with mx-auto centering

## Component Library

**Navigation:**
- Fixed header with backdrop blur effect
- SKILL+ logo prominently displayed (left-aligned)
- Horizontal navigation with smooth hover underlines
- Mobile hamburger menu with slide-in animation

**Buttons:**
- Pill-shaped design (rounded-full)
- Primary: Blue gradient background with white text
- Secondary: Outline style with blue border
- Hover: Gentle scale transform (scale-105) and shadow increase
- CTA buttons: Larger padding (px-8 py-3)

**Cards:**
- Services: Grid layout with subtle shadows and rounded corners
- Hover effect: Lift animation (translate-y-1) with increased shadow
- Clean white backgrounds with blue accent borders on hover

**Hero Section:**
- Large centered layout with gradient background
- Professional headshot image (rounded-lg, moderate size)
- Prominent name and title typography
- Dual CTA buttons with different styles

**Forms:**
- Clean input fields with subtle borders
- Focus states with blue accent colors
- Pill-shaped submit buttons matching brand style

## Images
**Logo:** SKILL+ logo in header (maintain original proportions, approximately 120px width)
**Hero Image:** Professional headshot of Dr. Ganesh D. Patil (centered, 200-250px width, rounded corners)
**About Section:** Secondary professional photo (smaller, integrated into 2-column layout)
**Placeholders:** Use subtle blue-tinted placeholder images for blog cards and testimonials

## Animations
**Minimal Implementation:**
- Smooth page transitions between sections
- Button hover scale effects (scale-105)
- Card hover lifts (translate-y-1)
- Gentle fade-in animations on scroll (optional)
- Navigation menu smooth reveal on mobile

## Responsive Design
- Mobile-first approach with breakpoints at sm, md, lg, xl
- Single column layout on mobile, multi-column on desktop
- Stacked navigation on mobile with hamburger menu
- Responsive typography scaling
- Hero section adapts from centered to side-by-side layout

**Key Principle:** Clean, professional aesthetic with strategic use of the SKILL+ brand blue, emphasizing credibility and expertise while maintaining visual appeal through gradients and smooth interactions.