import type { HazardClass, HazardStatistics, Point2D } from '../types/mission';
import { clamp, getGrayscale } from './imageUtils';

const KERNEL = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

function convolve(data: ImageData, x: number, y: number): number {
  const { width, height } = data;
  let sum = 0;
  let ki = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = clamp(x + dx, 0, width - 1);
      const ny = clamp(y + dy, 0, height - 1);
      sum += getGrayscale(data, nx, ny) * KERNEL[ki++];
    }
  }
  return Math.abs(sum) / 255;
}

function localVariance(data: ImageData, x: number, y: number, radius = 2): number {
  const { width, height } = data;
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = clamp(x + dx, 0, width - 1);
      const ny = clamp(y + dy, 0, height - 1);
      const g = getGrayscale(data, nx, ny) / 255;
      sum += g;
      sumSq += g * g;
      count++;
    }
  }
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

export function computeTerrainMask(imageData: ImageData): Float32Array {
  const { width, height } = imageData;
  const mask = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = convolve(imageData, x, y);
      const variance = localVariance(imageData, x, y);
      mask[y * width + x] = clamp(edge * 0.6 + variance * 2.5, 0, 1);
    }
  }
  return mask;
}

export function computeHazardAnalysis(imageData: ImageData, terrainMask: Float32Array): {
  hazardMap: Float32Array;
  hazardClass: Uint8Array;
  hazardScore: Float32Array;
  safePixels: number;
  moderatePixels: number;
  dangerousPixels: number;
  extremePixels: number;
  statistics: HazardStatistics;
} {
  const { width, height } = imageData;
  const n = width * height;
  const hazardMap = new Float32Array(n);
  const hazardScore = new Float32Array(n);
  const hazardClass = new Uint8Array(n);

  let safe = 0;
  let moderate = 0;
  let dangerous = 0;
  let extreme = 0;
  let scoreSum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const terrain = terrainMask[i];
      const edge = convolve(imageData, x, y);
      const variance = localVariance(imageData, x, y, 3);
      const slope = clamp(edge * 0.7 + terrain * 0.3, 0, 1);
      const roughness = clamp(variance * 4, 0, 1);
      const score = clamp(slope * 0.55 + roughness * 0.45, 0, 1);

      hazardMap[i] = score;
      hazardScore[i] = score;

      let cls: HazardClass;
      if (score < 0.25) {
        cls = 'safe';
        hazardClass[i] = 0;
        safe++;
      } else if (score < 0.5) {
        cls = 'moderate';
        hazardClass[i] = 1;
        moderate++;
      } else if (score < 0.75) {
        cls = 'dangerous';
        hazardClass[i] = 2;
        dangerous++;
      } else {
        cls = 'extreme';
        hazardClass[i] = 3;
        extreme++;
      }
      scoreSum += score;
      void cls;
    }
  }

  const total = n;
  return {
    hazardMap,
    hazardClass,
    hazardScore,
    safePixels: safe,
    moderatePixels: moderate,
    dangerousPixels: dangerous,
    extremePixels: extreme,
    statistics: {
      safe,
      moderate,
      dangerous,
      extreme,
      safePercent: (safe / total) * 100,
      moderatePercent: (moderate / total) * 100,
      dangerousPercent: (dangerous / total) * 100,
      extremePercent: (extreme / total) * 100,
      meanHazardScore: scoreSum / total,
    },
  };
}

export function computeShadowMask(imageData: ImageData): Uint8Array {
  const { width, height, data } = imageData;
  const mask = new Uint8Array(width * height);
  const threshold = 45;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const gray = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
      mask[i] = gray < threshold ? 1 : 0;
    }
  }
  return mask;
}

export function computeDistanceToShadow(shadowMask: Uint8Array, width: number, height: number): Float32Array {
  const dist = new Float32Array(width * height);
  const maxDist = Math.max(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (shadowMask[i]) {
        dist[i] = 0;
        continue;
      }
      let minD = maxDist;
      const search = 12;
      for (let dy = -search; dy <= search; dy++) {
        for (let dx = -search; dx <= search; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (shadowMask[ny * width + nx]) {
            minD = Math.min(minD, Math.hypot(dx, dy));
          }
        }
      }
      dist[i] = minD / search;
    }
  }
  return dist;
}

export function computeIceProbability(
  shadowMask: Uint8Array,
  distanceShadow: Float32Array,
  hazardScore: Float32Array,
  width: number,
  height: number,
): { iceProbability: Float32Array; iceScore: number; iceTarget: { x: number; y: number; probability: number; regionId: number } } {
  const n = width * height;
  const iceProbability = new Float32Array(n);
  let maxProb = 0;
  let targetX = 0;
  let targetY = 0;
  let regionId = 1;
  let sum = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const inShadow = shadowMask[i];
      const proximity = 1 - distanceShadow[i];
      const safety = 1 - hazardScore[i];
      const prob = clamp(
        inShadow ? 0.65 + proximity * 0.25 + safety * 0.1 : proximity * 0.35 + safety * 0.15,
        0,
        1,
      );
      iceProbability[i] = prob;
      sum += prob;
      if (prob > maxProb) {
        maxProb = prob;
        targetX = x;
        targetY = y;
      }
    }
  }

  return {
    iceProbability,
    iceScore: sum / n,
    iceTarget: { x: targetX, y: targetY, probability: maxProb, regionId },
  };
}

export function computeTraversability(hazardScore: Float32Array, terrainMask: Float32Array): Float32Array {
  const n = hazardScore.length;
  const traversability = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    traversability[i] = clamp((1 - hazardScore[i]) * 0.7 + (1 - terrainMask[i]) * 0.3, 0, 1);
  }
  return traversability;
}

export function computeLandingSuitability(
  hazardScore: Float32Array,
  iceProbability: Float32Array,
  traversability: Float32Array,
  width: number,
  height: number,
): Float32Array {
  const n = width * height;
  const suitability = new Float32Array(n);
  const margin = Math.floor(Math.min(width, height) * 0.05);

  for (let y = margin; y < height - margin; y++) {
    for (let x = margin; x < width - margin; x++) {
      const i = y * width + x;
      const safety = 1 - hazardScore[i];
      const iceAccess = computeLocalMean(iceProbability, x, y, width, height, 8);
      const traverse = traversability[i];
      suitability[i] = clamp(safety * 0.45 + iceAccess * 0.3 + traverse * 0.25, 0, 1);
    }
  }
  return suitability;
}

function computeLocalMean(
  arr: Float32Array,
  cx: number,
  cy: number,
  width: number,
  height: number,
  radius: number,
): number {
  let sum = 0;
  let count = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      sum += arr[y * width + x];
      count++;
    }
  }
  return count ? sum / count : 0;
}

export function findOptimalLandingSite(
  landingSuitability: Float32Array,
  hazardScore: Float32Array,
  iceProbability: Float32Array,
  traversability: Float32Array,
  width: number,
  height: number,
): { x: number; y: number; score: number; explanation: string } {
  let bestScore = -1;
  let bestX = Math.floor(width / 2);
  let bestY = Math.floor(height / 2);
  const margin = Math.floor(Math.min(width, height) * 0.08);

  for (let y = margin; y < height - margin; y++) {
    for (let x = margin; x < width - margin; x++) {
      const i = y * width + x;
      const score = landingSuitability[i];
      if (score > bestScore && hazardScore[i] < 0.45) {
        bestScore = score;
        bestX = x;
        bestY = y;
      }
    }
  }

  const bi = bestY * width + bestX;
  const safety = 1 - hazardScore[bi];
  const ice = computeLocalMean(iceProbability, bestX, bestY, width, height, 10);
  const traverse = traversability[bi];

  const explanation =
    `Selected site at (${bestX}, ${bestY}) based on composite suitability index ${(bestScore * 100).toFixed(1)}%. ` +
    `Hazard safety margin: ${(safety * 100).toFixed(1)}%. ` +
    `Regional ice accessibility: ${(ice * 100).toFixed(1)}%. ` +
    `Surface traversability: ${(traverse * 100).toFixed(1)}%. ` +
    `Site satisfies landing constraints with acceptable slope/roughness envelope and proximity to PSR ice candidates.`;

  return { x: bestX, y: bestY, score: bestScore, explanation };
}

export function computeRoverPath(
  start: Point2D,
  goal: Point2D,
  traversability: Float32Array,
  hazardScore: Float32Array,
  width: number,
  height: number,
  resolutionMeters: number,
): {
  path: Point2D[];
  pathLengthPixels: number;
  distanceMeters: number;
  travelTimeHours: number;
  energyConsumption: number;
} {
  const path = astar(start, goal, traversability, hazardScore, width, height);
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
  }

  const distanceMeters = length * resolutionMeters;
  const avgTraverse =
    path.reduce((s, p) => s + traversability[p.y * width + p.x], 0) / Math.max(1, path.length);
  const difficultyFactor = 2 - avgTraverse;
  const travelTimeHours = (distanceMeters / 500) * difficultyFactor;
  const energyConsumption = distanceMeters * 0.85 * difficultyFactor;

  return { path, pathLengthPixels: length, distanceMeters, travelTimeHours, energyConsumption };
}

function astar(
  start: Point2D,
  goal: Point2D,
  traversability: Float32Array,
  hazardScore: Float32Array,
  width: number,
  height: number,
): Point2D[] {
  const key = (x: number, y: number) => y * width + x;
  const open = new Map<number, { x: number; y: number; f: number; g: number }>();
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();

  const startK = key(start.x, start.y);
  gScore.set(startK, 0);
  open.set(startK, {
    x: start.x,
    y: start.y,
    g: 0,
    f: heuristic(start, goal),
  });

  const neighbors = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  while (open.size > 0) {
    let current: { x: number; y: number; f: number; g: number } | null = null;
    let currentKey = -1;
    for (const [k, node] of open) {
      if (!current || node.f < current.f) {
        current = node;
        currentKey = k;
      }
    }
    if (!current) break;

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, currentKey, width, start);
    }

    open.delete(currentKey);

    for (const [dx, dy] of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

      const ni = key(nx, ny);
      const hazard = hazardScore[ni];
      if (hazard > 0.8) continue;

      const moveCost = Math.hypot(dx, dy) * (1.5 - traversability[ni] + hazard * 0.5);
      const tentative = (gScore.get(currentKey) ?? Infinity) + moveCost;

      if (tentative < (gScore.get(ni) ?? Infinity)) {
        cameFrom.set(ni, currentKey);
        gScore.set(ni, tentative);
        open.set(ni, {
          x: nx,
          y: ny,
          g: tentative,
          f: tentative + heuristic({ x: nx, y: ny }, goal),
        });
      }
    }
  }

  return [start, goal];
}

function heuristic(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function reconstructPath(
  cameFrom: Map<number, number>,
  currentKey: number,
  width: number,
  start: Point2D,
): Point2D[] {
  const path: Point2D[] = [];
  let k: number | undefined = currentKey;
  while (k !== undefined) {
    path.unshift({ x: k % width, y: Math.floor(k / width) });
    k = cameFrom.get(k);
  }
  if (path.length === 0) return [start];
  return path;
}

export function computeMissionScores(
  hazardStats: HazardStatistics,
  iceScore: number,
  landingScore: number,
  traverseMetrics: { distanceMeters: number; travelTimeHours: number; energyConsumption: number },
  hazardAtLanding: number,
): {
  missionFeasibility: number;
  landingSafety: number;
  iceAccessibility: number;
  traverseEfficiency: number;
  operationalRisk: number;
  recommendation: 'Recommended' | 'Requires Review' | 'Not Recommended';
  notes: string[];
} {
  const landingSafety = clamp((1 - hazardAtLanding) * 100, 0, 100);
  const iceAccessibility = clamp(iceScore * 100 + landingScore * 20, 0, 100);
  const traverseEfficiency = clamp(100 - traverseMetrics.travelTimeHours * 8 - traverseMetrics.energyConsumption * 0.02, 0, 100);
  const operationalRisk = clamp(
    hazardStats.extremePercent * 2 + hazardStats.dangerousPercent * 0.5 + traverseMetrics.travelTimeHours * 5,
    0,
    100,
  );

  const missionFeasibility = clamp(
    landingSafety * 0.3 + iceAccessibility * 0.25 + traverseEfficiency * 0.25 + (100 - operationalRisk) * 0.2,
    0,
    100,
  );

  const notes: string[] = [];
  if (hazardStats.extremePercent > 5) notes.push('Elevated extreme hazard coverage detected in scene.');
  if (iceScore < 0.3) notes.push('Ice candidate confidence below nominal threshold for polar volatiles mission.');
  if (traverseMetrics.travelTimeHours > 12) notes.push('Traverse duration exceeds single-sol operational window.');
  if (landingSafety > 75 && missionFeasibility > 70) notes.push('Landing envelope within acceptable safety margins.');
  if (notes.length === 0) notes.push('All primary mission parameters within nominal operational bounds.');

  let recommendation: 'Recommended' | 'Requires Review' | 'Not Recommended';
  if (missionFeasibility >= 72 && landingSafety >= 65 && operationalRisk < 45) {
    recommendation = 'Recommended';
  } else if (missionFeasibility >= 50 && landingSafety >= 45) {
    recommendation = 'Requires Review';
  } else {
    recommendation = 'Not Recommended';
  }

  return {
    missionFeasibility,
    landingSafety,
    iceAccessibility,
    traverseEfficiency,
    operationalRisk,
    recommendation,
    notes,
  };
}

export function countIceRegions(iceProbability: Float32Array, width: number, height: number, threshold = 0.55): number {
  const visited = new Uint8Array(width * height);
  let regions = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (visited[i] || iceProbability[i] < threshold) continue;
      regions++;
      floodFill(iceProbability, visited, x, y, width, height, threshold);
    }
  }
  return regions;
}

function floodFill(
  ice: Float32Array,
  visited: Uint8Array,
  sx: number,
  sy: number,
  width: number,
  height: number,
  threshold: number,
): void {
  const stack: Point2D[] = [{ x: sx, y: sy }];
  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    const i = y * width + x;
    if (x < 0 || y < 0 || x >= width || y >= height || visited[i] || ice[i] < threshold) continue;
    visited[i] = 1;
    stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
  }
}

export function hazardClassFromScore(score: number): HazardClass {
  if (score < 0.25) return 'safe';
  if (score < 0.5) return 'moderate';
  if (score < 0.75) return 'dangerous';
  return 'extreme';
}

export function hazardClassFromIndex(index: number): HazardClass {
  return (['safe', 'moderate', 'dangerous', 'extreme'] as HazardClass[])[index] ?? 'safe';
}
