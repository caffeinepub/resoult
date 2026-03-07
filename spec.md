# Resolt Marketplace

## Current State

A fully functional marketplace app with:
- BrowsePage: Hero section + category filter + product grid
- AddProductPage: Product listing form with camera capture and seller tools
- PlansPage: 3-tier subscription plans (Starter, Pro, Max)
- Navigation: Logo, Plans link, Sell Item button, Login/Logout
- Footer: Simple copyright line
- Components: ProductCard, CategoryFilter, FeatureLock, SubscriptionBadge, ProfileSetupModal
- OKLCH design system with blue-violet palette, Inter/Cal Sans fonts
- Backend: products, categories, user profiles, subscription tiers

## Requested Changes (Diff)

### Add
- A proper landing hero section with a bold tagline, subheading, and two CTAs (Browse Listings + Sell Now)
- A "How It Works" section on the homepage: 3 steps (List, Meet/Ship, Done)
- A stats/trust bar (e.g. "10,000+ listings", "Free to start", "Nearby pickup")
- A "Featured Categories" visual grid on homepage showcasing all major categories with icons
- A "Why Resolt" section with 3–4 value props (Free to list, Auctions, Nearby meetup, Secure)
- A proper multi-column footer with links (Browse, Sell, Plans, About), tagline, and copyright
- Smooth scroll anchor links from hero CTAs to browse section
- Page-level polish: subtle background patterns, improved spacing rhythm, stronger visual hierarchy

### Modify
- Navigation: make the logo more prominent with a custom wordmark feel; add active state indicators; improve mobile responsiveness
- BrowsePage: Convert the basic hero to a section beneath the landing hero; integrate it better into the flow
- CategoryFilter: Make the category pills more visually prominent with icons for each category
- ProductCard: Improve visual design — better image presentation, seller tier badge, cleaner price display
- Footer: Replace minimal footer with multi-column layout

### Remove
- Nothing to remove

## Implementation Plan

1. Update `index.css` and `tailwind.config.js` with a fresh, bold design system: warmer, marketplace-appropriate color palette (amber/orange primary), Bricolage Grotesque as display font, General Sans as body font
2. Rewrite `Navigation.tsx`: larger logo with wordmark, mobile hamburger menu, sticky with blur
3. Rewrite `BrowsePage.tsx`: full landing page structure — hero with CTAs, stats bar, featured categories grid, "How it works", product browse section
4. Update `CategoryFilter.tsx`: icon-based category pills, horizontal scroll on mobile
5. Update `ProductCard.tsx`: improved card layout, image aspect ratio, price prominence, hot auction badge
6. Rewrite `Footer.tsx`: multi-column footer with navigation links, tagline, social-style layout
7. Add `data-ocid` markers on all interactive elements
