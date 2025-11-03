# ViaFarmFlow 🌱

> Professional 3D Greenhouse Map Editor with Robot Path Planning

## Overview

ViaFarmFlow is a cutting-edge 3D greenhouse management system that provides an intuitive interface for designing greenhouse layouts, positioning agricultural robots, and planning optimal navigation paths. Built with React, TypeScript, and Three.js, it offers real-time visualization and simulation capabilities for modern smart farming operations.

## ✨ Features

### 🎮 3D Visualization
- **Interactive 3D Environment** - Full 360° camera controls with zoom and pan
- **Real-time Rendering** - Smooth performance with Three.js and React Three Fiber
- **Customizable Greenhouse** - Adjustable dimensions, bed layouts, and structures
- **High-quality Models** - Detailed robot models with wheels, sensors, and status indicators

### 🤖 Robot Management
- **Multiple Robot Support** - Add and manage multiple agricultural robots
- **Drag & Drop Positioning** - Intuitive 3D placement with collision detection
- **Status Monitoring** - Real-time status indicators (idle, moving, working)
- **Custom Configuration** - Set robot types, names, and colors

### 📍 Path Planning
- **Waypoint System** - Click-to-add waypoints for precise navigation
- **Smooth Path Curves** - CatmullRom spline interpolation for natural movement
- **Visual Path Preview** - See paths with directional arrows and animations
- **Multi-robot Paths** - Separate path planning for each robot

### 🏭 Zone Management
- **Work Zone Definition** - Draw polygonal zones for different work areas
- **Zone Types** - Define planting, harvesting, and maintenance zones
- **Visual Indicators** - Color-coded zones with transparency
- **Zone Statistics** - Area calculations and utilization metrics

### 🎯 Editor Modes
- **View Mode** (V) - Navigate and inspect the greenhouse
- **Edit Mode** (E) - Modify greenhouse configuration
- **Robot Mode** (R) - Add and position robots
- **Path Mode** (P) - Create and edit navigation paths
- **Zone Mode** (Z) - Draw and manage work zones

### 💾 Data Management
- **JSON Export/Import** - Save and load complete greenhouse configurations
- **Version Control** - Built-in versioning for configuration files
- **Auto-save** - Prevent data loss with periodic saves
- **Configuration Templates** - Start with predefined layouts

### 🎬 Simulation
- **Path Animation** - Watch robots move along defined paths
- **Speed Control** - Adjustable simulation speed
- **Collision Detection** - Prevent robot collisions
- **Real-time Updates** - Live status changes during simulation

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Modern web browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/viafarmflow.git

# Navigate to project directory
cd viafarmflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan camera
- **Scroll Wheel** - Zoom in/out
- **Click on Ground** - Add waypoint (Path mode) or zone point (Zone mode)
- **Click on Robot** - Select for editing

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| V | View mode |
| E | Edit mode |
| R | Robot mode |
| P | Path mode |
| Z | Zone mode |
| Space | Play/Pause simulation |
| Delete | Remove selected item |
| Ctrl+S | Export configuration |
| Ctrl+O | Import configuration |

## 📁 Project Structure

```
viafarmflow/
├── src/
│   ├── components/        # React components
│   │   ├── Greenhouse/    # Greenhouse 3D models
│   │   ├── Robot/         # Robot components
│   │   ├── Waypoint/      # Path and waypoint system
│   │   ├── Zone/          # Work zone components
│   │   ├── Layout/        # UI layout components
│   │   ├── Toolbar/       # Top toolbar
│   │   ├── Sidebar/       # Side panels
│   │   └── StatusBar/     # Bottom status bar
│   ├── contexts/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   ├── constants/        # Configuration constants
│   ├── utils/            # Helper functions
│   └── assets/           # Static resources
├── public/               # Public assets
└── reference/            # Documentation and samples
```

## 🔧 Configuration

### Greenhouse Settings
```typescript
{
  dimensions: {
    length: 100,  // meters
    width: 50,    // meters
    height: 8     // meters
  },
  beds: {
    count: 10,
    width: 1.2,
    spacing: 2.0,
    height: 0.8
  }
}
```

### Robot Configuration
```typescript
{
  id: "robot-1",
  name: "Harvester-01",
  type: "harvester",
  position: { x: 0, y: 0, z: 0 },
  status: "idle",
  color: "#4CAF50"
}
```

## 📊 Data Format

ViaFarmFlow uses a JSON-based data format for saving and loading greenhouse configurations:

```json
{
  "version": "1.0.0",
  "config": { ... },
  "robots": [ ... ],
  "waypoints": [ ... ],
  "zones": [ ... ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 📦 Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **3D Graphics**: Three.js + React Three Fiber
- **3D Helpers**: Drei
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Icons**: Emoji icons for UI elements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for excellent 3D graphics library
- React Three Fiber team for React integration
- Agricultural robotics research community
- All contributors and testers

## 📞 Support

For support, email support@viafarmflow.com or open an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Multi-floor greenhouse support
- [ ] Path optimization algorithms
- [ ] Real-time sensor integration
- [ ] Weather condition simulation
- [ ] Mobile app companion
- [ ] Cloud synchronization
- [ ] AI-powered path suggestions
- [ ] VR/AR viewing modes

---

Made with ❤️ by the ViaFarmFlow Team