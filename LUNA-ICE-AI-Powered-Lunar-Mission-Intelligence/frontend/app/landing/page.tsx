"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, type LandingSite } from "@/lib/api";
import { MapPin, Download, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDownloadUrl } from "@/lib/api";
import { ImageViewer } from "@/components/ImageViewer";

export default function LandingSitesPage() {
  const [landingSites, setLandingSites] = useState<LandingSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getLandingSites();
        setLandingSites(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSites = landingSites.filter(site =>
    site.x.toString().includes(searchTerm) ||
    site.y.toString().includes(searchTerm)
  ).sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MapPin className="w-12 h-12 text-green-400" />
          <div>
            <h1 className="text-4xl font-bold text-white">Landing Sites</h1>
            <p className="text-gray-400">Optimal landing locations ranked by score</p>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
          onClick={() => {
            window.open(getDownloadUrl("landing-sites"), "_blank");
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by coordinates..."
            className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main visualization image */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Topographic Analysis of Candidate Polar Craters</h2>
        <div className="relative w-full">
          <ImageViewer
            src="/images/Topographic Analysis of Candidate Polar Craters.png"
            alt="Topographic Analysis of Candidate Polar Craters"
            title="Topographic Analysis of Candidate Polar Craters"
            trigger={
              <div className="relative">
                <img
                  src="/images/Topographic Analysis of Candidate Polar Craters.png"
                  alt="Topographic Analysis of Candidate Polar Craters"
                  className="w-full h-auto max-h-[600px] object-contain rounded-xl"
                />
                
                {/* Landing site markers overlay */}
                {filteredSites.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                    {filteredSites.slice(0, 5).map((site, index) => {
                      const cx = (site.x / 224) * 800;
                      const cy = (site.y / 224) * 600;
                      const color = index === 0 ? "rgba(234, 179, 8, 1)" : index === 1 ? "rgba(156, 163, 175, 1)" : index === 2 ? "rgba(249, 115, 22, 1)" : "rgba(59, 130, 246, 1)";
                      return (
                        <g key={index}>
                          <circle cx={cx} cy={cy} r={15} fill={color} fillOpacity={0.8} />
                          <text x={cx} y={cy + 6} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                            {index + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            }
          />
        </div>
      </div>

      {/* Top Site */}
      {filteredSites.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Top Recommended Site</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-yellow-400">
                {(filteredSites[0].score * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl">
              <p className="text-gray-400 text-sm">Safety</p>
              <p className="text-2xl font-bold text-green-400">
                {(filteredSites[0].safety * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-cyan-500/10 rounded-xl">
              <p className="text-gray-400 text-sm">Ice Potential</p>
              <p className="text-2xl font-bold text-cyan-400">
                {(filteredSites[0].ice_potential * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl">
              <p className="text-gray-400 text-sm">Coordinates</p>
              <p className="text-2xl font-bold text-blue-400">
                ({filteredSites[0].x}, {filteredSites[0].y})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Coordinates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Safety</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ice Potential</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSites.map((site, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                      index === 1 ? "bg-gray-400/20 text-gray-300" :
                      index === 2 ? "bg-orange-600/20 text-orange-400" :
                      "bg-gray-600/20 text-gray-400"
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-mono">
                    ({site.x}, {site.y})
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-semibold">
                      {(site.safety * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-semibold">
                      {(site.ice_potential * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-400 font-bold text-lg">
                      {(site.score * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}