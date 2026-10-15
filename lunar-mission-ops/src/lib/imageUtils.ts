import type { ImageMetadata, ImageStatistics, Point2D } from '../types/mission';

const SOUTH_POLE_LAT = -89.0;
const SOUTH_POLE_LON = 0.0;
const DEFAULT_RESOLUTION = 0.25;

export function pixelToGeo(
  x: number,
  y: number,
  width: number,
  height: number,
  bounds = defaultBounds(width, height),
): { lon: number; lat: number } {
  const lon = bounds.minLon + (x / width) * (bounds.maxLon - bounds.minLon);
  const lat = bounds.maxLat - (y / height) * (bounds.maxLat - bounds.minLat);
  return { lon, lat };
}

export function defaultBounds(width: number, height: number) {
  const span = (Math.max(width, height) * DEFAULT_RESOLUTION) / 111320;
  return {
    minLon: SOUTH_POLE_LON - span,
    maxLon: SOUTH_POLE_LON + span,
    minLat: SOUTH_POLE_LAT - span * 0.5,
    maxLat: SOUTH_POLE_LAT + span * 0.5,
  };
}

export function loadImageFromFile(file: File): Promise<{
  imageData: ImageData;
  metadata: ImageMetadata;
  statistics: ImageStatistics;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const stats = computeImageStatistics(imageData);
        const bounds = defaultBounds(width, height);

        resolve({
          imageData,
          metadata: {
            filename: file.name,
            width,
            height,
            uploadedAt: new Date().toISOString(),
            sensor: 'Chandrayaan-2 OHRC',
            resolutionMetersPerPixel: DEFAULT_RESOLUTION,
            coordinateSystem: 'Lunar South Polar Stereographic (approx.)',
            bounds,
          },
          statistics: stats,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function computeImageStatistics(imageData: ImageData): ImageStatistics {
  const { data, width, height } = imageData;
  let sum = 0;
  let sumSq = 0;
  let min = 255;
  let max = 0;
  const pixelCount = width * height;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += gray;
    sumSq += gray * gray;
    min = Math.min(min, gray);
    max = Math.max(max, gray);
  }

  const mean = sum / pixelCount;
  const variance = sumSq / pixelCount - mean * mean;

  return {
    meanBrightness: mean,
    stdBrightness: Math.sqrt(Math.max(0, variance)),
    minBrightness: min,
    maxBrightness: max,
    dynamicRange: max - min,
    pixelCount,
  };
}

export function enhanceImage(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const out = output.data;

  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    min = Math.min(min, g);
    max = Math.max(max, g);
  }

  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const stretched = ((g - min) / range) * 255;
    const sharpened = Math.min(255, Math.max(0, stretched * 1.08 - 10));
    out[i] = out[i + 1] = out[i + 2] = sharpened;
    out[i + 3] = 255;
  }

  return output;
}

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d')!.putImageData(imageData, 0, 0);
  return canvas;
}

export function distanceBetween(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function formatCoord(value: number, decimals = 4): string {
  return value.toFixed(decimals);
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getGrayscale(data: ImageData, x: number, y: number): number {
  const idx = (y * data.width + x) * 4;
  return 0.299 * data.data[idx] + 0.587 * data.data[idx + 1] + 0.114 * data.data[idx + 2];
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(data: unknown, filename: string): void {
  downloadText(JSON.stringify(data, null, 2), filename);
}
