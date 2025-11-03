# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ViaFarmFlow is a 3D greenhouse map editor built with React, TypeScript, and Three.js (via React Three Fiber). It enables users to design greenhouse layouts, position robots, define work zones, and export configurations for automated farming systems.

## Technology Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** - Build tool and dev server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers (OrbitControls, Grid, etc.)

## Project Structure

```
src/
├── components/          # React components
│   ├── Greenhouse.tsx   # Main greenhouse structure
│   ├── HangingBed.tsx   # Individual bed component
│   ├── HangingBeds.tsx  # Bed array manager
│   └── Scene.tsx        # Main 3D canvas scene
├── types/               # TypeScript type definitions
│   └── greenhouse.ts    # All interfaces (Robot, Waypoint, Zone, etc.)
├── constants/           # Configuration constants
│   ├── materials.ts     # Three.js materials and colors
│   └── defaults.ts      # Default configs for greenhouse
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Architecture

### Component Hierarchy
```
App
└── Scene (Canvas)
    ├── Lighting (ambient, directional, hemisphere)
    ├── Grid
    ├── Greenhouse (structure)
    ├── HangingBeds (array of HangingBed components)
    └── OrbitControls
```

### Coordinate System
- **X-axis**: Width (40m default) - left/right
- **Z-axis**: Length (100m default) - front/back
- **Y-axis**: Height (8m default) - up/down
- Beds are created along Z-axis, then rotated 90° to span X-axis
- Origin (0,0,0) is at ground center of greenhouse

### Type System
Key interfaces in [src/types/greenhouse.ts](src/types/greenhouse.ts):
- `GreenhouseConfig` - Dimensions and bed configuration
- `Robot` - Robot entity with position, rotation, status
- `Waypoint` - Path points for robot navigation
- `WorkZone` - Defined areas with assigned robots
- `MapData` - Complete map export format

### Material System
Defined in [src/constants/materials.ts](src/constants/materials.ts):
- `MATERIALS` - Physical/standard materials for greenhouse parts
- `COLORS` - Color scheme for UI and interactive elements
- `FRAME_THICKNESS`, `ROOF_ANGLE` - Structural constants

## Development

### Commands
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (default: http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Development Workflow
1. The dev server runs on port 5173 by default
2. Hot module replacement (HMR) is enabled
3. TypeScript type checking runs in the background
4. Changes to components reflect immediately in browser

### Key Configuration Files
- [vite.config.ts](vite.config.ts) - Vite configuration
- [tsconfig.json](tsconfig.json) - TypeScript base config
- [tsconfig.app.json](tsconfig.app.json) - App-specific TS config
- [package.json](package.json) - Dependencies and scripts

## Feature Roadmap

### Phase 1: Foundation (Steps 1-2) ✓
- [x] Project setup with Vite + React + TypeScript
- [x] Modular 3D components (Greenhouse, HangingBeds)
- [x] Type system and constants
- [x] Basic scene rendering with lights and controls

### Phase 2: Editor UI (Steps 3-4)
- [ ] Layout with sidebar panels and toolbar
- [ ] Greenhouse configuration editor
- [ ] Real-time 3D updates
- [ ] Undo/redo system

### Phase 3: Robots (Steps 5-6)
- [ ] Robot component and entity system
- [ ] Add/remove/select robots
- [ ] Drag-to-move interaction
- [ ] Robot properties panel

### Phase 4: Paths & Zones (Steps 7-8)
- [ ] Waypoint system for robot paths
- [ ] Path visualization with lines/arrows
- [ ] Work zone drawing tool
- [ ] Zone-robot assignments

### Phase 5: Data & Simulation (Steps 9-10)
- [ ] JSON serialization/deserialization
- [ ] File import/export
- [ ] Robot movement simulation
- [ ] Collision detection and validation

## Reference Files

Original HTML prototype: [reference/greenhouse-3d.html](reference/greenhouse-3d.html)
- Contains original Three.js implementation
- Useful for reference when adding features
