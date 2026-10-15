import type { MissionReportData } from '../types/mission';
import { formatCoord, formatNumber } from '../lib/imageUtils';

export function generateMissionReportText(data: MissionReportData): string {
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════════',
    '  LUNAR SOUTH POLAR MISSION PLANNING REPORT',
    '  Chandrayaan-2 OHRC Analysis — Decision Support Output',
    '═══════════════════════════════════════════════════════════════════',
    '',
    `Generated: ${new Date(data.generatedAt).toUTCString()}`,
    '',
    '─── 1. INPUT DATA ───',
  ];

  if (data.metadata) {
    lines.push(
      `  Source File:        ${data.metadata.filename}`,
      `  Sensor:             ${data.metadata.sensor}`,
      `  Dimensions:         ${data.metadata.width} × ${data.metadata.height} px`,
      `  Resolution:         ${data.metadata.resolutionMetersPerPixel} m/px`,
      `  Coordinate System:  ${data.metadata.coordinateSystem}`,
      `  Bounds (Lon/Lat):   [${formatCoord(data.metadata.bounds.minLon)}, ${formatCoord(data.metadata.bounds.minLat)}] — [${formatCoord(data.metadata.bounds.maxLon)}, ${formatCoord(data.metadata.bounds.maxLat)}]`,
      `  Ingestion Time:     ${data.metadata.uploadedAt}`,
    );
  } else {
    lines.push('  No input data available.');
  }

  if (data.statistics) {
    lines.push(
      '',
      '  Image Statistics:',
      `    Mean Brightness:  ${formatNumber(data.statistics.meanBrightness, 1)}`,
      `    Std Deviation:    ${formatNumber(data.statistics.stdBrightness, 1)}`,
      `    Dynamic Range:    ${formatNumber(data.statistics.dynamicRange, 1)}`,
      `    Pixel Count:      ${data.statistics.pixelCount.toLocaleString()}`,
    );
  }

  lines.push('', '─── 2. HAZARD ASSESSMENT ───');
  if (data.hazardStats) {
    lines.push(
      `  Safe Terrain:       ${data.hazardStats.safePercent.toFixed(1)}% (${data.hazardStats.safe.toLocaleString()} px)`,
      `  Moderate Hazard:    ${data.hazardStats.moderatePercent.toFixed(1)}% (${data.hazardStats.moderate.toLocaleString()} px)`,
      `  Dangerous:          ${data.hazardStats.dangerousPercent.toFixed(1)}% (${data.hazardStats.dangerous.toLocaleString()} px)`,
      `  Extreme:            ${data.hazardStats.extremePercent.toFixed(1)}% (${data.hazardStats.extreme.toLocaleString()} px)`,
      `  Mean Hazard Score:  ${(data.hazardStats.meanHazardScore * 100).toFixed(1)}%`,
    );
  } else {
    lines.push('  Hazard analysis not completed.');
  }

  lines.push('', '─── 3. ICE CANDIDATE ASSESSMENT ───');
  if (data.iceStats && data.iceTarget) {
    lines.push(
      `  Candidate Regions:  ${data.iceStats.candidateRegions}`,
      `  Mean Probability:   ${(data.iceStats.meanProbability * 100).toFixed(1)}%`,
      `  Max Probability:    ${(data.iceStats.maxProbability * 100).toFixed(1)}%`,
      `  High Confidence:    ${data.iceStats.highConfidencePercent.toFixed(1)}% coverage`,
      `  Primary Target:     (${data.iceTarget.x}, ${data.iceTarget.y}) — ${formatCoord(data.iceTarget.lon)}°E, ${formatCoord(data.iceTarget.lat)}°N`,
    );
  } else {
    lines.push('  Ice assessment not completed.');
  }

  lines.push('', '─── 4. LANDING SITE RECOMMENDATION ───');
  if (data.landingSite) {
    lines.push(
      `  Coordinates (px):   (${data.landingSite.x}, ${data.landingSite.y})`,
      `  Geodetic:           ${formatCoord(data.landingSite.lon)}°E, ${formatCoord(data.landingSite.lat)}°N`,
      `  Suitability Score:  ${(data.landingSite.score * 100).toFixed(1)}%`,
      '',
      '  Selection Rationale:',
      `  ${data.landingSite.explanation}`,
    );
  } else {
    lines.push('  Landing optimization not completed.');
  }

  lines.push('', '─── 5. TRAVERSE RECOMMENDATION ───');
  if (data.traverseMetrics) {
    lines.push(
      `  Path Length:        ${formatNumber(data.traverseMetrics.pathLengthPixels, 1)} px`,
      `  Distance:           ${formatNumber(data.traverseMetrics.distanceMeters, 1)} m`,
      `  Travel Time:        ${formatNumber(data.traverseMetrics.travelTimeHours, 2)} hr`,
      `  Energy Cost:        ${formatNumber(data.traverseMetrics.energyConsumption, 1)} Wh (est.)`,
      `  Difficulty:         ${data.traverseMetrics.difficulty}`,
    );
  } else {
    lines.push('  Traverse planning not completed.');
  }

  lines.push('', '─── 6. MISSION FEASIBILITY ───');
  if (data.scores) {
    lines.push(
      `  Mission Feasibility:    ${data.scores.missionFeasibility.toFixed(1)}%`,
      `  Landing Safety:         ${data.scores.landingSafety.toFixed(1)}%`,
      `  Ice Accessibility:      ${data.scores.iceAccessibility.toFixed(1)}%`,
      `  Traverse Efficiency:    ${data.scores.traverseEfficiency.toFixed(1)}%`,
      `  Operational Risk:       ${data.scores.operationalRisk.toFixed(1)}%`,
      '',
      `  RECOMMENDATION:         ${data.scores.recommendation.toUpperCase()}`,
      '',
      '  Operational Notes:',
      ...data.scores.notes.map((n) => `    • ${n}`),
    );
  } else {
    lines.push('  Mission evaluation not completed.');
  }

  lines.push(
    '',
    '═══════════════════════════════════════════════════════════════════',
    '  End of Report — Lunar Mission Ops v1.0',
    '═══════════════════════════════════════════════════════════════════',
  );

  return lines.join('\n');
}
