# SAVE 2 - Project State Snapshot

**Date Saved:** Current session
**Description:** About Us page with gamification element (ecosystem visualization), redesigned AEQUIFIN SOLUTIONS section (3 cards, 1x3 layout), and removed sections as requested.

## File Structure
- about-us.html
- about-us.php
- styles.css
- script.js

## Key Features of This Version
1. **Gamification Element**: Interactive ecosystem visualization with circular diagram showing Litigants, Lawyers, and Sponsors
2. **Redesigned Solutions Section**: Changed from 4 elements (2x2) to 3 elements (1x3 layout) - Classic, Professional, Legal Projects
3. **Removed Sections**: 
   - "What Our Clients Say" testimonials section removed
   - "Mission-Driven / Rigorous Selection / Partnership Approach" hero values removed
4. **Circular Diagram**: Perfect circular arcs connecting nodes at 120° intervals with interactive highlighting
5. **Professional Design**: Clean, corporate aesthetic maintained

## New Sections Added
1. **Ecosystem Visualization**:
   - Left column: Text items for Litigants, Lawyers, Sponsors
   - Right column: Circular SVG diagram with 3 nodes and arrows
   - Interactive: Hover/click highlights outgoing arrow and active node
   - Cycle: Litigants → Lawyers → Sponsors → Litigants
   - Colors: Active state uses #005781 (var(--color-theme-3))

## Redesigned Sections
1. **AEQUIFIN SOLUTIONS** (formerly "AEQUIFIN Solutions & Tools"):
   - Title changed to "AEQUIFIN SOLUTIONS"
   - Layout: 1 row, 3 columns (responsive: 1 column mobile, 3 columns desktop)
   - Cards: Classic, Professional, Legal Projects
   - Each card has: Title, Icon (SVG), Description, "More information" link
   - Styling: Gray background cards with borders and hover effects

## Removed Sections
1. "What Our Clients Say" - Client testimonials section completely removed
2. Hero values section - Mission-Driven, Rigorous Selection, Partnership Approach removed

## Ecosystem Visualization Details
- **Node Positions**: 
  - Lawyers: Top center (-90°)
  - Litigants: Bottom right (30°)
  - Sponsors: Bottom left (150°)
- **Circle**: Center (200, 200), Radius 140
- **Arrows**: Perfect circular arcs, 120° each, counter-clockwise
- **Node Size**: r=50
- **Highlighting**: Only outgoing arrow highlights when entity is hovered/clicked
- **Colors**: 
  - Active node: #005781 fill, white text
  - Active arrow: #005781 stroke
  - Inactive: Light gray (#cbd5e1)

## Button Links
- "Learn More About Our Fees" → https://www.aequifin.com/en/app/sponsoring/my-sponsorings/
- "View Our Process" → https://www.aequifin.com/en/how-it-works
- "Calculate Your Fees" → https://www.aequifin.com/en/litigation-cost-calculator
- "Learn How It Works" → https://www.aequifin.com/en/how-it-works
- "Register Now" → https://www.aequifin.com/en/litigation-cost-calculator
- "More information" → # (placeholder links in solutions cards)

## Link Colors
- Solution links: #005781 (var(--color-theme-3))
- Media links: #005781 (var(--color-theme-3))
- Contact links: #005781 (var(--color-theme-3))
- INVEST links: #008ece (specific blue)

## Team Members
- Dr. Arndt Eversberg (CEO & Co-Founder)
- Ludwig Zoller (CFO & Co-Founder)
- Antonia Zoller (Head of Legal Analysis)
- Frank Martin Binder (Head of Operations)

## Design Elements
- Hero section with value propositions (removed in this version)
- Ecosystem visualization with circular diagram and interactive highlighting
- Trust points with circular dot indicators
- Impact features with dot indicators
- Case types with horizontal gradient bars
- Contact cards with border-bottom dividers
- Solutions cards with gray backgrounds (3 cards, 1x3 layout)
- Recognition badges with vertical gradient bars
- INVEST Program Support section with logo

## Technical Notes
- SVG diagram uses perfect circular arcs (A commands)
- Arrow markers positioned to touch circle edges (refX="50")
- Interactive JavaScript for highlighting nodes and arrows
- Responsive grid layouts for all sections
- All sections maintain professional, clean design aesthetic

