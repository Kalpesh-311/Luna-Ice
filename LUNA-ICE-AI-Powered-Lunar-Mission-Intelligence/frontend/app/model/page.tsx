
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, type ModelMetrics } from "@/lib/api";
import { Brain, BarChart3, Zap, Database } from "lucide-react";

export default function ModelPage() {
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metrics, info] = await Promise.all([
          api.getModelMetrics(),
          api.getModelInfo()
        ]);
        setModelMetrics(metrics);
        setModelInfo(info);
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!modelMetrics) return null;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Brain className="w-12 h-12 text-purple-400" />
          <div>
            <h1 className="text-4xl font-bold text-white">Model Performance</h1>
            <p className="text-gray-400">{modelMetrics.model_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Accuracy */}
          <motion.div
            className="glass-card rounded-2xl p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p className="text-4xl font-bold text-white mt-1">
              {(modelMetrics.accuracy * 100).toFixed(1)}%
            </p>
          </motion.div>

          {/* Precision */}
          <motion.div
            className="glass-card rounded-2xl p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">Precision</p>
            <p className="text-4xl font-bold text-white mt-1">
              {(modelMetrics.precision * 100).toFixed(1)}%
            </p>
          </motion.div>

          {/* Recall */}
          <motion.div
            className="glass-card rounded-2xl p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-orange-500/20 rounded-xl w-fit mb-4">
              <Brain className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-gray-400 text-sm">Recall</p>
            <p className="text-4xl font-bold text-white mt-1">
              {(modelMetrics.recall * 100).toFixed(1)}%
            </p>
          </motion.div>

          {/* F1 Score */}
          <motion.div
            className="glass-card rounded-2xl p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm">F1 Score</p>
            <p className="text-4xl font-bold text-white mt-1">
              {(modelMetrics.f1 * 100).toFixed(1)}%
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Details */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Model Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Algorithm</span>
                <span className="text-blue-400 font-semibold">{modelMetrics.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Training Time</span>
                <span className="text-green-400 font-semibold">{modelMetrics.training_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Inference Time</span>
                <span className="text-cyan-400 font-semibold">{modelMetrics.inference_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Feature Count</span>
                <span className="text-purple-400 font-semibold">{modelMetrics.feature_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model Size</span>
                <span className="text-orange-400 font-semibold">{modelMetrics.model_size_mb} MB</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">ROC & AUC</h3>
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-purple-400">
                  {(modelMetrics.roc_auc * 100).toFixed(1)}%
                </p>
                <p className="text-gray-400 mt-2">ROC-AUC Score</p>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000"
                style={{ width: `${modelMetrics.roc_auc * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feature Names */}
        {modelInfo && modelInfo.feature_names && modelInfo.feature_names.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-white/10 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Top Features</h3>
            <div className="flex flex-wrap gap-2">
              {modelInfo.feature_names.slice(0, 20).map((feature: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

