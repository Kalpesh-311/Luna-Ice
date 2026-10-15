"use client";

import { motion } from "framer-motion";
import { Settings, Server, Database, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Application configuration and system information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300">Backend API</span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-semibold">Online</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300">Model Status</span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-green-400 font-semibold">Loaded</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-300">Database</span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-green-400 font-semibold">Connected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Data Sources
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Landing Sites CSV</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Ice Probability Map</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Hazard Map</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Terrain Map</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Rover Route</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            About
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-sm">Application</p>
              <p className="text-2xl font-bold text-white mt-1">Lunar Mission Control</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-sm">Version</p>
              <p className="text-2xl font-bold text-white mt-1">1.0.0</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-sm">Project</p>
              <p className="text-2xl font-bold text-white mt-1">Bharat Antariksh Hackathon</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}