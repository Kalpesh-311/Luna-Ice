"use client";

import { motion } from "framer-motion";
import { Map, Calendar, Clock, Zap } from "lucide-react";

export default function PlanningPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl">
          <Map className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Mission Planning</h1>
          <p className="text-gray-400">Plan your lunar exploration mission</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm">Mission Duration</p>
          <p className="text-2xl font-bold text-white mt-1">14 Days</p>
        </div>
        <div className="glass-card p-6">
          <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm">Travel Time</p>
          <p className="text-2xl font-bold text-white mt-1">3.3 Hours</p>
        </div>
        <div className="glass-card p-6">
          <div className="p-3 bg-yellow-500/20 rounded-xl w-fit mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-sm">Energy Required</p>
          <p className="text-2xl font-bold text-white mt-1">18.5 kWh</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Mission Timeline</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-2 rounded bg-blue-500"></div>
            <div>
              <h4 className="font-medium text-white">Landing</h4>
              <p className="text-sm text-gray-400">Day 1</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 rounded bg-green-500"></div>
            <div>
              <h4 className="font-medium text-white">Rover Deployment</h4>
              <p className="text-sm text-gray-400">Day 2</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 rounded bg-yellow-500"></div>
            <div>
              <h4 className="font-medium text-white">Surface Exploration</h4>
              <p className="text-sm text-gray-400">Days 3-12</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 rounded bg-purple-500"></div>
            <div>
              <h4 className="font-medium text-white">Sample Collection</h4>
              <p className="text-sm text-gray-400">Days 11-13</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 rounded bg-red-500"></div>
            <div>
              <h4 className="font-medium text-white">Return</h4>
              <p className="text-sm text-gray-400">Day 14</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}