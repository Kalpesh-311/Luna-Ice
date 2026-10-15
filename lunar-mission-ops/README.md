# Lunar Mission Ops

Production-grade mission planning and decision-support platform for **lunar south polar exploration**, built around Chandrayaan-2 OHRC imagery and derived analytical layers.

## Overview

Lunar Mission Ops supports four mission-critical workflows:

1. **Hazard Assessment** — terrain classification (Safe / Moderate / Dangerous / Extreme)
2. **Ice Candidate Identification** — shadow-based ice probability mapping
3. **Landing Site Optimization** — composite suitability from hazard, ice access, and traversability
4. **Rover Traverse Planning** — A* path optimization with mission metrics

The interface is designed for planetary scientists, mission planners, rover navigation engineers, and landing site assessment teams — not as a generic dashboard.

## Quick Start

Requires **Node.js 18+**.

```bash
cd lunar-mission-ops
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Mission Workflow

| Step | Action | Toolbar Button |
|------|--------|----------------|
| 1 | Upload OHRC image | **Import Data** |
| 2 | Generate hazard layer | **Hazard Analysis** |
| 3 | Compute ice probability | **Ice Analysis** |
| 4 | Optimize landing site | **Landing Optimization** |
| 5 | Plan rover traverse | **Generate Traverse** |
| 6 | Evaluate mission feasibility | **Mission Evaluation** |

Export outputs via **Mission Report** (text) or **Export Results** (JSON).

## Interface Layout

- **Left Panel** — Mission Assets (layer visibility, opacity)
- **Center** — Primary analysis canvas (zoom, pan, overlays, coordinate inspection, measurement)
- **Right Panel** — Analysis Inspector (context-sensitive statistics and recommendations)
- **Top Toolbar** — Mission controls and processing actions

## Map Controls

- **Scroll** — Zoom in/out
- **Alt + drag** or **right-click drag** — Pan
- **Click** — Inspect coordinates and layer values
- **Measure** — Two-click distance measurement
- **FIT** — Fit image to viewport

## Data Model

The analysis pipeline produces all required mission variables:

`original_image`, `enhanced_image`, `terrain_mask`, `hazard_map`, `hazard_class`, hazard pixel counts, `hazard_score`, `shadow_mask`, `distance_shadow`, `ice_probability`, `ice_target`, `ice_score`, `landing_suitability`, `landing_site`, `landing_score`, `traversability`, `rover_path`, traverse metrics, and `mission_feasibility`.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Zustand (state)
- Canvas 2D (visualization and analysis)

## Build

```bash
npm run build
npm run preview
```

## Sample Imagery

Use any grayscale or panchromatic lunar terrain image (PNG/JPG/TIF). For best results, use high-contrast OHRC-style imagery with visible craters and shadowed regions near the south polar terrain.

---

*Lunar Mission Ops v1.0 — Decision Support for Chandrayaan-2 OHRC Analysis*
