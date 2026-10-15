
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, type MissionSummary } from "@/lib/api";
import {
  Rocket,
  Target,
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Activity,
  Zap,
  Mountain,
} from "lucide-react";

export default function Home() {
  const [missionSummary, setMissionSummary] = useState<MissionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getMissionSummary();
        setMissionSummary(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (!missionSummary) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-gray-400">Failed to load mission summary</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Mission Score",
      value: `${(missionSummary.mission_score * 100).toFixed(0)}%`,
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      color: "from-blue-600 to-blue-700",
      bg: "bg-blue-500/20",
    },
    {
      title: "Landing Score",
      value: `${(missionSummary.landing_score * 100).toFixed(0)}%`,
      icon: <Target className="w-6 h-6 text-green-400" />,
      color: "from-green-600 to-green-700",
      bg: "bg-green-500/20",
    },
    {
      title: "Ice Probability",
      value: `${(missionSummary.ice_probability * 100).toFixed(0)}%`,
      icon: <ThermometerSnowflake className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-600 to-cyan-700",
      bg: "bg-cyan-500/20",
    },
    {
      title: "Hazard Area",
      value: `${missionSummary.hazard_percent.toFixed(0)}%`,
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      color: "from-orange-600 to-red-700",
      bg: "bg-orange-500/20",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-0 rounded-2xl">
            <img
              src="/images/moon logo.png"
              alt="LUNA-ICE Logo"
              className="w-28 h-28 object-contain rounded-xl animate-spin-slow"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Mission Control</h1>
            <p className="text-gray-400">Lunar Ice Detection & Rover Planning</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              missionSummary.mission_status === "Green"
                ? "bg-green-500/20 text-green-400"
                : missionSummary.mission_status === "Yellow"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}>
              {missionSummary.mission_status}
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.bg} rounded-xl`}>
                  {kpi.icon}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{kpi.title}</p>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Terrain Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Mountain className="w-5 h-5 text-purple-400" />
              Terrain Features
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm">Detected Craters</p>
                <p className="text-3xl font-bold text-orange-400 mt-1">
                  {missionSummary.crater_count}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm">Detected Boulders</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">
                  {missionSummary.boulder_count}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm">Average Slope</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  {missionSummary.average_slope}°
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm">Mission Readiness</p>
                <p className="text-xl font-bold text-green-400 mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {missionSummary.mission_readiness}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Safe/Danger Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Area Classification
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Safe Area</span>
                  <span className="text-green-400 font-semibold">
                    {missionSummary.safe_area_percent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${missionSummary.safe_area_percent}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Danger Area</span>
                  <span className="text-red-400 font-semibold">
                    {missionSummary.danger_area_percent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${missionSummary.danger_area_percent}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Landing Site */}
        {missionSummary.top_landing_site && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              Top Recommended Landing Site
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <p className="text-gray-400 text-sm">Coordinates</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  ({missionSummary.top_landing_site.x}, {missionSummary.top_landing_site.y})
                </p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <p className="text-gray-400 text-sm">Safety</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {(missionSummary.top_landing_site.safety * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <p className="text-gray-400 text-sm">Ice Potential</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">
                  {(missionSummary.top_landing_site.ice_potential * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {(missionSummary.top_landing_site.score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

