"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Map as MapIcon } from "lucide-react";
import { getDownloadUrl } from "@/lib/api";

const files = [
  {
    name: "Mission Report",
    type: "PDF",
    icon: <FileText className="w-6 h-6 text-blue-400" />,
    downloadKey: "report",
    description: "Comprehensive mission analysis document",
  },
  {
    name: "Landing Sites",
    type: "CSV",
    icon: <FileSpreadsheet className="w-6 h-6 text-green-400" />,
    downloadKey: "landing-sites",
    description: "Ranked list of optimal landing sites",
  },
  {
    name: "Ice Probability Map",
    type: "TIFF",
    icon: <MapIcon className="w-6 h-6 text-cyan-400" />,
    downloadKey: "ice",
    description: "High-resolution ice probability heatmap",
  },
  {
    name: "Hazard Map",
    type: "TIFF",
    icon: <MapIcon className="w-6 h-6 text-orange-400" />,
    downloadKey: "hazard",
    description: "High-resolution hazard assessment map",
  },
  {
    name: "Terrain Map",
    type: "TIFF",
    icon: <MapIcon className="w-6 h-6 text-purple-400" />,
    downloadKey: "terrain",
    description: "High-resolution terrain elevation map",
  },
  {
    name: "Slope Map",
    type: "TIFF",
    icon: <MapIcon className="w-6 h-6 text-yellow-400" />,
    downloadKey: "slope",
    description: "High-resolution slope map",
  },
];

export default function DownloadsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl">
          <Download className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Downloads</h1>
          <p className="text-gray-400">Download all mission artifacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <motion.div
            key={file.name}
            className="glass-card p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-gray-800/50 rounded-xl w-fit mb-4">
              {file.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{file.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{file.description}</p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs font-medium text-gray-300">
                {file.type}
              </span>
              <button
                className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white rounded-lg font-medium flex items-center gap-2"
                onClick={() => window.open(getDownloadUrl(file.downloadKey), "_blank")}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}