"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { X, ZoomIn, ZoomOut, Move, Download, Maximize2, Minimize2 } from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt: string;
  title: string;
  trigger?: React.ReactNode;
}

export function ImageViewer({ src, alt, title, trigger }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <div className="relative group">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-slate-900 border border-blue-500/30">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Full size image of {title} with zoom and pan controls
          </DialogDescription>
          
          {/* Top Controls */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                <ZoomOut className="w-4 h-4 mr-1" />
                Zoom Out
              </Button>
              <Button
                onClick={() => setZoom(1)}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                Reset
              </Button>
              <Button
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                <ZoomIn className="w-4 h-4 mr-1" />
                Zoom In
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleDownload}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden bg-black"
            style={{ height: "calc(90vh - 100px)" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="w-full h-full flex items-center justify-center transition-transform"
              style={{
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            >
              <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
              />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="flex items-center justify-between p-3 border-t border-blue-500/20 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Move className="w-3 h-3" />
              {zoom > 1 ? "Click & drag to pan" : "Zoom in to pan"}
            </div>
            <div>Zoom: {Math.round(zoom * 100)}%</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
