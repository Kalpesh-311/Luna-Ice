export type HazardClass = 'safe' | 'moderate' | 'dangerous' | 'extreme';

export type WorkflowStep =
  | 'ingestion'
  | 'hazard'
  | 'ice'
  | 'landing'
  | 'traverse'
  | 'evaluation';

export type MissionRecommendation = 'Recommended' | 'Requires Review' | 'Not Recommended';

export interface ImageMetadata {
  filename: string;
  width: number;
  height: number;
  uploadedAt: string;
  sensor: string;
  resolutionMetersPerPixel: number;
  coordinateSystem: string;
  bounds: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
}

export interface ImageStatistics {
  meanBrightness: number;
  stdBrightness: number;
  minBrightness: number;
  maxBrightness: number;
  dynamicRange: number;
  pixelCount: number;
}

export interface HazardStatistics {
  safe: number;
  moderate: number;
  dangerous: number;
  extreme: number;
  safePercent: number;
  moderatePercent: number;
  dangerousPercent: number;
  extremePercent: number;
  meanHazardScore: number;
}

export interface IceStatistics {
  candidateRegions: number;
  meanProbability: number;
  maxProbability: number;
  highConfidenceArea: number;
  highConfidencePercent: number;
}

export interface LandingSite {
  x: number;
  y: number;
  score: number;
  lon: number;
  lat: number;
  explanation: string;
}

export interface IceTarget {
  x: number;
  y: number;
  probability: number;
  lon: number;
  lat: number;
  regionId: number;
}

export interface TraverseMetrics {
  pathLengthPixels: number;
  distanceMeters: number;
  travelTimeHours: number;
  energyConsumption: number;
  difficulty: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface MissionScores {
  missionFeasibility: number;
  landingSafety: number;
  iceAccessibility: number;
  traverseEfficiency: number;
  operationalRisk: number;
  recommendation: MissionRecommendation;
  notes: string[];
}

export interface Point2D {
  x: number;
  y: number;
}

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  available: boolean;
  category: 'base' | 'analysis' | 'vector';
  description: string;
}

export interface AnalysisData {
  originalImage: ImageData | null;
  enhancedImage: ImageData | null;
  terrainMask: Float32Array | null;
  hazardMap: Float32Array | null;
  hazardClass: Uint8Array | null;
  safePixels: number;
  moderatePixels: number;
  dangerousPixels: number;
  extremePixels: number;
  hazardScore: Float32Array | null;
  shadowMask: Uint8Array | null;
  distanceShadow: Float32Array | null;
  iceProbability: Float32Array | null;
  iceTarget: IceTarget | null;
  iceScore: number;
  landingSuitability: Float32Array | null;
  landingSite: LandingSite | null;
  landingScore: number;
  traversability: Float32Array | null;
  roverPath: Point2D[] | null;
  pathLengthPixels: number;
  distanceMeters: number;
  travelTimeHours: number;
  energyConsumption: number;
  missionFeasibility: number;
}

export interface SelectionContext {
  type: 'none' | 'coordinate' | 'landing' | 'ice' | 'path' | 'hazard';
  x?: number;
  y?: number;
  lon?: number;
  lat?: number;
  hazardClass?: HazardClass;
  hazardScore?: number;
  iceProbability?: number;
  landingScore?: number;
  traversability?: number;
}

export interface Measurement {
  start: Point2D;
  end: Point2D;
  distancePixels: number;
  distanceMeters: number;
}

export interface MissionReportData {
  generatedAt: string;
  metadata: ImageMetadata | null;
  statistics: ImageStatistics | null;
  hazardStats: HazardStatistics | null;
  iceStats: IceStatistics | null;
  landingSite: LandingSite | null;
  iceTarget: IceTarget | null;
  traverseMetrics: TraverseMetrics | null;
  scores: MissionScores | null;
}

export const WORKFLOW_STEPS: { id: WorkflowStep; label: string; short: string }[] = [
  { id: 'ingestion', label: 'Data Ingestion', short: '01 INGEST' },
  { id: 'hazard', label: 'Hazard Assessment', short: '02 HAZARD' },
  { id: 'ice', label: 'Ice Candidate Assessment', short: '03 ICE' },
  { id: 'landing', label: 'Landing Site Optimization', short: '04 LANDING' },
  { id: 'traverse', label: 'Traverse Planning', short: '05 TRAVERSE' },
  { id: 'evaluation', label: 'Mission Evaluation', short: '06 EVAL' },
];

export const HAZARD_COLORS: Record<HazardClass, string> = {
  safe: '#3d7a4a',
  moderate: '#8a7a3a',
  dangerous: '#9a5030',
  extreme: '#8a2020',
};

export const DEFAULT_LAYERS: LayerConfig[] = [
  {
    id: 'ohrc',
    name: 'OHRC Imagery',
    visible: true,
    opacity: 1,
    available: false,
    category: 'base',
    description: 'Chandrayaan-2 OHRC panchromatic imagery',
  },
  {
    id: 'enhanced',
    name: 'Enhanced Imagery',
    visible: false,
    opacity: 0.85,
    available: false,
    category: 'base',
    description: 'Contrast-enhanced OHRC product',
  },
  {
    id: 'hazard',
    name: 'Hazard Classification',
    visible: false,
    opacity: 0.65,
    available: false,
    category: 'analysis',
    description: 'Terrain hazard class overlay',
  },
  {
    id: 'hazard_score',
    name: 'Hazard Score',
    visible: false,
    opacity: 0.55,
    available: false,
    category: 'analysis',
    description: 'Continuous hazard probability surface',
  },
  {
    id: 'ice',
    name: 'Ice Probability',
    visible: false,
    opacity: 0.6,
    available: false,
    category: 'analysis',
    description: 'Shadow-based ice candidate probability',
  },
  {
    id: 'landing',
    name: 'Landing Suitability',
    visible: false,
    opacity: 0.55,
    available: false,
    category: 'analysis',
    description: 'Composite landing site suitability index',
  },
  {
    id: 'traversability',
    name: 'Traversability',
    visible: false,
    opacity: 0.5,
    available: false,
    category: 'analysis',
    description: 'Rover surface traversability index',
  },
  {
    id: 'traverse',
    name: 'Rover Traverse Path',
    visible: false,
    opacity: 1,
    available: false,
    category: 'vector',
    description: 'Optimized rover traverse route',
  },
];
