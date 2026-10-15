
from pydantic import BaseModel
from typing import Dict, Any, Optional, List


class MissionSummary(BaseModel):
    mission_score: float
    landing_score: float
    ice_probability: float
    hazard_percent: float
    mission_readiness: str
    crater_count: int
    boulder_count: int
    safe_area_percent: float
    danger_area_percent: float
    mission_status: str
    top_landing_site: Optional[Dict[str, Any]] = None
    average_slope: Optional[float] = None
    timestamp: Optional[str] = None


class ModelMetrics(BaseModel):
    model_name: str
    algorithm: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    training_time: str
    inference_time: str
    feature_count: int
    model_size_mb: float


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    rank: int


class PredictionRequest(BaseModel):
    features: Optional[List[float]] = None


class PredictionResponse(BaseModel):
    ice_probability: float
    hazard_probability: float
    landing_score: float
    mission_readiness: str
    risk_level: str
    inference_time: float
    confidence: float

