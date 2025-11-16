// Mock hierarchical map data for testing and development
import type { HierarchicalMapData, GreenhouseObject, ZoneObject, RobotObject, WaypointObject, BedObject, SensorObject, MapObject } from '../types/mapData';

// Create mock data with realistic greenhouse configuration
export const createMockMapData = (): HierarchicalMapData => {
  const now = new Date().toISOString();

  // Root greenhouse
  const greenhouse: GreenhouseObject = {
    id: 'greenhouse-main',
    type: 'greenhouse',
    name: 'Main Production Greenhouse',
    parentId: null,
    children: ['zone-1', 'zone-2', 'zone-3', 'bed-row-1', 'bed-row-2', 'sensor-env-1', 'sensor-env-2'],
    visible: true,
    locked: false,
    config: {
      dimensions: { width: 40, height: 8, length: 100 },
      beds: {
        width: 1.5,
        height: 3,
        length: 80,
        count: 10,
        spacing: 2,
        heightFromGround: 3,
      },
    },
    metadata: {
      location: 'Farm Section A',
      constructionYear: 2023,
      lastMaintenance: '2024-10-15',
    },
  };

  // Zone 1 - Entry/Preparation Area
  const zone1: ZoneObject = {
    id: 'zone-1',
    type: 'zone',
    name: 'Entry & Preparation Zone',
    parentId: 'greenhouse-main',
    children: ['robot-1', 'robot-2'],
    visible: true,
    locked: false,
    color: '#10b981',
    points: [
      { x: -15, z: -45 },
      { x: 15, z: -45 },
      { x: 15, z: -30 },
      { x: -15, z: -30 },
    ],
    assignedRobotIds: ['robot-1', 'robot-2'],
    metadata: {
      purpose: 'Robot staging and tool preparation',
      accessLevel: 'restricted',
    },
  };

  // Zone 2 - Main Growing Area
  const zone2: ZoneObject = {
    id: 'zone-2',
    type: 'zone',
    name: 'Main Growing Zone',
    parentId: 'greenhouse-main',
    children: ['robot-3', 'robot-4'],
    visible: true,
    locked: false,
    color: '#3b82f6',
    points: [
      { x: -15, z: -25 },
      { x: 15, z: -25 },
      { x: 15, z: 25 },
      { x: -15, z: 25 },
    ],
    assignedRobotIds: ['robot-3', 'robot-4'],
    metadata: {
      cropType: 'Tomatoes',
      plantingDate: '2024-09-01',
      expectedHarvest: '2024-12-15',
    },
  };

  // Zone 3 - Harvest/Storage Area
  const zone3: ZoneObject = {
    id: 'zone-3',
    type: 'zone',
    name: 'Harvest & Storage Zone',
    parentId: 'greenhouse-main',
    children: ['robot-5'],
    visible: true,
    locked: false,
    color: '#f59e0b',
    points: [
      { x: -15, z: 30 },
      { x: 15, z: 30 },
      { x: 15, z: 45 },
      { x: -15, z: 45 },
    ],
    assignedRobotIds: ['robot-5'],
    metadata: {
      storageCapacity: '500kg',
      temperature: '12-15°C',
    },
  };

  // Robots
  const robot1: RobotObject = {
    id: 'robot-1',
    type: 'robot',
    name: 'Seeding Robot Alpha',
    parentId: 'zone-1',
    children: ['waypoint-1-1', 'waypoint-1-2', 'waypoint-1-3'],
    visible: true,
    locked: false,
    position: { x: -5, y: 0.5, z: -40 },
    rotation: 0,
    status: 'idle',
    model: 'seeder-v2',
    zoneId: 'zone-1',
    metadata: {
      batteryLevel: 85,
      lastMaintenance: '2024-11-01',
      operatingHours: 1234,
    },
  };

  const robot2: RobotObject = {
    id: 'robot-2',
    type: 'robot',
    name: 'Watering Robot Beta',
    parentId: 'zone-1',
    children: ['waypoint-2-1', 'waypoint-2-2'],
    visible: true,
    locked: false,
    position: { x: 5, y: 0.5, z: -35 },
    rotation: 90,
    status: 'working',
    model: 'sprayer-x1',
    zoneId: 'zone-1',
    metadata: {
      batteryLevel: 62,
      waterTankLevel: 40,
      lastRefill: '2024-11-14T08:00:00Z',
    },
  };

  const robot3: RobotObject = {
    id: 'robot-3',
    type: 'robot',
    name: 'Monitoring Robot Gamma',
    parentId: 'zone-2',
    children: ['waypoint-3-1', 'waypoint-3-2', 'waypoint-3-3', 'waypoint-3-4'],
    visible: true,
    locked: false,
    position: { x: -10, y: 0.5, z: 0 },
    rotation: 180,
    status: 'moving',
    model: 'scanner-pro',
    zoneId: 'zone-2',
    metadata: {
      batteryLevel: 91,
      scanCount: 15420,
      anomaliesDetected: 3,
    },
  };

  const robot4: RobotObject = {
    id: 'robot-4',
    type: 'robot',
    name: 'Pruning Robot Delta',
    parentId: 'zone-2',
    children: [],
    visible: true,
    locked: false,
    position: { x: 10, y: 0.5, z: 10 },
    rotation: 270,
    status: 'idle',
    model: 'pruner-mk3',
    zoneId: 'zone-2',
    metadata: {
      batteryLevel: 100,
      toolCondition: 'good',
      plantsProcessed: 847,
    },
  };

  const robot5: RobotObject = {
    id: 'robot-5',
    type: 'robot',
    name: 'Harvest Robot Epsilon',
    parentId: 'zone-3',
    children: ['waypoint-5-1', 'waypoint-5-2'],
    visible: false, // Example of hidden object
    locked: false,
    position: { x: 0, y: 0.5, z: 40 },
    rotation: 45,
    status: 'idle',
    model: 'harvester-v5',
    zoneId: 'zone-3',
    metadata: {
      batteryLevel: 45,
      basketCapacity: 75,
      harvestWeight: '38.5kg',
    },
  };

  // Waypoints
  const waypoint11: WaypointObject = {
    id: 'waypoint-1-1',
    type: 'waypoint',
    name: 'Entry Point',
    parentId: 'robot-1',
    children: [],
    visible: true,
    locked: false,
    position: { x: -5, y: 0.5, z: -45 },
    robotId: 'robot-1',
    order: 1,
    waitTime: 5,
    action: 'scan_area',
  };

  const waypoint12: WaypointObject = {
    id: 'waypoint-1-2',
    type: 'waypoint',
    name: 'Seed Loading',
    parentId: 'robot-1',
    children: [],
    visible: true,
    locked: false,
    position: { x: -5, y: 0.5, z: -35 },
    robotId: 'robot-1',
    order: 2,
    waitTime: 30,
    action: 'load_seeds',
  };

  const waypoint13: WaypointObject = {
    id: 'waypoint-1-3',
    type: 'waypoint',
    name: 'Start Position',
    parentId: 'robot-1',
    children: [],
    visible: true,
    locked: false,
    position: { x: -5, y: 0.5, z: -30 },
    robotId: 'robot-1',
    order: 3,
    action: 'begin_seeding',
  };

  const waypoint21: WaypointObject = {
    id: 'waypoint-2-1',
    type: 'waypoint',
    name: 'Water Station',
    parentId: 'robot-2',
    children: [],
    visible: true,
    locked: false,
    position: { x: 5, y: 0.5, z: -40 },
    robotId: 'robot-2',
    order: 1,
    waitTime: 60,
    action: 'refill_water',
  };

  const waypoint22: WaypointObject = {
    id: 'waypoint-2-2',
    type: 'waypoint',
    name: 'Watering Start',
    parentId: 'robot-2',
    children: [],
    visible: true,
    locked: false,
    position: { x: 5, y: 0.5, z: -30 },
    robotId: 'robot-2',
    order: 2,
    action: 'start_watering',
  };

  const waypoint31: WaypointObject = {
    id: 'waypoint-3-1',
    type: 'waypoint',
    name: 'Scan Point A',
    parentId: 'robot-3',
    children: [],
    visible: true,
    locked: false,
    position: { x: -10, y: 0.5, z: -20 },
    robotId: 'robot-3',
    order: 1,
    waitTime: 10,
    action: 'full_scan',
  };

  const waypoint32: WaypointObject = {
    id: 'waypoint-3-2',
    type: 'waypoint',
    name: 'Scan Point B',
    parentId: 'robot-3',
    children: [],
    visible: true,
    locked: false,
    position: { x: -10, y: 0.5, z: 0 },
    robotId: 'robot-3',
    order: 2,
    waitTime: 10,
    action: 'full_scan',
  };

  const waypoint33: WaypointObject = {
    id: 'waypoint-3-3',
    type: 'waypoint',
    name: 'Scan Point C',
    parentId: 'robot-3',
    children: [],
    visible: true,
    locked: false,
    position: { x: -10, y: 0.5, z: 20 },
    robotId: 'robot-3',
    order: 3,
    waitTime: 10,
    action: 'full_scan',
  };

  const waypoint34: WaypointObject = {
    id: 'waypoint-3-4',
    type: 'waypoint',
    name: 'Return Point',
    parentId: 'robot-3',
    children: [],
    visible: true,
    locked: true, // Example of locked object
    position: { x: -10, y: 0.5, z: 0 },
    robotId: 'robot-3',
    order: 4,
    action: 'return_home',
  };

  const waypoint51: WaypointObject = {
    id: 'waypoint-5-1',
    type: 'waypoint',
    name: 'Harvest Start',
    parentId: 'robot-5',
    children: [],
    visible: true,
    locked: false,
    position: { x: 0, y: 0.5, z: 30 },
    robotId: 'robot-5',
    order: 1,
    action: 'begin_harvest',
  };

  const waypoint52: WaypointObject = {
    id: 'waypoint-5-2',
    type: 'waypoint',
    name: 'Unload Station',
    parentId: 'robot-5',
    children: [],
    visible: true,
    locked: false,
    position: { x: 0, y: 0.5, z: 45 },
    robotId: 'robot-5',
    order: 2,
    waitTime: 45,
    action: 'unload_harvest',
  };

  // Growing Beds
  const bedRow1: BedObject = {
    id: 'bed-row-1',
    type: 'bed',
    name: 'Growing Bed Row 1',
    parentId: 'greenhouse-main',
    children: [],
    visible: true,
    locked: true,
    position: { x: -10, y: 3, z: 0 },
    dimensions: { width: 1.5, length: 80, height: 0.3 },
    cropType: 'Cherry Tomatoes',
    plantedDate: '2024-09-15',
    metadata: {
      soilPH: 6.5,
      nutrientLevel: 'optimal',
      pestStatus: 'clear',
    },
  };

  const bedRow2: BedObject = {
    id: 'bed-row-2',
    type: 'bed',
    name: 'Growing Bed Row 2',
    parentId: 'greenhouse-main',
    children: [],
    visible: true,
    locked: true,
    position: { x: 10, y: 3, z: 0 },
    dimensions: { width: 1.5, length: 80, height: 0.3 },
    cropType: 'Roma Tomatoes',
    plantedDate: '2024-09-20',
    metadata: {
      soilPH: 6.3,
      nutrientLevel: 'low',
      pestStatus: 'monitoring',
    },
  };

  // Environmental Sensors
  const sensor1: SensorObject = {
    id: 'sensor-env-1',
    type: 'sensor',
    name: 'Climate Sensor North',
    parentId: 'greenhouse-main',
    children: [],
    visible: true,
    locked: false,
    position: { x: 0, y: 6, z: -30 },
    sensorType: 'temperature',
    value: 24.5,
    unit: '°C',
    metadata: {
      lastCalibration: '2024-10-01',
      accuracy: '±0.5°C',
      model: 'TempProbe-X200',
    },
  };

  const sensor2: SensorObject = {
    id: 'sensor-env-2',
    type: 'sensor',
    name: 'Humidity Sensor South',
    parentId: 'greenhouse-main',
    children: [],
    visible: true,
    locked: false,
    position: { x: 0, y: 6, z: 30 },
    sensorType: 'humidity',
    value: 65,
    unit: '%',
    metadata: {
      lastCalibration: '2024-10-01',
      accuracy: '±2%',
      model: 'HumidTrack-Pro',
    },
  };

  // Create the objects map
  const objects = new Map<string, MapObject>([
    ['greenhouse-main', greenhouse],
    ['zone-1', zone1],
    ['zone-2', zone2],
    ['zone-3', zone3],
    ['robot-1', robot1],
    ['robot-2', robot2],
    ['robot-3', robot3],
    ['robot-4', robot4],
    ['robot-5', robot5],
    ['waypoint-1-1', waypoint11],
    ['waypoint-1-2', waypoint12],
    ['waypoint-1-3', waypoint13],
    ['waypoint-2-1', waypoint21],
    ['waypoint-2-2', waypoint22],
    ['waypoint-3-1', waypoint31],
    ['waypoint-3-2', waypoint32],
    ['waypoint-3-3', waypoint33],
    ['waypoint-3-4', waypoint34],
    ['waypoint-5-1', waypoint51],
    ['waypoint-5-2', waypoint52],
    ['bed-row-1', bedRow1],
    ['bed-row-2', bedRow2],
    ['sensor-env-1', sensor1],
    ['sensor-env-2', sensor2],
  ]);

  // Complete map data structure
  const mapData: HierarchicalMapData = {
    version: '2.0.0',
    name: 'ViaFarm Greenhouse Complex A',
    description: 'Main production greenhouse with automated robot workforce for tomato cultivation',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: now,
    author: 'ViaFarmFlow System',
    root: greenhouse,
    objects,
    selection: {
      primary: 'robot-3', // Example: Robot 3 is currently selected
      secondary: ['waypoint-3-1', 'waypoint-3-2'], // Its waypoints are secondary selection
    },
    viewSettings: {
      expandedNodes: ['greenhouse-main', 'zone-2', 'robot-3'], // Expanded in tree view
      hiddenObjects: ['robot-5'], // Robot 5 is hidden
      lockedLayers: ['bed-row-1', 'bed-row-2'], // Beds are locked
    },
    metadata: {
      tags: ['production', 'tomatoes', 'automated', 'zone-a'],
      notes: 'Regular maintenance scheduled for 2024-12-01. Zone 2 nutrient levels need monitoring.',
      lastModified: {
        userId: 'admin-user',
        timestamp: now,
        changes: 'Added environmental sensors and updated robot waypoints',
      },
    },
  };

  return mapData;
};

// Export as singleton instance
export const mockMapData = createMockMapData();

// Export as JSON string for file export
export const mockMapDataJSON = JSON.stringify(mockMapData, (_key, value) => {
  // Convert Map to object for JSON serialization
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  return value;
}, 2);