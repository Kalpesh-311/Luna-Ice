import type {
  AnalysisData,
  HazardStatistics,
  IceStatistics,
  IceTarget,
  ImageMetadata,
  ImageStatistics,
  LandingSite,
  LayerConfig,
  Measurement,
  MissionReportData,
  MissionScores,
  SelectionContext,
  TraverseMetrics,
  WorkflowStep,
} from '../types/mission';
import { DEFAULT_LAYERS } from '../types/mission';
import {
  computeDistanceToShadow,
  computeHazardAnalysis,
  computeIceProbability,
  computeLandingSuitability,
  computeMissionScores,
  computeRoverPath,
  computeShadowMask,
  computeTerrainMask,
  computeTraversability,
  countIceRegions,
  findOptimalLandingSite,
  hazardClassFromIndex,
} from '../lib/analysisEngine';
import { downloadJson, enhanceImage, loadImageFromFile, pixelToGeo } from '../lib/imageUtils';
import { create } from 'zustand';

interface MissionState {
  workflowStep: WorkflowStep;
  layers: LayerConfig[];
  metadata: ImageMetadata | null;
  statistics: ImageStatistics | null;
  analysis: AnalysisData;
  hazardStats: HazardStatistics | null;
  iceStats: IceStatistics | null;
  missionScores: MissionScores | null;
  traverseMetrics: TraverseMetrics | null;
  selection: SelectionContext;
  measurementMode: boolean;
  measurements: Measurement[];
  measureStart: { x: number; y: number } | null;
  processing: boolean;
  processingLabel: string;
  reportOpen: boolean;
  statusMessage: string;

  setWorkflowStep: (step: WorkflowStep) => void;
  toggleLayer: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerAvailable: (id: string, available: boolean) => void;
  importImage: (file: File) => Promise<void>;
  runHazardAnalysis: () => Promise<void>;
  runIceAnalysis: () => Promise<void>;
  runLandingOptimization: () => Promise<void>;
  generateTraverse: () => Promise<void>;
  evaluateMission: () => Promise<void>;
  setSelection: (ctx: SelectionContext) => void;
  toggleMeasurementMode: () => void;
  setMeasureStart: (point: { x: number; y: number } | null) => void;
  addMeasurement: (m: Measurement) => void;
  clearMeasurements: () => void;
  setReportOpen: (open: boolean) => void;
  getReportData: () => MissionReportData;
  exportResults: () => void;
}

const emptyAnalysis = (): AnalysisData => ({
  originalImage: null,
  enhancedImage: null,
  terrainMask: null,
  hazardMap: null,
  hazardClass: null,
  safePixels: 0,
  moderatePixels: 0,
  dangerousPixels: 0,
  extremePixels: 0,
  hazardScore: null,
  shadowMask: null,
  distanceShadow: null,
  iceProbability: null,
  iceTarget: null,
  iceScore: 0,
  landingSuitability: null,
  landingSite: null,
  landingScore: 0,
  traversability: null,
  roverPath: null,
  pathLengthPixels: 0,
  distanceMeters: 0,
  travelTimeHours: 0,
  energyConsumption: 0,
  missionFeasibility: 0,
});

function updateLayer(layers: LayerConfig[], id: string, patch: Partial<LayerConfig>): LayerConfig[] {
  return layers.map((l) => (l.id === id ? { ...l, ...patch } : l));
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const useMissionStore = create<MissionState>((set, get) => ({
  workflowStep: 'ingestion',
  layers: DEFAULT_LAYERS.map((l) => ({ ...l })),
  metadata: null,
  statistics: null,
  analysis: emptyAnalysis(),
  hazardStats: null,
  iceStats: null,
  missionScores: null,
  traverseMetrics: null,
  selection: { type: 'none' },
  measurementMode: false,
  measurements: [],
  measureStart: null,
  processing: false,
  processingLabel: '',
  reportOpen: false,
  statusMessage: 'Awaiting OHRC data ingestion',

  setWorkflowStep: (step) => set({ workflowStep: step }),

  toggleLayer: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    })),

  setLayerOpacity: (id, opacity) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, opacity } : l)),
    })),

  setLayerAvailable: (id, available) =>
    set((s) => ({
      layers: updateLayer(s.layers, id, { available }),
    })),

  importImage: async (file) => {
    set({ processing: true, processingLabel: 'Ingesting OHRC imagery...' });
    await delay(400);
    try {
      const { imageData, metadata, statistics } = await loadImageFromFile(file);
      const enhanced = enhanceImage(imageData);
      const terrainMask = computeTerrainMask(imageData);

      set((s) => ({
        metadata,
        statistics,
        analysis: {
          ...emptyAnalysis(),
          originalImage: imageData,
          enhancedImage: enhanced,
          terrainMask,
        },
        layers: updateLayer(updateLayer(s.layers, 'ohrc', { available: true, visible: true }), 'enhanced', {
          available: true,
        }),
        workflowStep: 'ingestion',
        hazardStats: null,
        iceStats: null,
        missionScores: null,
        traverseMetrics: null,
        statusMessage: `Ingested ${file.name} — ${metadata.width}×${metadata.height} px`,
      }));
    } finally {
      set({ processing: false, processingLabel: '' });
    }
  },

  runHazardAnalysis: async () => {
    const { analysis, metadata } = get();
    if (!analysis.originalImage || !analysis.terrainMask) return;

    set({ processing: true, processingLabel: 'Computing hazard classification...' });
    await delay(500);

    const result = computeHazardAnalysis(analysis.originalImage, analysis.terrainMask);
    const traversability = computeTraversability(result.hazardScore, analysis.terrainMask);

    set((s) => ({
      analysis: {
        ...s.analysis,
        hazardMap: result.hazardMap,
        hazardClass: result.hazardClass,
        hazardScore: result.hazardScore,
        safePixels: result.safePixels,
        moderatePixels: result.moderatePixels,
        dangerousPixels: result.dangerousPixels,
        extremePixels: result.extremePixels,
        traversability,
      },
      hazardStats: result.statistics,
      layers: s.layers.map((l) => {
        if (l.id === 'hazard') return { ...l, available: true, visible: true };
        if (l.id === 'hazard_score') return { ...l, available: true };
        if (l.id === 'traversability') return { ...l, available: true };
        return l;
      }),
      workflowStep: 'hazard',
      statusMessage: `Hazard analysis complete — ${result.statistics.safePercent.toFixed(1)}% safe terrain`,
    }));
    set({ processing: false, processingLabel: '' });
    void metadata;
  },

  runIceAnalysis: async () => {
    const { analysis } = get();
    if (!analysis.originalImage || !analysis.hazardScore) return;

    set({ processing: true, processingLabel: 'Computing shadow-based ice probability...' });
    await delay(500);

    const { width, height } = analysis.originalImage;
    const shadowMask = computeShadowMask(analysis.originalImage);
    const distanceShadow = computeDistanceToShadow(shadowMask, width, height);
    const ice = computeIceProbability(shadowMask, distanceShadow, analysis.hazardScore, width, height);
    const regions = countIceRegions(ice.iceProbability, width, height);
    const highConf = Array.from(ice.iceProbability).filter((p) => p >= 0.6).length;

    const meta = get().metadata!;
    const geo = pixelToGeo(ice.iceTarget.x, ice.iceTarget.y, width, height, meta.bounds);
    const iceTarget: IceTarget = {
      ...ice.iceTarget,
      lon: geo.lon,
      lat: geo.lat,
      probability: ice.iceTarget.probability,
    };

    set((s) => ({
      analysis: {
        ...s.analysis,
        shadowMask,
        distanceShadow,
        iceProbability: ice.iceProbability,
        iceTarget,
        iceScore: ice.iceScore,
      },
      iceStats: {
        candidateRegions: regions,
        meanProbability: ice.iceScore,
        maxProbability: ice.iceTarget.probability,
        highConfidenceArea: highConf,
        highConfidencePercent: (highConf / (width * height)) * 100,
      },
      layers: updateLayer(s.layers, 'ice', { available: true, visible: true }),
      workflowStep: 'ice',
      statusMessage: `Ice assessment complete — ${regions} candidate regions identified`,
    }));
    set({ processing: false, processingLabel: '' });
  },

  runLandingOptimization: async () => {
    const { analysis } = get();
    if (!analysis.originalImage || !analysis.hazardScore || !analysis.iceProbability || !analysis.traversability) return;

    set({ processing: true, processingLabel: 'Optimizing landing site selection...' });
    await delay(500);

    const { width, height } = analysis.originalImage;
    const landingSuitability = computeLandingSuitability(
      analysis.hazardScore,
      analysis.iceProbability,
      analysis.traversability,
      width,
      height,
    );
    const site = findOptimalLandingSite(
      landingSuitability,
      analysis.hazardScore,
      analysis.iceProbability,
      analysis.traversability,
      width,
      height,
    );

    const meta = get().metadata!;
    const geo = pixelToGeo(site.x, site.y, width, height, meta.bounds);
    const landingSite: LandingSite = { ...site, lon: geo.lon, lat: geo.lat };

    set((s) => ({
      analysis: {
        ...s.analysis,
        landingSuitability,
        landingSite,
        landingScore: site.score,
      },
      layers: updateLayer(s.layers, 'landing', { available: true, visible: true }),
      workflowStep: 'landing',
      selection: { type: 'landing', x: site.x, y: site.y, lon: geo.lon, lat: geo.lat, landingScore: site.score },
      statusMessage: `Landing site optimized — suitability ${(site.score * 100).toFixed(1)}%`,
    }));
    set({ processing: false, processingLabel: '' });
  },

  generateTraverse: async () => {
    const { analysis, metadata } = get();
    if (!analysis.landingSite || !analysis.iceTarget || !analysis.traversability || !analysis.hazardScore || !analysis.originalImage) return;

    set({ processing: true, processingLabel: 'Computing rover traverse path...' });
    await delay(500);

    const { width, height } = analysis.originalImage;
    const start = { x: analysis.landingSite.x, y: analysis.landingSite.y };
    const goal = { x: analysis.iceTarget.x, y: analysis.iceTarget.y };
    const resolution = metadata?.resolutionMetersPerPixel ?? 0.25;

    const traverse = computeRoverPath(start, goal, analysis.traversability, analysis.hazardScore, width, height, resolution);

    let difficulty: TraverseMetrics['difficulty'] = 'Low';
    if (traverse.travelTimeHours > 16 || traverse.energyConsumption > 800) difficulty = 'Critical';
    else if (traverse.travelTimeHours > 10) difficulty = 'High';
    else if (traverse.travelTimeHours > 5) difficulty = 'Moderate';

    const traverseMetrics: TraverseMetrics = {
      pathLengthPixels: traverse.pathLengthPixels,
      distanceMeters: traverse.distanceMeters,
      travelTimeHours: traverse.travelTimeHours,
      energyConsumption: traverse.energyConsumption,
      difficulty,
    };

    set((s) => ({
      analysis: {
        ...s.analysis,
        roverPath: traverse.path,
        pathLengthPixels: traverse.pathLengthPixels,
        distanceMeters: traverse.distanceMeters,
        travelTimeHours: traverse.travelTimeHours,
        energyConsumption: traverse.energyConsumption,
      },
      traverseMetrics,
      layers: updateLayer(s.layers, 'traverse', { available: true, visible: true }),
      workflowStep: 'traverse',
      selection: { type: 'path' },
      statusMessage: `Traverse computed — ${traverse.distanceMeters.toFixed(1)} m, ${traverse.travelTimeHours.toFixed(2)} hr`,
    }));
    set({ processing: false, processingLabel: '' });
  },

  evaluateMission: async () => {
    const { analysis, hazardStats, iceStats, traverseMetrics, metadata } = get();
    if (!hazardStats || !iceStats || !analysis.landingSite || !traverseMetrics || !analysis.hazardScore || !metadata) return;

    set({ processing: true, processingLabel: 'Evaluating mission feasibility...' });
    await delay(400);

    const { width } = analysis.originalImage!;
    const li = analysis.landingSite.y * width + analysis.landingSite.x;
    const hazardAtLanding = analysis.hazardScore[li];

    const scores = computeMissionScores(
      hazardStats,
      analysis.iceScore,
      analysis.landingScore,
      traverseMetrics,
      hazardAtLanding,
    );

    set((s) => ({
      missionScores: scores,
      analysis: { ...s.analysis, missionFeasibility: scores.missionFeasibility },
      workflowStep: 'evaluation',
      statusMessage: `Mission evaluation: ${scores.recommendation} (${scores.missionFeasibility.toFixed(1)}% feasibility)`,
    }));
    set({ processing: false, processingLabel: '' });
  },

  setSelection: (ctx) => set({ selection: ctx }),

  toggleMeasurementMode: () =>
    set((s) => ({
      measurementMode: !s.measurementMode,
      measureStart: null,
    })),

  setMeasureStart: (point) => set({ measureStart: point }),

  addMeasurement: (m) => set((s) => ({ measurements: [...s.measurements, m], measureStart: null })),

  clearMeasurements: () => set({ measurements: [], measureStart: null }),

  setReportOpen: (open) => set({ reportOpen: open }),

  getReportData: (): MissionReportData => {
    const s = get();
    return {
      generatedAt: new Date().toISOString(),
      metadata: s.metadata,
      statistics: s.statistics,
      hazardStats: s.hazardStats,
      iceStats: s.iceStats,
      landingSite: s.analysis.landingSite,
      iceTarget: s.analysis.iceTarget,
      traverseMetrics: s.traverseMetrics,
      scores: s.missionScores,
    };
  },

  exportResults: () => {
    const s = get();
    const payload = {
      metadata: s.metadata,
      statistics: s.statistics,
      hazardStats: s.hazardStats,
      iceStats: s.iceStats,
      landingSite: s.analysis.landingSite,
      iceTarget: s.analysis.iceTarget,
      traverseMetrics: s.traverseMetrics,
      missionScores: s.missionScores,
      hazardCoverage: {
        safe: s.analysis.safePixels,
        moderate: s.analysis.moderatePixels,
        dangerous: s.analysis.dangerousPixels,
        extreme: s.analysis.extremePixels,
      },
      traverse: {
        pathLengthPixels: s.analysis.pathLengthPixels,
        distanceMeters: s.analysis.distanceMeters,
        travelTimeHours: s.analysis.travelTimeHours,
        energyConsumption: s.analysis.energyConsumption,
        path: s.analysis.roverPath,
      },
    };
    downloadJson(payload, `lunar-mission-export-${Date.now()}.json`);
  },
}));

export { hazardClassFromIndex };
