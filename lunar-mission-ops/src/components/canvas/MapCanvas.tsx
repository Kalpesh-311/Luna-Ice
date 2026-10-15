import { useCallback, useEffect, useRef, useState } from 'react';
import { hazardClassFromIndex, useMissionStore } from '../../store/missionStore';
import {
  drawMarker,
  drawPath,
  hazardScoreColor,
  iceProbabilityColor,
  landingSuitabilityColor,
  renderFloatOverlay,
  renderHazardOverlay,
  traversabilityColor,
} from '../../lib/layerRenderer';
import { distanceBetween, imageDataToCanvas, pixelToGeo } from '../../lib/imageUtils';
import type { Point2D } from '../../types/mission';

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; lon: number; lat: number } | null>(null);

  const analysis = useMissionStore((s) => s.analysis);
  const layers = useMissionStore((s) => s.layers);
  const metadata = useMissionStore((s) => s.metadata);
  const measurementMode = useMissionStore((s) => s.measurementMode);
  const measureStart = useMissionStore((s) => s.measureStart);
  const measurements = useMissionStore((s) => s.measurements);
  const setSelection = useMissionStore((s) => s.setSelection);
  const setMeasureStart = useMissionStore((s) => s.setMeasureStart);
  const addMeasurement = useMissionStore((s) => s.addMeasurement);

  const imageWidth = analysis.originalImage?.width ?? 0;
  const imageHeight = analysis.originalImage?.height ?? 0;

  const screenToImage = useCallback(
    (sx: number, sy: number): Point2D | null => {
      if (!imageWidth) return null;
      const ix = (sx - pan.x) / zoom;
      const iy = (sy - pan.y) / zoom;
      if (ix < 0 || iy < 0 || ix >= imageWidth || iy >= imageHeight) return null;
      return { x: Math.floor(ix), y: Math.floor(iy) };
    },
    [pan, zoom, imageWidth, imageHeight],
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw;
    canvas.height = ch;

    ctx.fillStyle = '#1a1c1e';
    ctx.fillRect(0, 0, cw, ch);

    if (!analysis.originalImage) {
      ctx.fillStyle = '#5a6068';
      ctx.font = '13px "IBM Plex Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No OHRC imagery loaded', cw / 2, ch / 2 - 8);
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#3e444c';
      ctx.fillText('Use Import Data to ingest Chandrayaan-2 OHRC imagery', cw / 2, ch / 2 + 14);
      return;
    }

    const baseCanvas = imageDataToCanvas(analysis.originalImage);
    ctx.imageSmoothingEnabled = false;

    const layerVisible = (id: string) => {
      const l = layers.find((x) => x.id === id);
      return l?.visible && l.available;
    };
    const layerOpacity = (id: string) => layers.find((x) => x.id === id)?.opacity ?? 1;

    if (layerVisible('ohrc')) {
      ctx.globalAlpha = layerOpacity('ohrc');
      ctx.drawImage(baseCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
    }

    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = imageWidth;
    overlayCanvas.height = imageHeight;
    const octx = overlayCanvas.getContext('2d')!;

    if (layerVisible('enhanced') && analysis.enhancedImage) {
      const enh = imageDataToCanvas(analysis.enhancedImage);
      ctx.globalAlpha = layerOpacity('enhanced');
      ctx.drawImage(enh, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
    }

    if (layerVisible('hazard') && analysis.hazardClass) {
      renderHazardOverlay(octx, analysis.hazardClass, imageWidth, imageHeight, 1);
      ctx.globalAlpha = layerOpacity('hazard');
      ctx.drawImage(overlayCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
      octx.clearRect(0, 0, imageWidth, imageHeight);
    }

    if (layerVisible('hazard_score') && analysis.hazardScore) {
      renderFloatOverlay(octx, analysis.hazardScore, imageWidth, imageHeight, 1, hazardScoreColor);
      ctx.globalAlpha = layerOpacity('hazard_score');
      ctx.drawImage(overlayCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
      octx.clearRect(0, 0, imageWidth, imageHeight);
    }

    if (layerVisible('ice') && analysis.iceProbability) {
      renderFloatOverlay(octx, analysis.iceProbability, imageWidth, imageHeight, 1, iceProbabilityColor);
      ctx.globalAlpha = layerOpacity('ice');
      ctx.drawImage(overlayCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
      octx.clearRect(0, 0, imageWidth, imageHeight);
    }

    if (layerVisible('landing') && analysis.landingSuitability) {
      renderFloatOverlay(octx, analysis.landingSuitability, imageWidth, imageHeight, 1, landingSuitabilityColor);
      ctx.globalAlpha = layerOpacity('landing');
      ctx.drawImage(overlayCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
      octx.clearRect(0, 0, imageWidth, imageHeight);
    }

    if (layerVisible('traversability') && analysis.traversability) {
      renderFloatOverlay(octx, analysis.traversability, imageWidth, imageHeight, 1, traversabilityColor);
      ctx.globalAlpha = layerOpacity('traversability');
      ctx.drawImage(overlayCanvas, pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
      ctx.globalAlpha = 1;
    }

    if (layerVisible('traverse') && analysis.roverPath) {
      drawPath(ctx, analysis.roverPath, zoom, pan.x, pan.y);
    }

    if (analysis.landingSite) {
      drawMarker(
        ctx,
        analysis.landingSite.x * zoom + pan.x,
        analysis.landingSite.y * zoom + pan.y,
        '#6ab86a',
        'LS',
      );
    }

    if (analysis.iceTarget) {
      drawMarker(
        ctx,
        analysis.iceTarget.x * zoom + pan.x,
        analysis.iceTarget.y * zoom + pan.y,
        '#6898c8',
        'ICE',
      );
    }

    ctx.strokeStyle = '#3a4048';
    ctx.lineWidth = 1;
    for (const m of measurements) {
      const x1 = m.start.x * zoom + pan.x;
      const y1 = m.start.y * zoom + pan.y;
      const x2 = m.end.x * zoom + pan.x;
      const y2 = m.end.y * zoom + pan.y;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#c8a840';
      ctx.stroke();
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#c8a840';
      ctx.fillText(`${m.distanceMeters.toFixed(1)}m`, (x1 + x2) / 2 + 4, (y1 + y2) / 2 - 4);
    }

    if (measureStart) {
      ctx.strokeStyle = '#c8a840';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(measureStart.x * zoom + pan.x, measureStart.y * zoom + pan.y, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#2e3438';
    ctx.strokeRect(pan.x, pan.y, imageWidth * zoom, imageHeight * zoom);
  }, [analysis, layers, pan, zoom, measurements, measureStart, imageWidth, imageHeight]);

  useEffect(() => {
    render();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(render);
    ro.observe(container);
    return () => ro.disconnect();
  }, [render]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setPan((p) => ({
      x: mx - (mx - p.x) * factor,
      y: my - (my - p.y) * factor,
    }));
    setZoom((z) => Math.min(20, Math.max(0.2, z * factor)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    if (e.button !== 0) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const img = screenToImage(e.clientX - rect.left, e.clientY - rect.top);
    if (!img || !metadata) return;

    if (measurementMode) {
      if (!measureStart) {
        setMeasureStart(img);
      } else {
        const res = metadata.resolutionMetersPerPixel;
        addMeasurement({
          start: measureStart,
          end: img,
          distancePixels: distanceBetween(measureStart, img),
          distanceMeters: distanceBetween(measureStart, img) * res,
        });
      }
      return;
    }

    const geo = pixelToGeo(img.x, img.y, imageWidth, imageHeight, metadata.bounds);
    const idx = img.y * imageWidth + img.x;

    setSelection({
      type: 'coordinate',
      x: img.x,
      y: img.y,
      lon: geo.lon,
      lat: geo.lat,
      hazardClass: analysis.hazardClass ? hazardClassFromIndex(analysis.hazardClass[idx]) : undefined,
      hazardScore: analysis.hazardScore?.[idx],
      iceProbability: analysis.iceProbability?.[idx],
      landingScore: analysis.landingSuitability?.[idx],
      traversability: analysis.traversability?.[idx],
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    const img = screenToImage(e.clientX - rect.left, e.clientY - rect.top);
    if (img && metadata) {
      const geo = pixelToGeo(img.x, img.y, imageWidth, imageHeight, metadata.bounds);
      setCursorPos({ x: img.x, y: img.y, lon: geo.lon, lat: geo.lat });
    } else {
      setCursorPos(null);
    }
  };

  const fitToView = () => {
    const container = containerRef.current;
    if (!container || !imageWidth) return;
    const scale = Math.min(container.clientWidth / imageWidth, container.clientHeight / imageHeight) * 0.92;
    setZoom(scale);
    setPan({
      x: (container.clientWidth - imageWidth * scale) / 2,
      y: (container.clientHeight - imageHeight * scale) / 2,
    });
  };

  useEffect(() => {
    if (imageWidth) fitToView();
  }, [imageWidth, imageHeight]);

  return (
    <div className="map-container" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className={`map-canvas ${measurementMode ? 'measuring' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => {
          setDragging(false);
          setCursorPos(null);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setDragging(true);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }}
      />
      <div className="map-hud">
        <div className="hud-row">
          <span>ZOOM {zoom.toFixed(2)}×</span>
          <button type="button" className="hud-btn" onClick={fitToView}>
            FIT
          </button>
          <button type="button" className="hud-btn" onClick={() => setZoom((z) => Math.min(20, z * 1.25))}>
            +
          </button>
          <button type="button" className="hud-btn" onClick={() => setZoom((z) => Math.max(0.2, z * 0.8))}>
            −
          </button>
        </div>
        {cursorPos && (
          <div className="hud-row hud-coords">
            <span>
              PX [{cursorPos.x}, {cursorPos.y}]
            </span>
            <span>
              {cursorPos.lon.toFixed(4)}°E {cursorPos.lat.toFixed(4)}°N
            </span>
          </div>
        )}
        {imageWidth > 0 && (
          <div className="hud-row hud-dims">
            {imageWidth}×{imageHeight} px
          </div>
        )}
      </div>
    </div>
  );
}
