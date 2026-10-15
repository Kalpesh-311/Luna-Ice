
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mountain, Download } from "lucide-react";
import { getPreviewUrl, getDownloadUrl } from "@/lib/api";
import { ImageViewer } from "@/components/ImageViewer";

type ViewMode = "optical" | "dtm" | "split";

export default function TerrainPage() {
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("optical");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Terrain Analysis</h1>
            <p className="text-gray-400">Lunar surface elevation and slope data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Optical vs DTM</h3>
                <div className="flex gap-2">
                  {[
                    { id: "optical", label: "Optical" },
                    { id: "dtm", label: "DTM" },
                    { id: "split", label: "Split" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as ViewMode)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        viewMode === mode.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative w-full aspect-square">
                <ImageViewer
                  src="/images/Optical Image vs Digital Terrain Model (DTM).png"
                  alt="Optical vs DTM"
                  title="Optical Image vs Digital Terrain Model (DTM)"
                  trigger={
                    <div className="w-full h-full">
                      <img
                        src="/images/Optical Image vs Digital Terrain Model (DTM).png"
                        alt="Optical vs DTM"
                        className="w-full h-full object-contain rounded-xl"
                        onLoad={() => setPreviewLoaded(true)}
                        style={{ opacity: previewLoaded ? 1 : 0.3, transition: "opacity 0.3s" }}
                      />
                      {!previewLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
                        </div>
                      )}
                    </div>
                  }
                />
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => window.open(getDownloadUrl("terrain"), "_blank")}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Original TIFF
                </button>
                <button
                  onClick={() => window.open(getDownloadUrl("slope"), "_blank")}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Slope Map
                </button>
              </div>
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Terrain Preview</h3>
                <ImageViewer
                  src="/images/terrain_preview.png"
                  alt="Terrain Preview"
                  title="Terrain Preview"
                  trigger={
                    <div className="relative w-full aspect-square">
                      <img
                        src="/images/terrain_preview.png"
                        alt="Terrain Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  }
                />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Slope Preview</h3>
                <ImageViewer
                  src="/images/slope_preview.png"
                  alt="Slope Preview"
                  title="Slope Preview"
                  trigger={
                    <div className="relative w-full aspect-square">
                      <img
                        src="/images/slope_preview.png"
                        alt="Slope Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Terrain Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Elevation Range</span>
                  <span className="text-green-400 font-semibold">-1800m to +2500m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Slope</span>
                  <span className="text-blue-400 font-semibold">8.5°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slope Range</span>
                  <span className="text-cyan-400 font-semibold">0° to 45°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ruggedness Index</span>
                  <span className="text-purple-400 font-semibold">0.35</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
