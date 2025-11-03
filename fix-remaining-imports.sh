#!/bin/bash

# Fix type imports in Sidebar panels
sed -i '' 's|import { Robot }|import type { Robot }|g' src/components/Sidebar/RobotsPanel.tsx
sed -i '' 's|import { MapData }|import type { MapData }|g' src/components/Sidebar/SettingsPanel.tsx
sed -i '' 's|import { WorkZone }|import type { WorkZone }|g' src/components/Sidebar/ZonesPanel.tsx

# Fix Waypoint type import
sed -i '' 's|import { Waypoint }|import type { Waypoint }|g' src/components/Waypoint/Waypoint.tsx

echo "Remaining imports fixed!"