"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  api,
  type MissionSummary,
  type LandingSite,
} from "@/lib/api";
import {
  Activity,
  Snowflake,
  Zap,
  Satellite,
  Target,
  Signal,
  Mountain,
  Compass,
  X,
  Plus,
  AlertCircle,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";



export default function DashboardPage() {
  const [layers, setLayers] = useState({
    terrain: true,
    slope: true,
    iceProbability: true,
    hazard: true,
    landingSites: true,
    roverRoute: true,
    craters: true,
    boulders: true,
  });

  const [compassRotation, setCompassRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dashboardLayers, setDashboardLayers] = useState({
    missionStats: true,
    hazardZones: true,
    landingSites: true,
    roverPath: true,
    iceProbability: true,
    craters: true,
    boulders: true,
    temperature: true,
    elevation: true,
  });

  const toggleDashboardLayer = (layer: keyof typeof dashboardLayers) => {
    setDashboardLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };


  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleCompassClick = () => {
    setCompassRotation((prev) => prev + 45);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const { data: mission, isLoading: loadingMission } =
    useQuery<MissionSummary>({
      queryKey: ["mission-summary"],
      queryFn: api.getMissionSummary,
    });
  const { data: landingSites, isLoading: loadingLandingSites } =
    useQuery<LandingSite[]>({
      queryKey: ["landing-sites"],
      queryFn: api.getLandingSites,
    });

  if (loadingMission) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-r-4 border-cyan-400 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (!mission) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full pb-6 space-y-5"
    >
      {/* Top Header Bar */}
      <div className="glass-card p-4 flex items-center justify-between rounded-xl">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <Satellite className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                LUNA-ICE
              </h1>
              <p className="text-xs text-gray-500">
                AI-Powered Lunar Mission Intelligence
              </p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-blue-500/30"></div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Mission Status
              </p>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 font-bold text-lg">ACTIVE</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Current Region
              </p>
              <p className="text-white font-bold text-lg">South Polar Region</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Dataset
              </p>
              <p className="text-white font-bold text-lg">Chandrayaan-2</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                System Health
              </p>
              <p className="text-white font-bold text-lg">99.8%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-lg font-mono text-cyan-400 font-semibold">
              {new Date().toLocaleTimeString("en-US", {
                timeZone: "UTC",
                hour12: false,
              })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-bold">
            AI
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Col (Map & Top Stats) */}
        <div className="col-span-9 space-y-5">
          {/* Top Stats Row */}
          <div className="grid grid-cols-6 gap-4">
            {/* Mission Readiness */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Mission Readiness
                </span>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#10B981"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="transparent"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: mission.mission_score }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {Math.round(mission.mission_score * 100)}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">Excellent</p>
                </div>
              </div>
            </div>

            {/* Landing Score */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Landing Score
                </span>
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-blue-400">
                  {(mission.landing_score * 100).toFixed(1)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">/100</p>
                  <p className="text-green-400 text-xs">High Probability</p>
                </div>
              </div>
            </div>

            {/* Ice Probability */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Ice Probability
                </span>
                <Snowflake className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-cyan-400">
                  {(mission.ice_probability * 100).toFixed(1)}%
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 text-xs">High</p>
                </div>
              </div>
            </div>

            {/* Hazard Level */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Hazard Level
                </span>
                <AlertCircle className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-orange-400">
                  LOW
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-xs">Safe for Landing</p>
                </div>
              </div>
            </div>

            {/* Craters Detected */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Craters Detected
                </span>
                <Mountain className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-purple-400">
                  {mission.crater_count}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Total</p>
                </div>
              </div>
            </div>

            {/* Boulders Detected */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Boulders Detected
                </span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-yellow-400">
                  {mission.boulder_count}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="glass-card p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  DASHBOARD OVERVIEW
                </h2>
                <p className="text-xs text-gray-500">
                  Full Dashboard Visualization
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {/* Layer Controls */}
              <div className="col-span-2 space-y-3">
                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Layer Controls
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { name: "Mission Stats", key: "missionStats" },
                      { name: "Hazard Zones", key: "hazardZones" },
                      { name: "Landing Sites", key: "landingSites" },
                      { name: "Rover Path", key: "roverPath" },
                      { name: "Ice Probability", key: "iceProbability" },
                      { name: "Craters", key: "craters" },
                      { name: "Boulders", key: "boulders" },
                      { name: "Temperature", key: "temperature" },
                      { name: "Elevation", key: "elevation" },
                    ].map((layer) => (
                      <div
                        key={layer.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-300">{layer.name}</span>
                        <button
                          onClick={() => toggleDashboardLayer(layer.key as keyof typeof dashboardLayers)}
                          className={`w-10 h-5 rounded-full relative ${
                            dashboardLayers[layer.key as keyof typeof dashboardLayers] ? "bg-blue-600" : "bg-gray-700"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                              dashboardLayers[layer.key as keyof typeof dashboardLayers] ? "right-1" : "left-1"
                            }`}
                          ></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                    Legend
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-gray-300">Safe Zone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-gray-300">Moderate Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-gray-300">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-gray-300">Extreme Risk</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded bg-cyan-500"></div>
                      <span className="text-gray-300">Ice Deposits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-500"></div>
                      <span className="text-gray-300">Craters</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Image */}
              <div className="col-span-10 rounded-lg overflow-hidden relative border border-blue-500/20 bg-slate-900/50 h-[500px]">
                <img
                  src="/images/dashboard.png"
                  alt="LUNA-ICE Dashboard Overview"
                  className="w-full h-full object-contain rounded-lg"
                />
                
                {/* Interactive Overlays */}
                {dashboardLayers.missionStats && (
                  <div className="absolute top-4 left-4 glass-card p-3 rounded-lg text-xs space-y-1">
                    <div className="text-gray-400">Mission Readiness</div>
                    <div className="text-green-400 font-semibold">98%</div>
                  </div>
                )}

                {dashboardLayers.hazardZones && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="20" cy="30" r="5" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="0.5" />
                    <circle cx="70" cy="20" r="8" fill="rgba(245,158,11,0.3)" stroke="#f59e0b" strokeWidth="0.5" />
                    <circle cx="50" cy="70" r="6" fill="rgba(234,179,8,0.3)" stroke="#eab308" strokeWidth="0.5" />
                    <circle cx="85" cy="80" r="4" fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="0.5" />
                  </svg>
                )}

                {dashboardLayers.landingSites && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="30" cy="40" r="1.5" fill="#10b981" />
                    <circle cx="60" cy="50" r="1.5" fill="#3b82f6" />
                    <circle cx="80" cy="30" r="1.5" fill="#10b981" />
                  </svg>
                )}

                {dashboardLayers.roverPath && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M30,40 Q45,30 60,50 T80,30" stroke="#10b981" strokeWidth="0.8" strokeDasharray="4,2" fill="none" />
                  </svg>
                )}

                {dashboardLayers.iceProbability && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="40" cy="25" r="3" fill="rgba(6,182,212,0.4)" stroke="#06b6d4" strokeWidth="0.3" />
                    <circle cx="75" cy="60" r="4" fill="rgba(6,182,212,0.4)" stroke="#06b6d4" strokeWidth="0.3" />
                    <circle cx="25" cy="70" r="2.5" fill="rgba(6,182,212,0.4)" stroke="#06b6d4" strokeWidth="0.3" />
                    <circle cx="55" cy="80" r="3.5" fill="rgba(6,182,212,0.4)" stroke="#06b6d4" strokeWidth="0.3" />
                  </svg>
                )}

                {dashboardLayers.craters && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="35" cy="35" r="2.5" fill="none" stroke="#a855f7" strokeWidth="0.4" />
                    <circle cx="70" cy="25" r="3" fill="none" stroke="#a855f7" strokeWidth="0.4" />
                    <circle cx="20" cy="55" r="2" fill="none" stroke="#a855f7" strokeWidth="0.4" />
                    <circle cx="65" cy="70" r="2.8" fill="none" stroke="#a855f7" strokeWidth="0.4" />
                    <circle cx="45" cy="60" r="1.8" fill="none" stroke="#a855f7" strokeWidth="0.4" />
                  </svg>
                )}

                {dashboardLayers.boulders && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="42" cy="28" r="0.6" fill="#f97316" />
                    <circle cx="58" cy="42" r="0.7" fill="#f97316" />
                    <circle cx="62" cy="18" r="0.5" fill="#f97316" />
                    <circle cx="28" cy="52" r="0.6" fill="#f97316" />
                    <circle cx="75" cy="65" r="0.5" fill="#f97316" />
                    <circle cx="38" cy="75" r="0.55" fill="#f97316" />
                  </svg>
                )}

                {dashboardLayers.temperature && (
                  <div className="absolute top-4 right-4 glass-card p-3 rounded-lg text-xs space-y-1">
                    <div className="text-gray-400">Surface Temp</div>
                    <div className="text-orange-400 font-semibold">-173°C to 127°C</div>
                  </div>
                )}

                {dashboardLayers.elevation && (
                  <div className="absolute bottom-4 right-4 glass-card p-3 rounded-lg text-xs space-y-1">
                    <div className="text-gray-400">Elevation Range</div>
                    <div className="text-blue-400 font-semibold">-6 km to +8 km</div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => {
                      const img = document.createElement('img');
                      img.src = '/images/dashboard.png';
                      img.style.maxWidth = '90vw';
                      img.style.maxHeight = '90vh';
                      img.style.position = 'fixed';
                      img.style.top = '50%';
                      img.style.left = '50%';
                      img.style.transform = 'translate(-50%, -50%)';
                      img.style.zIndex = '9999';
                      img.style.background = 'rgba(0,0,0,0.95)';
                      img.style.padding = '20px';
                      img.style.borderRadius = '12px';
                      img.style.cursor = 'pointer';
                      img.onclick = () => img.remove();
                      document.body.appendChild(img);
                    }}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 font-semibold"
                  >
                    View Full Size
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row of Map Area */}
          <div className="grid grid-cols-4 gap-4">
            {/* Hazard Distribution Donut */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                HAZARD DISTRIBUTION
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Safe (Green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(16,185,129,1)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${81 * 2.512} 1000`}
                      strokeLinecap="round"
                    />
                    {/* Moderate (Yellow) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(234,179,8,1)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="30.4 1000"
                      strokeDashoffset={`-${81 * 2.512}`}
                    />
                    {/* High (Orange) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(245,158,11,1)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="10.8 1000"
                      strokeDashoffset={`-${81 * 2.512 + 30.4}`}
                    />
                    {/* Extreme (Red) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(239,68,68,1)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="6.5 1000"
                      strokeDashoffset={`-${81 * 2.512 + 30.4 + 10.8}`}
                    />
                  </svg>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">Safe: {mission.safe_area_percent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">Moderate: 12.1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-300">High: 4.3%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-300">Extreme: 2.6%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevation Profile Chart */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                ELEVATION PROFILE
              </h3>
              <div className="h-28 relative">
                <svg className="w-full h-full" viewBox="0 0 120 55">
                  <defs>
                    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="0,40 10,30 20,45 30,35 40,12 50,25 60,8 70,22 80,32 90,18 100,40 110,30 120,42"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    fill="url(#elevGrad)"
                  />
                  {/* Landing site marker */}
                  <circle cx="60" cy="8" r="4" fill="#10B981" />
                  <text x="60" y="5" textAnchor="middle" fill="#10B981" fontSize="6" fontWeight="bold">
                    LS1
                  </text>
                </svg>
                <div className="absolute bottom-0 left-0 right-0 text-[8px] text-gray-400 flex justify-between px-2">
                  <span>-2000</span>
                  <span>0</span>
                  <span>1000</span>
                </div>
                <div className="absolute bottom-[-14px] left-0 right-0 text-[8px] text-gray-400 flex justify-between px-2">
                  <span>0</span>
                  <span>25</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>

            {/* Slope Gauge */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                SLOPE ANALYSIS
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-18">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    {/* Background arc */}
                    <path
                      d="M 10,45 A 40,40 0 0,1 90,45"
                      fill="none"
                      stroke="rgba(59,130,246,0.2)"
                      strokeWidth="10"
                    />
                    {/* Active arc */}
                    <motion.path
                      d="M 10,45 A 40,40 0 0,1 50,8"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {mission.average_slope}°
                    </p>
                    <p className="text-xs text-gray-500">Average Slope</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Landing Site */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                BEST #1 LANDING SITE
              </h3>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg overflow-hidden border border-blue-500/30">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/terrain-preview`}
                    alt="Landing Site"
                    className="w-full h-16 object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lat / Lon</span>
                    <span className="text-white font-mono">-89.23°, 45.32°</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Landing Score</span>
                    <span className="text-green-400 font-semibold">94.7/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Hazard Level</span>
                    <span className="text-green-400 font-semibold">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Ice Prob.</span>
                    <span className="text-cyan-400 font-semibold">87.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (System Telemetry & Timeline) */}
        <div className="col-span-3 space-y-5">
          {/* Telemetry Cards */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                SYSTEM TELEMETRY
              </h3>
              <span className="text-xs text-yellow-400 flex items-center gap-1">
                <Signal className="w-3 h-3" />
                LIVE
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: "CPU Usage", value: "45%", color: "text-yellow-400" },
                { label: "GPU Usage", value: "62%", color: "text-blue-400" },
                { label: "RAM Usage", value: "4.2 GB", color: "text-purple-400" },
                { label: "Prediction Time", value: "1.23s", color: "text-orange-400" },
                { label: "Model Memory", value: "512 MB", color: "text-cyan-400" },
                { label: "Data Throughput", value: "2.4 MB/s", color: "text-green-400" },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-purple-500" : i === 3 ? "bg-orange-500" : i ===4 ? "bg-cyan-500" : "bg-green-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${40 + i * 10}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Timeline */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                MISSION TIMELINE
              </h3>
              <button className="text-xs text-blue-400 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Dataset Loaded",
                  time: "10:30 AM",
                  status: "done",
                },
                {
                  label: "Terrain Generated",
                  time: "10:32 AM",
                  status: "done",
                },
                {
                  label: "Slope Calculated",
                  time: "10:34 AM",
                  status: "done",
                },
                {
                  label: "Ice Probability Detected",
                  time: "10:36 AM",
                  status: "done",
                },
                {
                  label: "Landing Sites Ranked",
                  time: "10:38 AM",
                  status: "done",
                },
                {
                  label: "Rover Planned",
                  time: "10:40 AM",
                  status: "active",
                },
                {
                  label: "Mission Complete",
                  time: "Pending",
                  status: "pending",
                },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.status === "done"
                        ? "bg-green-500"
                        : event.status === "active"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-600"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        event.status === "done"
                          ? "text-gray-300"
                          : event.status === "active"
                          ? "text-blue-300"
                          : "text-gray-500"
                      }`}
                    >
                      {event.label}
                    </p>
                    <p className="text-[10px] text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status at bottom */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
              System Online
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Backend</span>
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Model</span>
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Loaded
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">API Status</span>
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
