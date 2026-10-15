
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { getPreviewUrl, getDownloadUrl } from "@/lib/api";
import { ImageViewer } from "@/components/ImageViewer";

export default function HazardPage() {
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [showZones, setShowZones] = useState(true);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Hazard Analysis</h1>
            <p className="text-gray-400">Crater, boulder, and terrain hazard detection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Hazard Detection</h3>
                <button
                  onClick={() => setShowZones(!showZones)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                >
                  {showZones ? "Hide Zones" : "Show Zones"}
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* First image: AI-Based Lunar Crater Detection Results */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-sm text-gray-300">Detected Craters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-sm text-gray-300">Detected Boulders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded border-2 border-cyan-400"></div>
                      <span className="text-sm text-gray-300">Bounding Boxes</span>
                    </div>
                  </div>
                  <div className="relative w-full aspect-square">
                    <ImageViewer
                      src="/images/AI-Based Lunar Crater Detection Results.png"
                      alt="AI-Based Lunar Crater Detection Results"
                      title="AI-Based Lunar Crater Detection Results"
                      trigger={
                        <img
                          src="/images/AI-Based Lunar Crater Detection Results.png"
                          alt="AI-Based Lunar Crater Detection Results"
                          className="w-full h-full object-contain rounded-xl"
                          onLoad={() => setPreviewLoaded(true)}
                          style={{ opacity: previewLoaded ? 1 : 0.3, transition: "opacity 0.3s" }}
                        />
                      }
                    />
                    {!previewLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Second image: Generated Hazard Map */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Generated Hazard Map</h4>
                  <div className="relative w-full aspect-square">
                    <ImageViewer
                      src="/images/hazard_preview.png"
                      alt="Generated Hazard Map"
                      title="Generated Hazard Map"
                      trigger={
                        <div className="relative w-full">
                          <img
                            src="/images/hazard_preview.png"
                            alt="Generated Hazard Map"
                            className="w-full h-full object-contain rounded-xl"
                          />
                          {/* Hazard zones overlay (conditional) */}
                          {showZones && (
                            <svg
                              className="absolute inset-0 w-full h-full object-contain"
                              viewBox="0 0 224 224"
                            >
                              {/* Safe Areas */}
                              <circle cx="40" cy="40" r="40" fill="rgba(34, 197, 94, 0.4)" />
                              <circle cx="180" cy="40" r="35" fill="rgba(34, 197, 94, 0.4)" />
                              <circle cx="180" cy="180" r="45" fill="rgba(34, 197, 94, 0.4)" />
                              
                              {/* Moderate Hazard */}
                              <ellipse cx="100" cy="80" rx="40" ry="30" fill="rgba(234, 179, 8, 0.4)" />
                              <ellipse cx="30" cy="130" rx="25" ry="20" fill="rgba(234, 179, 8, 0.4)" />
                              
                              {/* High Hazard */}
                              <circle cx="150" cy="150" r="30" fill="rgba(249, 115, 22, 0.4)" />
                              
                              {/* Extreme Hazard */}
                              <circle cx="80" cy="170" r="20" fill="rgba(239, 68, 68, 0.4)" />
                            </svg>
                          )}
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => window.open(getDownloadUrl("hazard"), "_blank")}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Original TIFF
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hazard Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Hazard Area</span>
                  <span className="text-orange-400 font-semibold">14%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High Risk Zones</span>
                  <span className="text-red-400 font-semibold">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Craters Detected</span>
                  <span className="text-orange-400 font-semibold">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Boulders Detected</span>
                  <span className="text-yellow-400 font-semibold">189</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hazard Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-gray-300">Safe Area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-gray-300">Moderate Hazard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <span className="text-gray-300">High Hazard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-gray-300">Extreme Hazard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
