#!/bin/bash

# Fix imports in components
sed -i '' 's|import { useEditor } from "../contexts/EditorContext"|import { useEditor } from "../contexts"|g' src/components/PathEditor.tsx
sed -i '' 's|import { useEditor } from "../contexts/EditorContext"|import { useEditor } from "../contexts"|g' src/components/Scene.tsx

# Fix imports in subfolders
sed -i '' 's|import { useEditor } from "../../contexts/EditorContext"|import { useEditor } from "../../contexts"|g' src/components/Sidebar/*.tsx
sed -i '' 's|import { useEditor } from "../../contexts/EditorContext"|import { useEditor } from "../../contexts"|g' src/components/StatusBar/*.tsx
sed -i '' 's|import { useEditor } from "../../contexts/EditorContext"|import { useEditor } from "../../contexts"|g' src/components/Zone/*.tsx
sed -i '' 's|import { useEditor } from "../../contexts/EditorContext"|import { useEditor } from "../../contexts"|g' src/components/Robot/*.tsx
sed -i '' 's|import { useEditor } from "../../contexts/EditorContext"|import { useEditor } from "../../contexts"|g' src/components/Waypoint/*.tsx

# Fix imports in hooks
sed -i '' 's|import { useEditor } from "../contexts/EditorContext"|import { useEditor } from "../contexts"|g' src/hooks/*.ts

# Fix type imports in Sidebar and Toolbar
sed -i '' 's|import { useEditor, PanelTab } from "../../contexts/EditorContext"|import { useEditor, type PanelTab } from "../../contexts"|g' src/components/Sidebar/Sidebar.tsx
sed -i '' 's|import { useEditor, EditorMode } from "../../contexts/EditorContext"|import { useEditor, type EditorMode } from "../../contexts"|g' src/components/Toolbar/Toolbar.tsx

echo "Imports fixed!"