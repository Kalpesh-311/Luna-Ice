
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface MissionSummary {
  mission_score: number;
  landing_score: number;
  ice_probability: number;
  hazard_percent: number;
  mission_readiness: string;
  crater_count: number;
  boulder_count: number;
  safe_area_percent: number;
  danger_area_percent: number;
  mission_status: string;
  top_landing_site?: any;
  average_slope?: number;
  timestamp?: string;
}

export interface ModelMetrics {
  model_name: string;
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  training_time: string;
  inference_time: string;
  feature_count: number;
  model_size_mb: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  rank: number;
}

export interface LandingSite {
  x: number;
  y: number;
  safety: number;
  ice_potential: number;
  accessibility: number;
  terrain_stability: number;
  score: number;
}

export interface PredictionResponse {
  ice_probability: number;
  hazard_probability: number;
  landing_score: number;
  mission_readiness: string;
  risk_level: string;
  inference_time: number;
  confidence: number;
}

export const api = {
  async getMissionSummary(): Promise<MissionSummary> {
    const response = await fetch(`${API_BASE_URL}/mission-summary`);
    if (!response.ok) throw new Error("Failed to fetch mission summary");
    return response.json();
  },

  async getModelMetrics(): Promise<ModelMetrics> {
    const response = await fetch(`${API_BASE_URL}/model-metrics`);
    if (!response.ok) throw new Error("Failed to fetch model metrics");
    return response.json();
  },

  async getFeatureImportance(): Promise<FeatureImportanceItem[]> {
    const response = await fetch(`${API_BASE_URL}/feature-importance`);
    if (!response.ok) throw new Error("Failed to fetch feature importance");
    return response.json();
  },

  async getLandingSites(): Promise<LandingSite[]> {
    const response = await fetch(`${API_BASE_URL}/landing-sites`);
    if (!response.ok) throw new Error("Failed to fetch landing sites");
    const data = await response.json();
    return data.data;
  },

  async getModelInfo() {
    const response = await fetch(`${API_BASE_URL}/model-info`);
    if (!response.ok) throw new Error("Failed to fetch model info");
    return response.json();
  },

  async predict(features?: number[]): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
    });
    if (!response.ok) throw new Error("Failed to make prediction");
    return response.json();
  },

  async getRoverRoute() {
    const response = await fetch(`${API_BASE_URL}/rover-route`);
    if (!response.ok) throw new Error("Failed to fetch rover route");
    return response.json();
  },
};

export const getPreviewUrl = (type: string) => {
  switch (type) {
    case "ice":
      return `${API_BASE_URL}/ice-preview`;
    case "hazard":
      return `${API_BASE_URL}/hazard-preview`;
    case "terrain":
      return `${API_BASE_URL}/terrain-preview`;
    case "slope":
      return `${API_BASE_URL}/slope-preview`;
    case "rover":
      return `${API_BASE_URL}/rover-preview`;
    default:
      return "";
  }
};

export const getDownloadUrl = (type: string) => {
  switch (type) {
    case "ice":
      return `${API_BASE_URL}/download/ice`;
    case "hazard":
      return `${API_BASE_URL}/download/hazard`;
    case "terrain":
      return `${API_BASE_URL}/download/terrain`;
    case "slope":
      return `${API_BASE_URL}/download/slope`;
    case "landing-sites":
      return `${API_BASE_URL}/download/landing-sites`;
    case "report":
      return `${API_BASE_URL}/report`;
    default:
      return "";
  }
};

