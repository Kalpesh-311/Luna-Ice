"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, type MissionSummary } from "@/lib/api";
import {
  Snowflake,
  ZoomIn,
} from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";

export default function IcePage() {
  const { data: mission, isLoading } = useQuery<MissionSummary>({
    queryKey: ["mission-summary"],
    queryFn: api.getMissionSummary,
  });

  const [opacity, setOpacity] = useState(0.8);
  const [showHeatmap, setShowHeatmap] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full pb-6 space-y-5"
    >
      <div className="glass-card p-4 flex items-center justify-between rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl">
            <Snowflake className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lunar Ice Detection</h1>
            <p className="text-gray-400 text-sm">OHRC & DFSAR Data Fusion</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Dataset
            </p>
            <p className="text-sm font-mono text-cyan-400">Chandrayaan-2</p>
          </div>
          <div className="h-8 w-[1px] bg-blue-500/30" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3 space-y-5">
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Ice Detection Stats
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Max Probability</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {mission ? `${Math.round(mission.ice_probability * 100)}%` : "85%"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Avg Probability</p>
                <p className="text-xl font-bold text-blue-400">62%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Est. Ice Volume</p>
                <p className="text-xl font-bold text-purple-400">18.7 Mm³</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Rich Region</p>
                <p className="text-sm font-mono text-green-400">
                  Shackleton Crater
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-gray-400 mb-3">
              Layer Controls
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Heatmap Opacity</span>
                  <span className="text-cyan-400">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-gray-400 mb-3">
              Mission Recommendation
            </h3>
            <p className="text-xs text-gray-300 mb-2">
              High ice concentration detected in target region. Recommended for landing candidate evaluation.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 text-xs font-semibold">
                PRIORITY TARGET
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-6 space-y-5">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-cyan-400" />
                Ice Probability Analysis
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition text-xs font-semibold"
                >
                  {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* First image: Subsurface Ice Probability (CPR) Maps */}
              <div className="relative rounded-lg overflow-hidden border border-blue-500/30">
                <div className="absolute top-2 left-2 z-10 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-semibold">
                  DFSAR CPR Product
                </div>
                <ImageViewer
                  src="/images/Subsurface Ice Probability (CPR) Maps.png"
                  alt="Subsurface Ice Probability (CPR) Maps"
                  title="Subsurface Ice Probability (CPR) Maps"
                  trigger={
                    <img
                      src="/images/Subsurface Ice Probability (CPR) Maps.png"
                      alt="Subsurface Ice Probability (CPR) Maps"
                      className="w-full h-[300px] object-cover"
                    />
                  }
                />
              </div>
              
              {/* Second image: AI Generated Ice Probability */}
              <div className="relative rounded-lg overflow-hidden border border-blue-500/30">
                <div className="absolute top-2 left-2 z-10 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                  AI Generated Ice Probability
                </div>
                <ImageViewer
                  src="/images/ice_probability_preview.png"
                  alt="AI Generated Ice Probability"
                  title="AI Generated Ice Probability"
                  trigger={
                    <img
                      src="/images/ice_probability_preview.png"
                      alt="AI Generated Ice Probability"
                      className="w-full h-[300px] object-cover"
                    />
                  }
                />
              </div>
            </div>
            
            {/* Ice legend overlay */}
            <div className="mt-4 glass-card p-3 rounded-lg">
              <h4 className="text-xs font-semibold text-white mb-2">
                Ice Probability
              </h4>
              <div className="space-y-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-900"></div>
                  <span className="text-[10px] text-gray-300">0-25% (Low)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <span className="text-[10px] text-gray-300">25-50% (Moderate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-500"></div>
                  <span className="text-[10px] text-gray-300">50-75% (High)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-300"></div>
                  <span className="text-[10px] text-gray-300">75-100% (Very High)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Detection Statistics
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>High Confidence</span>
                  <span className="text-green-400 font-semibold">68%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "68%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Medium Confidence</span>
                  <span className="text-yellow-400 font-semibold">22%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "22%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Low Confidence</span>
                  <span className="text-red-400 font-semibold">10%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-gray-400 mb-3">
              Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-blue-900"></div>
                <span className="text-gray-300">0-25% (Low)</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                <span className="text-gray-300">25-50% (Moderate)</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-cyan-500"></div>
                <span className="text-gray-300">50-75% (High)</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded bg-cyan-300"></div>
                <span className="text-gray-300">75-100% (Very High)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
