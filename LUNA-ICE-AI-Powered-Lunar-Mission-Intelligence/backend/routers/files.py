
from fastapi import APIRouter
from fastapi.responses import FileResponse
from services.data_service import (
    get_ice_preview_path,
    get_hazard_preview_path,
    get_terrain_preview_path,
    get_slope_preview_path,
    get_rover_preview_path,
    get_rover_route_path,
    get_report_path,
    get_ice_tif_path,
    get_hazard_tif_path,
    get_terrain_tif_path,
    get_slope_tif_path,
    get_landing_sites_path
)
import json

router = APIRouter()


# Preview endpoints
@router.get("/terrain-preview")
async def get_terrain_preview():
    preview_path = get_terrain_preview_path()
    return FileResponse(
        path=str(preview_path),
        media_type="image/png",
        filename="terrain_preview.png"
    )


@router.get("/hazard-preview")
async def get_hazard_preview():
    preview_path = get_hazard_preview_path()
    return FileResponse(
        path=str(preview_path),
        media_type="image/png",
        filename="hazard_preview.png"
    )


@router.get("/ice-preview")
async def get_ice_preview():
    preview_path = get_ice_preview_path()
    return FileResponse(
        path=str(preview_path),
        media_type="image/png",
        filename="ice_probability_preview.png"
    )


@router.get("/slope-preview")
async def get_slope_preview():
    preview_path = get_slope_preview_path()
    return FileResponse(
        path=str(preview_path),
        media_type="image/png",
        filename="slope_preview.png"
    )


@router.get("/rover-preview")
async def get_rover_preview():
    preview_path = get_rover_preview_path()
    return FileResponse(
        path=str(preview_path),
        media_type="image/png",
        filename="rover_path_preview.png"
    )


# GeoJSON endpoint
@router.get("/rover-route")
async def get_rover_route():
    route_path = get_rover_route_path()
    if route_path.exists():
        with open(route_path, "r") as f:
            return json.load(f)
    return {}


# Download endpoints
@router.get("/download/ice")
async def download_ice_tif():
    tif_path = get_ice_tif_path()
    return FileResponse(
        path=str(tif_path),
        media_type="image/tiff",
        filename="ice_probability_map.tif"
    )


@router.get("/download/hazard")
async def download_hazard_tif():
    tif_path = get_hazard_tif_path()
    return FileResponse(
        path=str(tif_path),
        media_type="image/tiff",
        filename="hazard_map.tif"
    )


@router.get("/download/terrain")
async def download_terrain_tif():
    tif_path = get_terrain_tif_path()
    return FileResponse(
        path=str(tif_path),
        media_type="image/tiff",
        filename="terrain_map.tif"
    )


@router.get("/download/slope")
async def download_slope_tif():
    tif_path = get_slope_tif_path()
    return FileResponse(
        path=str(tif_path),
        media_type="image/tiff",
        filename="slope_map.tif"
    )


@router.get("/download/landing-sites")
async def download_landing_sites():
    csv_path = get_landing_sites_path()
    return FileResponse(
        path=str(csv_path),
        media_type="text/csv",
        filename="landing_sites.csv"
    )


# Report download
@router.get("/report")
async def get_report():
    report_path = get_report_path()
    return FileResponse(
        path=str(report_path),
        media_type="application/pdf",
        filename="mission_report.pdf"
    )

