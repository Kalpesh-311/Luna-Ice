import { hazardClassColor } from '../../lib/layerRenderer';
import { formatNumber } from '../../lib/imageUtils';
import { useMissionStore } from '../../store/missionStore';

export function InspectorPanel() {
  const selection = useMissionStore((s) => s.selection);
  const metadata = useMissionStore((s) => s.metadata);
  const statistics = useMissionStore((s) => s.statistics);
  const hazardStats = useMissionStore((s) => s.hazardStats);
  const iceStats = useMissionStore((s) => s.iceStats);
  const analysis = useMissionStore((s) => s.analysis);
  const traverseMetrics = useMissionStore((s) => s.traverseMetrics);
  const missionScores = useMissionStore((s) => s.missionScores);
  const workflowStep = useMissionStore((s) => s.workflowStep);

  return (
    <aside className="panel panel-right">
      <header className="panel-header">
        <h2>Analysis Inspector</h2>
        <span className="panel-sub">Context: {selection.type === 'none' ? 'Scene' : selection.type}</span>
      </header>

      <InspectorSection title="Cursor / Selection">
        {selection.type === 'none' || selection.type === 'path' ? (
          <p className="inspector-empty">Click the map to inspect coordinates and layer values.</p>
        ) : (
          <dl className="data-grid">
            {selection.x !== undefined && (
              <>
                <dt>Pixel</dt>
                <dd>
                  [{selection.x}, {selection.y}]
                </dd>
              </>
            )}
            {selection.lon !== undefined && (
              <>
                <dt>Geodetic</dt>
                <dd>
                  {selection.lon.toFixed(4)}°E, {selection.lat?.toFixed(4)}°N
                </dd>
              </>
            )}
            {selection.hazardClass && (
              <>
                <dt>Hazard Class</dt>
                <dd style={{ color: hazardClassColor(selection.hazardClass) }}>
                  {selection.hazardClass.toUpperCase()}
                </dd>
              </>
            )}
            {selection.hazardScore !== undefined && (
              <>
                <dt>Hazard Score</dt>
                <dd>{(selection.hazardScore * 100).toFixed(1)}%</dd>
              </>
            )}
            {selection.iceProbability !== undefined && (
              <>
                <dt>Ice Probability</dt>
                <dd>{(selection.iceProbability * 100).toFixed(1)}%</dd>
              </>
            )}
            {selection.landingScore !== undefined && (
              <>
                <dt>Landing Suitability</dt>
                <dd>{(selection.landingScore * 100).toFixed(1)}%</dd>
              </>
            )}
            {selection.traversability !== undefined && (
              <>
                <dt>Traversability</dt>
                <dd>{(selection.traversability * 100).toFixed(1)}%</dd>
              </>
            )}
          </dl>
        )}
      </InspectorSection>

      {metadata && (
        <InspectorSection title="Input Metadata">
          <dl className="data-grid">
            <dt>File</dt>
            <dd className="truncate">{metadata.filename}</dd>
            <dt>Sensor</dt>
            <dd>{metadata.sensor}</dd>
            <dt>Dimensions</dt>
            <dd>
              {metadata.width}×{metadata.height}
            </dd>
            <dt>Resolution</dt>
            <dd>{metadata.resolutionMetersPerPixel} m/px</dd>
          </dl>
        </InspectorSection>
      )}

      {statistics && workflowStep !== 'ingestion' && (
        <InspectorSection title="Image Statistics">
          <dl className="data-grid">
            <dt>Mean Brightness</dt>
            <dd>{formatNumber(statistics.meanBrightness, 1)}</dd>
            <dt>Std Dev</dt>
            <dd>{formatNumber(statistics.stdBrightness, 1)}</dd>
            <dt>Dynamic Range</dt>
            <dd>{formatNumber(statistics.dynamicRange, 1)}</dd>
          </dl>
        </InspectorSection>
      )}

      {hazardStats && (
        <InspectorSection title="Hazard Statistics">
          <div className="stat-bars">
            <StatBar label="Safe" value={hazardStats.safePercent} color="#3d7a4a" />
            <StatBar label="Moderate" value={hazardStats.moderatePercent} color="#8a7a3a" />
            <StatBar label="Dangerous" value={hazardStats.dangerousPercent} color="#9a5030" />
            <StatBar label="Extreme" value={hazardStats.extremePercent} color="#8a2020" />
          </div>
          <dl className="data-grid compact">
            <dt>Mean Score</dt>
            <dd>{(hazardStats.meanHazardScore * 100).toFixed(1)}%</dd>
          </dl>
        </InspectorSection>
      )}

      {iceStats && analysis.iceTarget && (
        <InspectorSection title="Ice Candidate">
          <dl className="data-grid">
            <dt>Regions</dt>
            <dd>{iceStats.candidateRegions}</dd>
            <dt>Max Probability</dt>
            <dd>{(iceStats.maxProbability * 100).toFixed(1)}%</dd>
            <dt>High Conf. Area</dt>
            <dd>{iceStats.highConfidencePercent.toFixed(1)}%</dd>
            <dt>Primary Target</dt>
            <dd>
              ({analysis.iceTarget.x}, {analysis.iceTarget.y})
            </dd>
          </dl>
        </InspectorSection>
      )}

      {analysis.landingSite && (
        <InspectorSection title="Landing Site">
          <dl className="data-grid">
            <dt>Position</dt>
            <dd>
              ({analysis.landingSite.x}, {analysis.landingSite.y})
            </dd>
            <dt>Geodetic</dt>
            <dd>
              {analysis.landingSite.lon.toFixed(4)}°E, {analysis.landingSite.lat.toFixed(4)}°N
            </dd>
            <dt>Suitability</dt>
            <dd className="highlight">{(analysis.landingSite.score * 100).toFixed(1)}%</dd>
          </dl>
          <p className="inspector-note">{analysis.landingSite.explanation}</p>
        </InspectorSection>
      )}

      {traverseMetrics && (
        <InspectorSection title="Traverse Metrics">
          <dl className="data-grid">
            <dt>Distance</dt>
            <dd>{formatNumber(traverseMetrics.distanceMeters, 1)} m</dd>
            <dt>Travel Time</dt>
            <dd>{formatNumber(traverseMetrics.travelTimeHours, 2)} hr</dd>
            <dt>Energy</dt>
            <dd>{formatNumber(traverseMetrics.energyConsumption, 0)} Wh</dd>
            <dt>Difficulty</dt>
            <dd className={`difficulty-${traverseMetrics.difficulty.toLowerCase()}`}>{traverseMetrics.difficulty}</dd>
          </dl>
        </InspectorSection>
      )}

      {missionScores && (
        <InspectorSection title="Mission Evaluation">
          <ScoreRow label="Feasibility" value={missionScores.missionFeasibility} />
          <ScoreRow label="Landing Safety" value={missionScores.landingSafety} />
          <ScoreRow label="Ice Access" value={missionScores.iceAccessibility} />
          <ScoreRow label="Traverse Eff." value={missionScores.traverseEfficiency} />
          <ScoreRow label="Op. Risk" value={missionScores.operationalRisk} invert />
          <div className={`recommendation rec-${missionScores.recommendation.replace(/\s/g, '-').toLowerCase()}`}>
            {missionScores.recommendation}
          </div>
          <ul className="notes-list">
            {missionScores.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </InspectorSection>
      )}
    </aside>
  );
}

function InspectorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="inspector-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-label">
        <span>{label}</span>
        <span>{value.toFixed(1)}%</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ScoreRow({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const display = invert ? 100 - value : value;
  const color = display >= 70 ? '#5a9a5a' : display >= 45 ? '#9a8a40' : '#9a5040';
  return (
    <div className="score-row">
      <span>{label}</span>
      <span style={{ color }}>{value.toFixed(1)}%</span>
    </div>
  );
}
