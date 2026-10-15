"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import {
  Navigation,
  Play,
  Pause,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";

// Define path points
const pathPoints = [
  { x: 30, y: 20 }, // Start
  { x: 45, y: 40 }, // Control 1
  { x: 55, y: 55 }, // Control 2
  { x: 70, y: 80 }, // Control 3
  { x: 50, y: 90 }, // End
];

// Function to calculate position on quadratic Bézier curve
const getPointOnPath = (t: number) => {
  // Use multi-segment quadratic Bézier
  const n = pathPoints.length - 1;
  const segment = Math.max(0, Math.min(Math.floor(t * n), n - 1));
  const localT = Math.max(0, Math.min((t * n) - segment, 1));

  const p0 = pathPoints[segment];
  const p1 = pathPoints[segment + 1];
  
  // Fallback if points are missing
  if (!p0 || !p1) {
    return { x: 15, y: 75 }; // Return start point
  }
  
  // For smooth transition, use midpoint as control
  const controlX = (p0.x + p1.x) / 2;
  const controlY = (p0.y + p1.y) / 2;

  // Quadratic Bézier formula
  const x = (1 - localT) ** 2 * p0.x + 2 * (1 - localT) * localT * controlX + localT ** 2 * p1.x;
  const y = (1 - localT) ** 2 * p0.y + 2 * (1 - localT) * localT * controlY + localT ** 2 * p1.y;
  
  return { x, y };
};

export default function RoverPage() {
  const { data: roverRoute } = useQuery({
    queryKey: ["rover-route"],
    queryFn: api.getRoverRoute,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [battery, setBattery] = useState(94);
  const [distance, setDistance] = useState(0);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  // Extract path coordinates from GeoJSON
  const pathCoords = roverRoute?.features?.[0]?.geometry?.coordinates || [];
  const totalPathLength = pathCoords.length;

  const animateRover = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    if (isPlaying) {
      const elapsed = (time - startTimeRef.current) * speed * 0.05;
      const newProgress = Math.min(elapsed / 100, 1);
      setProgress(newProgress);
      setDistance(newProgress * 2.4); // 2.4 km total
      setBattery(94 - newProgress * 30); // Battery drain

      if (newProgress < 1) {
        requestRef.current = requestAnimationFrame(animateRover);
      } else {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animateRover);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    if (!isPlaying && progress >= 1) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startTimeRef.current = performance.now() - (progress * 100 / speed);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setDistance(0);
    setBattery(94);
  };

  const currentIndex = Math.min(
    Math.floor(progress * totalPathLength),
    totalPathLength - 1
  );
  const currentPos = pathCoords[currentIndex] || [0, 0];
  const roverPos = getPointOnPath(progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full pb-6 space-y-5"
    >
      <div className="glass-card p-4 flex items-center justify-between rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-600 to-teal-700 rounded-xl">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lunar Rover Mission</h1>
            <p className="text-gray-400 text-sm">Autonomous Path Planning & Navigation</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Mission Time</p>
            <p className="text-lg font-mono text-cyan-400">
              {Math.floor((progress * 3.3) * 60).toString().padStart(2, "0")}:
              {Math.floor(((progress * 3.3) * 60) % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-blue-500/30" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9 space-y-5">
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-semibold text-white">
                  Trajectory Map
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpeed(0.5)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    speed === 0.5 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setSpeed(1)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    speed === 1 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setSpeed(2)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    speed === 2 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  2x
                </button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-slate-900/60 border border-blue-500/30">
              <ImageViewer
                src="/images/Lunar South Pole SAR Coverage Map.png"
                alt="Rover Path Preview"
                title="Rover Path Preview"
                trigger={
                  <div className="relative">
                    <img
                      src="/images/Lunar South Pole SAR Coverage Map.png"
                      alt="Rover Path Preview"
                      className="w-full h-[500px] object-cover"
                    />
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 120"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M 30 20 Q 45 40 55 55 T 70 80 T 50 90"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="50%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>

                      <circle
                        cx="30"
                        cy="20"
                        r="3"
                        fill="#10b981"
                        className="animate-pulse"
                      />
                      <text
                        x="30"
                        y="14"
                        textAnchor="middle"
                        className="fill-green-400 text-[6px] font-mono"
                      >
                        START
                      </text>

                      <circle
                        cx="50"
                        cy="90"
                        r="3"
                        fill="#f59e0b"
                        className="animate-pulse"
                      />
                      <text
                        x="50"
                        y="98"
                        textAnchor="middle"
                        className="fill-yellow-400 text-[6px] font-mono"
                      >
                        TARGET
                      </text>

                      <motion.circle
                        cx={roverPos.x}
                        cy={roverPos.y}
                        r="4"
                        fill="#3b82f6"
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      />
                    </svg>

                    <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Current Position</p>
                      <p className="text-sm text-white font-mono">
                        ({roverPos.x.toFixed(2)}, {roverPos.y.toFixed(2)})
                      </p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Mission Progress</h3>
              <p className="text-xs text-cyan-400 font-mono">{(progress * 100).toFixed(1)}%</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "tween" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold git init-gray-400 uppercase tracking-wider">
                Mission Telemetry
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Distance Traveled</span>
                  <span className="text-blue-400 font-semibold">{distance.toFixed(2)} km</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(distance / 2.4) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Battery Level</span>
                  <span className="text-green-400 font-semibold">{battery.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${battery}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Est. Time Remaining</span>
                  <span className="text-yellow-400 font-semibold">
                    {Math.floor(((1 - progress) * 3.3)).toFixed(1)} hrs
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(1 - progress) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Key Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/60 p-3 rounded-xl border border-blue-500/30">
                <p className="text-gray-400 text-xs mb-1">Path Length</p>
                <p className="text-xl font-bold text-blue-400">2.4 km</p>
              </div>
              <div className="bg-gray-800/60 p-3 rounded-xl border border-green-500/30">
                <p className="text-gray-400 text-xs mb-1">Est. Time</p>
                <p className="text-xl font-bold text-green-400">3.3 hrs</p>
              </div>
              <div className="bg-gray-800/60 p-3 rounded-xl border border-yellow-500/30">
                <p className="text-gray-400 text-xs mb-1">Energy Use</p>
                <p className="text-xl font-bold text-yellow-400">18.5 kWh</p>
              </div>
              <div className="bg-gray-800/60 p-3 rounded-xl border border-purple-500/30">
                <p className="text-gray-400 text-xs mb-1">Terrain Score</p>
                <p className="text-xl font-bold text-purple-400">88/100</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Algorithm Info
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Planner</span>
                <span className="text-cyan-400 font-medium">A*</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Optimization</span>
                <span className="text-blue-400 font-medium">Energy + Safety</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Collision Check</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
