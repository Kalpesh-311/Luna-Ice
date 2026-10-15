import { useRef } from 'react';
import { generateMissionReportText } from '../../lib/reportGenerator';
import { downloadText } from '../../lib/imageUtils';
import { useMissionStore } from '../../store/missionStore';

export function MissionToolbar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const processing = useMissionStore((s) => s.processing);
  const processingLabel = useMissionStore((s) => s.processingLabel);
  const statusMessage = useMissionStore((s) => s.statusMessage);
  const metadata = useMissionStore((s) => s.metadata);
  const analysis = useMissionStore((s) => s.analysis);
  const measurementMode = useMissionStore((s) => s.measurementMode);

  const importImage = useMissionStore((s) => s.importImage);
  const runHazardAnalysis = useMissionStore((s) => s.runHazardAnalysis);
  const runIceAnalysis = useMissionStore((s) => s.runIceAnalysis);
  const runLandingOptimization = useMissionStore((s) => s.runLandingOptimization);
  const generateTraverse = useMissionStore((s) => s.generateTraverse);
  const evaluateMission = useMissionStore((s) => s.evaluateMission);
  const setReportOpen = useMissionStore((s) => s.setReportOpen);
  const exportResults = useMissionStore((s) => s.exportResults);
  const getReportData = useMissionStore((s) => s.getReportData);
  const toggleMeasurementMode = useMissionStore((s) => s.toggleMeasurementMode);
  const clearMeasurements = useMissionStore((s) => s.clearMeasurements);

  const hasImage = !!metadata;
  const hasHazard = !!analysis.hazardClass;
  const hasIce = !!analysis.iceProbability;
  const hasLanding = !!analysis.landingSite;
  const hasTraverse = !!analysis.roverPath;

  const handleReport = () => {
    const data = getReportData();
    const text = generateMissionReportText(data);
    downloadText(text, `lunar-mission-report-${Date.now()}.txt`);
    setReportOpen(true);
  };

  return (
    <header className="mission-toolbar">
      <div className="toolbar-brand">
        <span className="brand-mark">◈</span>
        <div>
          <strong>Lunar Mission Ops</strong>
          <span className="brand-sub">Chandrayaan-2 OHRC · South Polar Analysis</span>
        </div>
      </div>

      <div className="toolbar-actions">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importImage(f);
            e.target.value = '';
          }}
        />
        <ToolbarButton label="Import Data" onClick={() => fileRef.current?.click()} disabled={processing} primary />
        <ToolbarButton label="Hazard Analysis" onClick={runHazardAnalysis} disabled={!hasImage || processing} />
        <ToolbarButton label="Ice Analysis" onClick={runIceAnalysis} disabled={!hasHazard || processing} />
        <ToolbarButton label="Landing Optimization" onClick={runLandingOptimization} disabled={!hasIce || processing} />
        <ToolbarButton label="Generate Traverse" onClick={generateTraverse} disabled={!hasLanding || processing} />
        <ToolbarButton label="Mission Evaluation" onClick={evaluateMission} disabled={!hasTraverse || processing} />
        <span className="toolbar-sep" />
        <ToolbarButton label="Mission Report" onClick={handleReport} disabled={!hasImage} />
        <ToolbarButton label="Export Results" onClick={exportResults} disabled={!hasHazard} />
        <span className="toolbar-sep" />
        <ToolbarButton
          label={measurementMode ? 'Measure ✓' : 'Measure'}
          onClick={toggleMeasurementMode}
          disabled={!hasImage}
          active={measurementMode}
        />
        <ToolbarButton label="Clear Measures" onClick={clearMeasurements} disabled={!hasImage} />
      </div>

      <div className="toolbar-status">
        {processing ? (
          <span className="status-processing">{processingLabel}</span>
        ) : (
          <span className="status-idle">{statusMessage}</span>
        )}
      </div>
    </header>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  primary,
  active,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`tb-btn ${primary ? 'primary' : ''} ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
