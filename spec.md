# Specification

## Summary
**Goal:** Add subscription tier plans (Starter, Pro, Max) to Resolt with a pricing page, tier badges, feature gating, and auction boost labels.

**Planned changes:**
- Add a `SubscriptionTier` type (`#Starter`, `#Pro`, `#Max`) to the backend; store it on each user's profile, defaulting to `#Starter`
- Expose backend query and update functions for reading and setting a user's subscription tier
- Add a `/plans` route linked from the navigation bar showing three tier cards side by side (Starter/green, Pro/blue, Max/purple), each with name, price, feature list, and CTA button; highlight the authenticated user's current plan
- Display a tier badge on the seller profile: no badge for Starter, blue "Pro" badge for Pro, purple "Max ✔" badge for Max
- Show lock icons or tier pill badges on Pro/Max-exclusive UI features (advanced filters, custom profile banner, product analytics, auction boost, featured homepage placement, advanced analytics dashboard, AI price suggestion, bulk product upload, custom shop page) for users on lower tiers; clicking a locked feature directs to the Plans page
- Display a "Hot Auction 🔥" badge on auction product cards when the seller is Pro or Max tier; Starter-tier auctions do not show the badge

**User-visible outcome:** Users can browse a plans page to see all subscription tiers and their features, see their current plan highlighted, view tier badges on seller profiles, and see locked indicators on premium features they haven't unlocked. Pro/Max sellers' auction listings show a "Hot Auction 🔥" label.
