import { formatNumber } from '../../lib/imageUtils';
import { useMissionStore } from '../../store/missionStore';

export function WorkflowDetail() {
  const workflowStep = useMissionStore((s) => s.workflowStep);
  const metadata = useMissionStore((s) => s.metadata);
  const statistics = useMissionStore((s) => s.statistics);
  const hazardStats = useMissionStore((s) => s.hazardStats);
  const iceStats = useMissionStore((s) => s.iceStats);
  const analysis = useMissionStore((s) => s.analysis);
  const traverseMetrics = useMissionStore((s) => s.traverseMetrics);
  const missionScores = useMissionStore((s) => s.missionScores);

  return (
    <footer className="workflow-detail">
      {workflowStep === 'ingestion' && (
        <>
          <span className="wf-detail-title">Step 1 — Data Ingestion</span>
          {metadata ? (
            <span>
              {metadata.filename} · {metadata.width}×{metadata.height} px · mean {formatNumber(statistics?.meanBrightness ?? 0, 1)} · σ{' '}
              {formatNumber(statistics?.stdBrightness ?? 0, 1)}
            </span>
          ) : (
            <span>Upload Chandrayaan-2 OHRC imagery to begin mission analysis session.</span>
          )}
        </>
      )}
      {workflowStep === 'hazard' && hazardStats && (
        <>
          <span className="wf-detail-title">Step 2 — Hazard Assessment</span>
          <span>
            Safe {hazardStats.safePercent.toFixed(1)}% · Moderate {hazardStats.moderatePercent.toFixed(1)}% · Dangerous{' '}
            {hazardStats.dangerousPercent.toFixed(1)}% · Extreme {hazardStats.extremePercent.toFixed(1)}%
          </span>
        </>
      )}
      {workflowStep === 'ice' && iceStats && (
        <>
          <span className="wf-detail-title">Step 3 — Ice Candidate Assessment</span>
          <span>
            {iceStats.candidateRegions} regions · max prob {(iceStats.maxProbability * 100).toFixed(1)}% · high confidence{' '}
            {iceStats.highConfidencePercent.toFixed(1)}%
          </span>
        </>
      )}
      {workflowStep === 'landing' && analysis.landingSite && (
        <>
          <span className="wf-detail-title">Step 4 — Landing Site Optimization</span>
          <span>
            Site ({analysis.landingSite.x}, {analysis.landingSite.y}) · suitability {(analysis.landingSite.score * 100).toFixed(1)}%
          </span>
        </>
      )}
      {workflowStep === 'traverse' && traverseMetrics && (
        <>
          <span className="wf-detail-title">Step 5 — Traverse Planning</span>
          <span>
            {formatNumber(traverseMetrics.distanceMeters, 1)} m · {formatNumber(traverseMetrics.travelTimeHours, 2)} hr ·{' '}
            {traverseMetrics.difficulty} difficulty
          </span>
        </>
      )}
      {workflowStep === 'evaluation' && missionScores && (
        <>
          <span className="wf-detail-title">Step 6 — Mission Evaluation</span>
          <span>
            Feasibility {missionScores.missionFeasibility.toFixed(1)}% · {missionScores.recommendation}
          </span>
        </>
      )}
    </footer>
  );
}
