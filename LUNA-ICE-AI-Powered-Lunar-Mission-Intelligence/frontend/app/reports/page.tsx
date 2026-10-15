"use client";

import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDownloadUrl } from "@/lib/api";
import { ImageViewer } from "@/components/ImageViewer";

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Mission Reports</h1>
          <p className="text-gray-400">Download complete mission analysis documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mission Report */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/mission_control_map.png"
              alt="Mission Report"
              title="Mission Report"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/mission_control_map.png"
                    alt="Mission Report"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Mission Report</h3>
          <p className="text-gray-400 text-sm mb-4">
            Complete analysis including ice detection, hazard assessment, and landing site recommendations
          </p>
          <Button
            className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("report"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </motion.div>

        {/* Landing Sites */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/Topographic Analysis of Candidate Polar Craters.png"
              alt="Landing Sites Data"
              title="Landing Sites Data"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/Topographic Analysis of Candidate Polar Craters.png"
                    alt="Landing Sites Data"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Landing Sites Data</h3>
          <p className="text-gray-400 text-sm mb-4">
            CSV file with all potential landing sites ranked by score
          </p>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("landing-sites"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </motion.div>

        {/* Ice Map */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/ice_probability_preview.png"
              alt="Ice Probability Map"
              title="Ice Probability Map"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/ice_probability_preview.png"
                    alt="Ice Probability Map"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ice Probability Map</h3>
          <p className="text-gray-400 text-sm mb-4">
            High-resolution TIFF file with ice probability heatmap
          </p>
          <Button
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("ice"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download TIFF
          </Button>
        </motion.div>

        {/* Hazard Map */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/hazard_preview.png"
              alt="Hazard Map"
              title="Hazard Map"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/hazard_preview.png"
                    alt="Hazard Map"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Hazard Map</h3>
          <p className="text-gray-400 text-sm mb-4">
            High-resolution TIFF file with hazard assessment
          </p>
          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("hazard"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download TIFF
          </Button>
        </motion.div>

        {/* Terrain Map */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/terrain_preview.png"
              alt="Terrain Map"
              title="Terrain Map"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/terrain_preview.png"
                    alt="Terrain Map"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Terrain Map</h3>
          <p className="text-gray-400 text-sm mb-4">
            High-resolution TIFF file with terrain elevation
          </p>
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teale-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("terrain"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download TIFF
          </Button>
        </motion.div>

        {/* Slope Map */}
        <motion.div
          className="glass-card rounded-2xl p-6 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-4">
            <ImageViewer
              src="/images/slope_preview.png"
              alt="Slope Map"
              title="Slope Map"
              trigger={
                <div className="w-full h-40 overflow-hidden rounded-xl">
                  <img
                    src="/images/slope_preview.png"
                    alt="Slope Map"
                    className="w-full h-full object-cover"
                  />
                </div>
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Slope Map</h3>
          <p className="text-gray-400 text-sm mb-4">
            High-resolution TIFF file with slope analysis
          </p>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white"
            onClick={() => {
              window.open(getDownloadUrl("slope"), "_blank");
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download TIFF
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}