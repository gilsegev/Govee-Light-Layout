# Govee Soffit Layout Planner

## Project Goal
A visual design tool to help DIY homeowners plan the exact placement of Govee Pro permanent outdoor lights. It visualizes soffit length, puck placement, and warns about wire slack issues for both straight runs and gable (peak) roofs.

The application has been redesigned with a premium "Dark Mode" aesthetic and a streamlined user experience, making it feel like a professional CAD tool.

## New Features & UX Improvements
*   **Design Tool Aesthetic**: Full dark mode interface with semantic coloring, "blueprint" style canvas, and clean typography (Inter font).
*   **Split Peak Mode**: Support for "Split" apex configuration where lights are offset from the center.
    *   **Apex Gap Slider**: A new slider allows you to define the distance from the peak to the first light (e.g., set a 2" distance for a 4" total gap).
*   **Smart Validation**: Input fields automatically prevent negative values to ensure physical feasibility.
*   **Responsive Layout**: The configuration panel adapts to mobile screens, placing dimensions and summary plans side-by-side.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS (v3.4) + Lucide Icons + CLSX + Tailwind Merge
- **Visualization:** Raw SVG with React
- **Font:** Inter (via `next/font/google`)

---

## Architecture & Logic

### 1. Math Engine (`src/lib/algorithms/`)
The core logic is decoupled from the UI and resides in the `lib/algorithms` directory. All calculations are performed in **Millimeters** for precision and converted back to Imperial units for display.

*   **`index.ts`**: The main entry point. It routes the configuration to the specific algorithm.
*   **`centric.ts` (Straight)**: Calculates a symmetrical layout where the array of lights is centered.
*   **`peak.ts` (Gable)**:
    *   **Apex Modes**:
        *   *Center*: Places a light exactly at the apex (0).
        *   *Split*: Leaves a gap at the apex. The user controls the "Distance from Peak" (half-gap), and the engine places lights at `+/- distance`.

### 2. State Management (`src/store/`)
We use **Zustand** to manage the global application state.
*   **`useLayoutStore.ts`**: Holds the `LayoutConfig` (user inputs) and `LayoutResult`.
*   **Reactivity**: Actions like `updateConfig` or `updatePeakConfig` trigger instant recalculations.

### 3. Visualization (`src/components/canvas/SoffitCanvas.tsx`)
The canvas is a high-fidelity SVG that renders the plan in real-time.
*   **Dark Mode Canvas**: Clean white drawing on a dark background.
*   **Responsive ViewBox**: Automatically zooms to fit the entire run.
*   **Wire Simulation**: Draws quadratic curves to represent wire slack when spacing < max length.

### 4. Component Library (`src/components/ui/`)
A set of reusable, accessible UI components built with Tailwind CSS:
*   `Card`, `Input`, `Label`, `Select`, `Slider`
*   Ensures consistent styling (border radius, colors, typography) across the app.

---

## Physical Constraints (Govee Pro Specs)
*   **Max Wire Length ($L_{max}$):** ~500mm (19.68 inches).
*   **Puck Diameter:** ~38mm (1.5 inches).
*   **Min Safe Spacing:** ~76mm (3 inches).
*   **Max String Length:** ~5m (16.4 ft) before power injection is needed.

---

## Project Structure

```text
src/
├── app/                 # Next.js App Router & Global Styles
├── components/
│   ├── canvas/          # SVG Visualization
│   ├── controls/        # Configuration Panel (Inputs & Logic)
│   └── ui/              # Atom-level UI Components (Input, Slider, etc.)
├── lib/
│   ├── algorithms/      # Math Engine for Layouts
│   └── utils.ts         # Helper functions (CN class merger)
├── store/               # Zustand Store
└── types/               # TypeScript Interfaces
```
