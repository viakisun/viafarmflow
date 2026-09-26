# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ViaFarmFlow is a 3D greenhouse map editor built with React, TypeScript, and Three.js (via React Three Fiber). It enables users to design greenhouse layouts, position robots, define work zones, plan navigation paths, and export configurations for automated farming systems. Version 0.1.0 includes full editor UI, robot management, path planning, zone management, and simulation capabilities.

## Technology Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** - Build tool and dev server
- **Three.js 0.181** - 3D graphics library
- **@react-three/fiber 9.4** - React renderer for Three.js
- **@react-three/drei 10.7** - Useful helpers (OrbitControls, Grid, etc.)
- **React Context API** - State management

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Editor layout shell
│   ├── Toolbar/         # Top toolbar with mode buttons
│   ├── Sidebar/         # Right sidebar with panels
│   ├── StatusBar/       # Bottom status information
│   ├── Robot/           # Robot 3D models and managers
│   ├── Waypoint/        # Path and waypoint visualization
│   ├── Zone/            # Work zone drawing and rendering
│   ├── Greenhouse.tsx   # Main greenhouse structure
│   ├── HangingBed.tsx   # Individual bed component
│   ├── HangingBeds.tsx  # Bed array manager
│   ├── InteractiveFloor.tsx  # Clickable floor for path/zone creation
│   └── Scene.tsx        # Main 3D canvas scene
├── contexts/            # React Context for state
│   ├── EditorContext.tsx         # Main provider with all state
│   ├── EditorContextDefinition.ts # Type definitions
│   └── useEditor.ts              # Hook to access context
├── hooks/
│   ├── useKeyboardShortcuts.ts   # V/E/R/P/Z mode switching
│   └── useSimulation.ts          # Robot animation along paths
├── types/
│   └── greenhouse.ts    # All interfaces (Robot, Waypoint, Zone, MapData)
├── constants/
│   ├── materials.ts     # Three.js materials and colors
│   └── defaults.ts      # Default greenhouse config
├── App.tsx              # Wires EditorProvider and main layout
└── main.tsx             # Application entry point
```

## Architecture

### State Management
All application state is centralized in [EditorContext.tsx](src/contexts/EditorContext.tsx):
- **config**: Greenhouse dimensions and bed configuration
- **robots**: Array of robot entities with positions, status, colors
- **waypoints**: Path points associated with each robot
- **zones**: Work zone polygons with assigned robots
- **editorState**: Current mode, selections, UI toggles

Access state via `useEditor()` hook. All mutations use dedicated actions (addRobot, updateRobot, addWaypoint, etc.).

### Component Hierarchy
```
App (EditorProvider wraps everything)
└── EditorLayout
    ├── Toolbar (mode buttons, play/pause)
    ├── Sidebar (Properties/Robots/Paths/Zones/Settings panels)
    ├── Scene (Canvas - 3D viewport)
    │   ├── Lighting
    │   ├── Grid (conditional on showGrid)
    │   ├── InteractiveFloor (handles clicks for waypoints/zones)
    │   ├── Greenhouse (structure)
    │   ├── HangingBeds
    │   ├── Robots (renders DraggableRobot for each)
    │   ├── Waypoints (renders Waypoint + PathLine for each robot)
    │   ├── WorkZones (renders WorkZone for each zone)
    │   └── OrbitControls
    └── StatusBar (shows mode, cursor position, stats)
```

### Editor Modes
Five modes controlled by `editorState.mode`:
- **view** (V): Navigate, inspect, no editing
- **edit** (E): Modify greenhouse config (dimensions, beds)
- **robot** (R): Add/select/drag robots
- **path** (P): Click floor to add waypoints for selected robot
- **zone** (Z): Click floor to add polygon points, complete zone on double-click

Keyboard shortcuts in [useKeyboardShortcuts.ts](src/hooks/useKeyboardShortcuts.ts):
- V/E/R/P/Z: Switch modes
- Delete/Backspace: Remove selected robot or zone
- Space: Play/pause simulation
- Ctrl+S: Save (placeholder)
- Ctrl+O: Open (placeholder)

### Coordinate System
**IMPORTANT: Custom coordinate system for intuitive 2D floor planning**
- **X-axis**: Width (50m default) - left/right (좌우)
- **Y-axis**: Length (100m default) - front/back (전후, depth)
- **Z-axis**: Height (8m default) - up/down (높이)
- **Floor plane**: XY plane (Z=0)
- **Height direction**: Z-axis (vertical)
- Beds span X-axis (width) and extend along Y-axis (length/depth)
- Origin (0,0,0) is at ground center of greenhouse
- All positions use meters
- Robot rotation is around Z-axis (floor plane rotation)

### Type System
Key interfaces in [src/types/greenhouse.ts](src/types/greenhouse.ts):
- `GreenhouseConfig` - Dimensions and bed configuration (HangingBedConfig)
- `Robot` - id, name, position (RobotPosition with x/y/z), rotation (Z-axis radians - floor plane rotation), type, status (idle/moving/working), color
- `Waypoint` - id, position, robotId, order (sequence number)
- `WorkZone` - id, name, color, points (polygon vertices on XY plane), assignedRobotIds
- `MapData` - Complete export format with version, config, robots, waypoints, zones, timestamps

### Simulation
[useSimulation.ts](src/hooks/useSimulation.ts) animates robots when `isPlaying` is true:
- Linear interpolation between waypoints (progress += 0.005 per frame)
- Automatic rotation toward movement direction
- Loops back to start when reaching final waypoint
- Updates robot status to "moving" during playback

## Development

### Commands
```bash
npm install                # Install dependencies
npm run dev                # Start dev server (http://localhost:5173)
npm run build              # TypeScript check + Vite production build
npm run preview            # Preview production build
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
npm run type-check         # Run TypeScript compiler without emit
```

### Development Workflow
1. Dev server runs on port 5173 with HMR (Hot Module Replacement)
2. TypeScript checking happens during build, use `npm run type-check` for standalone validation
3. EditorContext provides all state - always use `useEditor()` hook to access/modify
4. When adding new 3D objects, create components in relevant folders (Robot/, Waypoint/, Zone/)
5. Three.js objects should be wrapped in React Three Fiber components (lowercase tags like `<mesh>`, `<boxGeometry>`, etc.)

### Key Patterns
- **Adding a robot**: Call `addRobot()` from context, which auto-selects the new robot
- **Creating waypoints**: User must select a robot first, then clicks in Path mode add waypoints with incrementing order
- **Drawing zones**: Zone mode accumulates points until double-click or explicit completion
- **Drag interactions**: Use `@react-three/drei`'s drag utilities (see DraggableRobot.tsx)
- **Path rendering**: PathLine component uses CatmullRomCurve3 for smooth interpolation

### Important Notes
- Keyboard shortcuts disabled when typing in input/textarea elements
- Robot Z position typically at 0 (ground level) or bed height (Z-axis is vertical)
- Waypoint order determines path sequence - maintain sequential numbering
- Zone points form a closed polygon on XY plane - first and last points auto-connect
- Simulation speed is hardcoded at 0.005 (planned for v0.2.0: adjustable speed)

## Current Status (v0.1.0)

All core features are implemented:
- ✅ 3D greenhouse visualization with customizable dimensions
- ✅ Full editor UI (Toolbar, Sidebar, StatusBar)
- ✅ Robot management with drag-and-drop positioning
- ✅ Path planning with waypoint system
- ✅ Work zone drawing and management
- ✅ Simulation with robot animation along paths
- ✅ JSON export/import (save/load placeholder in shortcuts)

### Known Limitations (v0.1.0)
- No undo/redo functionality
- Simulation speed not adjustable via UI
- No collision detection during simulation
- Zone editing requires complete redraw
- Single-floor greenhouses only
- Save/load UI not implemented (Ctrl+S/O are placeholders)

## Reference Files

- [reference/greenhouse-3d.html](reference/greenhouse-3d.html) - Original Three.js prototype
- [README.md](README.md) - User-facing documentation with feature descriptions
- [RELEASE_NOTES.md](RELEASE_NOTES.md) - Detailed v0.1.0 release information
