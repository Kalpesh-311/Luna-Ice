"use client";

import { motion } from "framer-motion";
import { Database, Info } from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";

export default function DatasetPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl">
          <Database className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Lunar Dataset</h1>
          <p className="text-gray-400">Explore the datasets used in this mission</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DEM Dataset */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Digital Elevation Model</h3>
          </div>
          <ImageViewer
            src="/images/Lunar South Pole Digital Elevation Model (DEM).png"
            alt="Digital Elevation Model"
            title="Lunar South Pole Digital Elevation Model (DEM)"
            trigger={
              <img
                src="/images/Lunar South Pole Digital Elevation Model (DEM).png"
                alt="Digital Elevation Model"
                className="w-full h-auto object-contain rounded-xl"
              />
            }
          />
          <p className="text-gray-300 mt-4 text-sm">
            High-resolution digital elevation model of the lunar south pole, used for terrain analysis.
          </p>
        </div>

        {/* SAR Coverage Dataset */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">DFSAR SAR Coverage</h3>
          </div>
          <ImageViewer
            src="/images/Lunar South Pole SAR Coverage Map.png"
            alt="SAR Coverage Map"
            title="Lunar South Pole SAR Coverage Map"
            trigger={
              <img
                src="/images/Lunar South Pole SAR Coverage Map.png"
                alt="SAR Coverage Map"
                className="w-full h-auto object-contain rounded-xl"
              />
            }
          />
          <p className="text-gray-300 mt-4 text-sm">
            DFSAR Synthetic Aperture Radar coverage map of the lunar south pole, used for ice detection.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
