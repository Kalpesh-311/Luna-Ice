"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api, type MissionSummary } from "@/lib/api";
import { BarChart3, PieChart, TrendingUp, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const { data: missionSummary, isLoading, error } = useQuery<MissionSummary>({
    queryKey: ["mission-summary-analytics"],
    queryFn: api.getMissionSummary,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error || !missionSummary) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-red-400">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Mission Analytics</h1>
          <p className="text-gray-400">Comprehensive mission performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mission Score Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Mission Score Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Landing Score</span>
                <span className="text-green-400 font-semibold">
                  {(missionSummary.landing_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${missionSummary.landing_score * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Ice Probability</span>
                <span className="text-cyan-400 font-semibold">
                  {(missionSummary.ice_probability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${missionSummary.ice_probability * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Hazard Area</span>
                <span className="text-orange-400 font-semibold">
                  {missionSummary.hazard_percent}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${missionSummary.hazard_percent}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Area Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Area Classification
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-gray-300">Safe Area</span>
              </div>
              <span className="text-green-400 font-semibold">
                {missionSummary.safe_area_percent}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span className="text-gray-300">Moderate Hazard</span>
              </div>
              <span className="text-orange-400 font-semibold">
                {missionSummary.hazard_percent / 2}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-gray-300">High Hazard</span>
              </div>
              <span className="text-red-400 font-semibold">
                {missionSummary.hazard_percent / 2}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terrain Stats */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Terrain & Feature Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <p className="text-gray-400 text-sm">Craters Detected</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {missionSummary.crater_count}
            </p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <p className="text-gray-400 text-sm">Boulders Detected</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">
              {missionSummary.boulder_count}
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-gray-400 text-sm">Average Slope</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {missionSummary.average_slope}°
            </p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-gray-400 text-sm">Mission Status</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {missionSummary.mission_status}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}