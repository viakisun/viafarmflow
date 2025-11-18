// Central icon registry for the application
// Maps icon names to Lucide React components

import {
  // View modes
  Eye,
  Edit2,
  Bot,
  Route,
  Grid3x3,

  // Actions
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Scale,
  Undo2,
  Redo2,
  Save,
  Upload,
  Download,
  Plus,
  Minus,
  Trash2,
  Copy,

  // UI Elements
  Grid,
  Ruler,
  Settings,
  Info,
  HelpCircle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Filter,

  // Panels
  Sliders,
  MapPin,
  Layers,
  Thermometer,
  Gauge,
  Home,

  // Status
  Circle,
  CircleDot,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,

  // Environment
  Sun,
  Cloud,
  Wind,
  Droplets,
  Zap,

  // View toggle
  Box,
  Square,
  Maximize,
  Minimize,
  Move3d,

  // Data
  FileJson,
  Database,
  BarChart3,
  Activity
} from 'lucide-react';

// Icon map for easy reference
export const Icons = {
  // View modes
  view: Eye,
  edit: Edit2,
  robot: Bot,
  path: Route,
  zone: Grid3x3,
  floor: Square,

  // Actions
  play: Play,
  pause: Pause,
  reset: RotateCcw,
  undo: Undo2,
  redo: Redo2,
  save: Save,
  import: Upload,
  export: Download,
  add: Plus,
  remove: Minus,
  delete: Trash2,
  duplicate: Copy,

  // UI Elements
  grid: Grid,
  dimensions: Ruler,
  settings: Settings,
  info: Info,
  help: HelpCircle,
  close: X,
  check: Check,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  menu: Menu,
  search: Search,
  filter: Filter,
  home: Home,
  cube: Box,
  checkCircle: CheckCircle,
  alertTriangle: AlertTriangle,
  alertCircle: AlertCircle,

  // Panels
  properties: Sliders,
  robots: Bot,
  paths: MapPin,
  zones: Layers,
  environment: Thermometer,
  monitor: Gauge,

  // Status
  statusIdle: Circle,
  statusActive: CircleDot,
  statusWarning: AlertCircle,
  statusSuccess: CheckCircle,
  statusError: XCircle,

  // Environment
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
  co2: Cloud,
  ventilation: Wind,
  power: Zap,

  // View toggle
  view3d: Box,
  view2d: Square,
  maximize: Maximize,
  minimize: Minimize,
  move3d: Move3d,

  // Transform controls
  move: Move3d,
  rotate: RotateCw,
  scale: Scale,

  // Data
  data: FileJson,
  database: Database,
  chart: BarChart3,
  activity: Activity
} as const;

export type IconName = keyof typeof Icons;