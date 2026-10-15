import type { HazardClass } from '../types/mission';
import { HAZARD_COLORS } from '../types/mission';

export function renderHazardOverlay(
  ctx: CanvasRenderingContext2D,
  hazardClass: Uint8Array,
  width: number,
  height: number,
  opacity: number,
): void {
  const imageData = ctx.createImageData(width, height);
  const d = imageData.data;
  const colors: [number, number, number][] = [
    [61, 122, 74],
    [138, 122, 58],
    [154, 80, 48],
    [138, 32, 32],
  ];

  for (let i = 0; i < hazardClass.length; i++) {
    const c = colors[hazardClass[i]] ?? colors[0];
    const pi = i * 4;
    d[pi] = c[0];
    d[pi + 1] = c[1];
    d[pi + 2] = c[2];
    d[pi + 3] = Math.round(opacity * 255);
  }
  ctx.putImageData(imageData, 0, 0);
}

export function renderFloatOverlay(
  ctx: CanvasRenderingContext2D,
  data: Float32Array,
  width: number,
  height: number,
  opacity: number,
  colorFn: (v: number) => [number, number, number],
): void {
  const imageData = ctx.createImageData(width, height);
  const d = imageData.data;
  for (let i = 0; i < data.length; i++) {
    const [r, g, b] = colorFn(data[i]);
    const pi = i * 4;
    d[pi] = r;
    d[pi + 1] = g;
    d[pi + 2] = b;
    d[pi + 3] = Math.round(opacity * 255);
  }
  ctx.putImageData(imageData, 0, 0);
}

export function hazardScoreColor(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  if (t < 0.25) return [61, 122, 74];
  if (t < 0.5) return [138, 122, 58];
  if (t < 0.75) return [154, 80, 48];
  return [138, 32, 32];
}

export function iceProbabilityColor(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  const r = Math.round(30 + t * 80);
  const g = Math.round(60 + t * 100);
  const b = Math.round(120 + t * 135);
  return [r, g, b];
}

export function landingSuitabilityColor(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  const r = Math.round(180 - t * 100);
  const g = Math.round(100 + t * 80);
  const b = Math.round(60 + t * 40);
  return [r, g, b];
}

export function traversabilityColor(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  const r = Math.round(120 - t * 60);
  const g = Math.round(90 + t * 70);
  const b = Math.round(80 + t * 30);
  return [r, g, b];
}

export function drawPath(
  ctx: CanvasRenderingContext2D,
  path: { x: number; y: number }[],
  scale: number,
  offsetX: number,
  offsetY: number,
): void {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(path[0].x * scale + offsetX, path[0].y * scale + offsetY);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x * scale + offsetX, path[i].y * scale + offsetY);
  }
  ctx.strokeStyle = '#c8a840';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.stroke();

  ctx.fillStyle = '#4a9a5a';
  ctx.beginPath();
  ctx.arc(path[0].x * scale + offsetX, path[0].y * scale + offsetY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#6090c8';
  ctx.beginPath();
  const last = path[path.length - 1];
  ctx.arc(last.x * scale + offsetX, last.y * scale + offsetY, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  label: string,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const s = 8;
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.lineTo(x + s, y);
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
  ctx.stroke();
  ctx.strokeRect(x - s, y - s, s * 2, s * 2);

  ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.fillStyle = color;
  ctx.fillText(label, x + 10, y - 6);
}

export function hazardClassLabel(cls: HazardClass): string {
  return cls.toUpperCase();
}

export function hazardClassColor(cls: HazardClass): string {
  return HAZARD_COLORS[cls];
}
