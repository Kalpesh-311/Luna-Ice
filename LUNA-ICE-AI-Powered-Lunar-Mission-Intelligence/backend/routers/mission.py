
from fastapi import APIRouter, HTTPException
from models.schemas import (
    MissionSummary,
    ModelMetrics,
    FeatureImportanceItem,
    PredictionRequest,
    PredictionResponse
)
from services.data_service import (
    get_mission_summary,
    get_model_metrics,
    get_landing_sites,
    get_model,
    get_feature_importance,
    predict
)

router = APIRouter()


@router.get("/mission-summary", response_model=MissionSummary)
def get_mission_summary_endpoint():
    summary = get_mission_summary()
    if not summary:
        raise HTTPException(status_code=404, detail="Mission summary not found")
    return summary


@router.get("/model-metrics", response_model=ModelMetrics)
def get_model_metrics_endpoint():
    metrics = get_model_metrics()
    if not metrics:
        raise HTTPException(status_code=404, detail="Model metrics not found")
    return metrics


@router.get("/feature-importance", response_model=list[FeatureImportanceItem])
def get_feature_importance_endpoint():
    fi = get_feature_importance()
    if not fi:
        raise HTTPException(status_code=404, detail="Feature importance not found")
    return fi


@router.get("/landing-sites")
def get_landing_sites_endpoint():
    sites_df = get_landing_sites()
    if sites_df is None:
        raise HTTPException(status_code=404, detail="Landing sites not found")
    return {
        "success": True,
        "data": sites_df.to_dict(orient="records")
    }


@router.get("/model-info")
def get_model_info_endpoint():
    model = get_model()
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")

    model_type = type(model).__name__
    feature_names = []
    if hasattr(model, "feature_names_in_"):
        feature_names = list(model.feature_names_in_[:50])

    return {
        "model_type": model_type,
        "feature_count": len(feature_names),
        "feature_names": feature_names
    }


@router.post("/predict", response_model=PredictionResponse)
def predict_endpoint(request: PredictionRequest = None):
    features = request.features if request and request.features else None
    prediction, _ = predict(features)
    if not prediction:
        raise HTTPException(status_code=500, detail="Prediction failed")
    return prediction

