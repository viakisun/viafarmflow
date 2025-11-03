#!/bin/bash

# Fix type imports
sed -i '' 's|import { ThreeEvent }|import type { ThreeEvent }|g' src/components/PathEditor.tsx
sed -i '' 's|import { Waypoint as WaypointType }|import type { Waypoint as WaypointType }|g' src/components/PathEditor.tsx
sed -i '' 's|import { Robot as RobotType }|import type { Robot as RobotType }|g' src/components/Robot/DraggableRobot.tsx
sed -i '' 's|import { Robot as RobotType }|import type { Robot as RobotType }|g' src/components/Robot/Robot.tsx
sed -i '' 's|import { WorkZone as WorkZoneType }|import type { WorkZone as WorkZoneType }|g' src/components/Zone/WorkZone.tsx
sed -i '' 's|import { ThreeEvent }|import type { ThreeEvent }|g' src/components/Zone/ZoneEditor.tsx
sed -i '' 's|import { WorkZone, RobotPosition }|import type { WorkZone, RobotPosition }|g' src/components/Zone/ZoneEditor.tsx
sed -i '' 's|import { Waypoint as WaypointType }|import type { Waypoint as WaypointType }|g' src/components/Waypoint/Waypoints.tsx
sed -i '' 's|import { ReactNode }|import type { ReactNode }|g' src/components/Layout/EditorLayout.tsx
sed -i '' 's|import { GreenhouseDimensions }|import type { GreenhouseDimensions }|g' src/components/Greenhouse.tsx
sed -i '' 's|import { HangingBedConfig }|import type { HangingBedConfig }|g' src/components/HangingBeds.tsx
sed -i '' 's|import { GreenhouseConfig }|import type { GreenhouseConfig }|g' src/constants/defaults.ts

echo "Type imports fixed!"