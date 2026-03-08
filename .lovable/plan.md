

# Map Canvas Rebuild — Isla Serrano

## Overview

Replace the current `MapPage.tsx` with a completely new Map Canvas screen featuring three modes (Describe It, Upload + Adapt, Splice), an inline SVG map of Isla Serrano, and a collapsible right sidebar for locations.

## What Gets Built

### 1. New Isla Serrano SVG Map
Create `src/components/map/IslaSerranoMap.tsx` — a hand-crafted inline SVG illustration of the island:
- Long narrow barrier island shape, north-to-south, organic/imperfect outline
- Atlantic Ocean (east) with beach texture marks, Biscayne Bay (west) with light hatching
- Causeway entering from the north
- Hand-drawn style icons at each location (hotel with flag, cottage, lighthouse tower, sailboat for yacht club, tree cluster for Village Green, umbrella for Beach Club)
- Serif font labels placed naturally near each marker
- Compass rose in bottom-right corner
- "Isla Serrano" title banner at top
- Subtle cream/aged paper background tone on the map area
- Clickable location markers that highlight on selection

### 2. Mode Toggle (pill toggle at top)
Create `src/components/map/MapModeToggle.tsx` — three-way pill toggle:
- **Describe It** (default) — shows text prompt + generated map
- **Upload + Adapt** — upload box + adaptation prompt (UI only)
- **Splice** — two upload boxes + combination prompt (UI only)

### 3. Describe It Mode
- Pre-filled textarea with the island description
- "Generate Sketch" button (navy bg, gold text)
- Below: the Isla Serrano SVG map displayed as the "generated" result

### 4. Upload + Adapt Mode (UI only)
- Image upload dropzone
- Textarea for adaptation instructions with placeholder text
- "Generate Adapted Sketch" button
- Grey placeholder preview area

### 5. Splice Mode (UI only)
- Two side-by-side upload dropzones ("Reference 1", "Reference 2")
- Textarea for combination instructions with placeholder text
- "Generate Spliced Sketch" button
- Grey placeholder preview area

### 6. Right Sidebar — Location Panel
Create `src/components/map/LocationPanel.tsx`:
- Collapsible panel on the right side
- Style toggle at top: "Line Art" (active) | "Illustrated" (greyed, "coming soon" badge)
- List of 8 Isla Serrano locations as cards with name, type badge, gold dot
- Clicking a location highlights it on the SVG map (subtle pulse animation)
- "+ Add Location" button at bottom

### 7. Updated MapPage.tsx
Rewrite `src/pages/MapPage.tsx` to compose the new components:
- Mode toggle at top
- Main canvas area showing active mode content
- Right location panel
- State management for selected mode, selected location, highlight syncing

### 8. Isla Serrano Data
Create `src/data/isla-serrano.ts` with the 8 locations and their map coordinates/metadata. This is separate from the existing project data — it's the user's own novel data for this focused feature.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/data/isla-serrano.ts` | Create — location data |
| `src/components/map/IslaSerranoMap.tsx` | Create — SVG map |
| `src/components/map/MapModeToggle.tsx` | Create — pill toggle |
| `src/components/map/DescribeMode.tsx` | Create — prompt + map |
| `src/components/map/UploadAdaptMode.tsx` | Create — upload UI |
| `src/components/map/SpliceMode.tsx` | Create — splice UI |
| `src/components/map/LocationPanel.tsx` | Create — right sidebar |
| `src/pages/MapPage.tsx` | Rewrite — compose all pieces |

## Technical Notes
- The SVG map is the hero — hand-crafted inline SVG with careful attention to the literary, hand-drawn aesthetic
- Location highlighting uses CSS animation (pulse/glow on the SVG marker)
- Cream background on map canvas area via a subtle warm tint (`bg-[#faf8f4]` or similar)
- All existing app structure (Layout, sidebar nav, routing) stays unchanged
- Mobile responsive: location panel collapses to a bottom sheet or toggle on small screens

