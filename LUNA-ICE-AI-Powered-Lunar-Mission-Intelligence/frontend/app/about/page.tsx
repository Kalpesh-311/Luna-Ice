"use client";

import { motion } from "framer-motion";
import { Rocket, Info, Code } from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl">
          <Info className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">About</h1>
          <p className="text-gray-400">Learn more about the Lunar Mission Control platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <img
              src="/images/moon logo.png"
              alt="LUNA-ICE Logo"
              className="w-14 h-14 object-contain animate-spin-slow"
            />
            Project Overview
          </h3>
          <p className="text-gray-300 mb-4">
            Lunar Mission Control is an AI-powered platform for lunar ice detection and rover planning.
            It uses machine learning models to analyze lunar terrain and identify optimal landing sites.
          </p>
          <p className="text-gray-300">
            Built for the Bharat Antariksh Hackathon, this platform demonstrates cutting-edge
            geospatial AI and mission planning capabilities.
          </p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            Technology Stack
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Backend</p>
              <p className="text-sm text-gray-400">FastAPI, Python, Pandas, Scikit-learn</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Frontend</p>
              <p className="text-sm text-gray-400">Next.js 15, React 19, Tailwind CSS, Framer Motion</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl">
              <p className="text-gray-300 font-medium">Data Visualization</p>
              <p className="text-sm text-gray-400">Plotly, PNG Previews, Leaflet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preprocessing Pipeline Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Lunar Dataset Cropping Process</h3>
          <ImageViewer
            src="/images/Lunar Dataset Cropping Process.png"
            alt="Lunar Dataset Cropping Process"
            title="Lunar Dataset Cropping Process"
            trigger={
              <img
                src="/images/Lunar Dataset Cropping Process.png"
                alt="Lunar Dataset Cropping Process"
                className="w-full h-auto object-contain rounded-xl"
              />
            }
          />
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Lunar Dataset Preprocessing Pipeline</h3>
          <ImageViewer
            src="/images/Lunar Dataset Preprocessing Pipeline.png"
            alt="Lunar Dataset Preprocessing Pipeline"
            title="Lunar Dataset Preprocessing Pipeline"
            trigger={
              <img
                src="/images/Lunar Dataset Preprocessing Pipeline.png"
                alt="Lunar Dataset Preprocessing Pipeline"
                className="w-full h-auto object-contain rounded-xl"
              />
            }
          />
        </div>
      </div>
    </motion.div>
  );
}