# Bharat Antariksh Hackathon - PS8: Lunar Ice Detection & Rover Planning

## Project Overview

This project is a complete deployment system for a lunar ice detection and rover planning application. It consists of:
- A FastAPI backend that serves trained model outputs and analysis files
- A Next.js 15 frontend with a beautiful, responsive UI
- Optimized handling of large TIFF files using pre-generated PNG previews

## Architecture

```
┌─────────────────┐
│ Jupyter Notebook│  (Training Pipeline, generates files)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Files   │  (model.pkl, landing_sites.csv, TIFFs, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI Backend│  (Serves files, model info, and API endpoints)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Next.js Frontend│  (Beautiful UI for mission control and analysis)
└─────────────────┘
```

## Project Structure

```
d:\Hackathon
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── __init__.py
│   │   ├── schemas.py
│   │   └── model.pkl  # Trained model
│   ├── services/
│   │   ├── __init__.py
│   │   └── data_service.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── mission.py
│   │   └── files.py
│   ├── data/
│   │   ├── landing_sites.csv
│   │   ├── ice_probability_map.tif
│   │   ├── hazard_map.tif
│   │   ├── rover_route.geojson
│   │   ├── mission_report.pdf
│   │   ├── mission_summary.json
│   │   └── model_metrics.json
│   └── previews/
│       ├── ice_probability_preview.png
│       └── hazard_preview.png
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home)
│   │   ├── ice/
│   │   ├── hazard/
│   │   ├── landing/
│   │   ├── rover/
│   │   ├── model/
│   │   ├── reports/
│   │   ├── terrain/
│   │   ├── settings/
│   │   ├── dashboard/
│   │   └── analytics/
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── outputs/
│   ├── (original notebook outputs)
│   └── ...
├── generate_metadata.py
└── README.md
```

## Getting Started

### 1. Install Dependencies

#### Backend
```bash
cd d:\Hackathon\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend
```bash
cd d:\Hackathon\frontend
npm install
```

### 2. Prepare Files (If Needed)

If the backend/data or backend/previews folders are missing files, run:
```bash
# From project root
python generate_metadata.py  # Generates metadata and copies files to backend
```

### 3. Run the Application

#### Start Backend (Port 8000)
```bash
cd d:\Hackathon\backend
.venv\Scripts\activate
python main.py
```

#### Start Frontend (Port 3001)
```bash
cd d:\Hackathon\frontend
npm run dev -- --port 3001
```

The frontend will be available at `http://localhost:3001`

## API Endpoints

| Endpoint               | Method | Description                                                      |
|------------------------|--------|------------------------------------------------------------------|
| `/`                    | GET    | Health check                                                     |
| `/mission-summary`     | GET    | Get mission summary (score, ice probability, hazard %, etc.)     |
| `/model-metrics`       | GET    | Get model performance metrics (accuracy, precision, recall, F1)  |
| `/landing-sites`       | GET    | Get landing sites as JSON                                        |
| `/model-info`          | GET    | Get model type and feature names                                 |
| `/ice-preview`         | GET    | Get ice probability map PNG preview                              |
| `/hazard-preview`      | GET    | Get hazard map PNG preview                                       |
| `/rover-route`         | GET    | Get rover route as GeoJSON                                       |
| `/download-ice`        | GET    | Download full ice_probability_map.tif                            |
| `/download-hazard`     | GET    | Download full hazard_map.tif                                     |
| `/download-landing-sites` | GET  | Download landing_sites.csv                                       |
| `/report`              | GET    | Download mission_report.pdf                                      |

## Frontend Pages

- **Home**: Mission control dashboard with key metrics
- **Mission Dashboard**: (Coming soon - full dashboard)
- **Terrain Analysis**: (Coming soon - terrain preview and stats)
- **Ice Detection**: Ice probability heatmap preview and TIFF download
- **Hazard Detection**: Hazard map preview and TIFF download
- **Landing Sites**: Interactive table with landing site rankings
- **Rover Planning**: (Coming soon - rover route visualization)
- **Mission Analytics**: (Coming soon - charts and analytics)
- **Model Performance**: Model metrics and details
- **Mission Reports**: Download all mission files
- **Settings**: (Coming soon)

## Key Features

### Backend Optimizations
- **Lazy loading**: Large TIFF files are never loaded on startup
- **Pre-generated PNG previews**: Fast loading of map visualizations
- **Caching**: LRU cache for frequently used file paths
- **Error handling**: Proper HTTP exception handling
- **Typed schemas**: Pydantic models for type safety

### Frontend Features
- **Responsive design**: Works on mobile and desktop
- **Glassmorphism UI**: Beautiful, modern interface
- **Framer Motion**: Smooth animations
- **Loading states**: Skeletons and spinners for better UX
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling

## Requirements

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- Pandas
- Pillow
- Rasterio (for preview generation)

### Frontend
- Node.js 18+
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Important Notes

- The Jupyter notebook is the **single source of truth** - do not retrain or regenerate files in the backend
- Always use PNG previews for visualization - full TIFF downloads are only for advanced use cases
- The backend must be running on port 8000 for the frontend to work

## License

This project is built for the Bharat Antariksh Hackathon 2025.
