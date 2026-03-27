

## Plan: Revert Color Map Detection Path

### Problem
The new color-map detection + boundary dilation approach produces dense, filled-in traces (screenshot "new") that are worse than the original edge-detection approach (first screenshot). The dilation creates thick boundary regions that get traced as solid filled shapes rather than clean outlines.

### Solution
Disable the color map detection path so `traceOutlineImage` always uses the existing brightness/edge-detection logic. This restores the behavior from the first screenshot. The color map code will remain in the file but will be bypassed, so it can be revisited later with a better approach.

### Changes

**`src/lib/traceOutlineImage.ts`**
- In `traceOutlineImage`, skip the color map detection by forcing `colorLabels` to `null` (comment out the call to `detectColorMap`)
- This means `isColorMap` is always `false`, restoring the original edge-detection path for all images
- Keep all helper functions (`kMeansRGB`, `detectColorMap`, `colorBoundaryInk`) in place but unused, for future iteration
- Revert the gap tolerance in `orderPoints` back to `100` (from `400`)
- Revert the component boundary logic to always use `getBoundary(comp)`

### Result
All maps (including color maps like Key Biscayne) will trace using the original edge-detection path that produced the cleaner first screenshot.

