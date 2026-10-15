import { generateMissionReportText } from '../../lib/reportGenerator';
import { useMissionStore } from '../../store/missionStore';

export function MissionReportModal() {
  const reportOpen = useMissionStore((s) => s.reportOpen);
  const setReportOpen = useMissionStore((s) => s.setReportOpen);
  const getReportData = useMissionStore((s) => s.getReportData);

  if (!reportOpen) return null;

  const text = generateMissionReportText(getReportData());

  return (
    <div className="modal-overlay" onClick={() => setReportOpen(false)}>
      <div className="modal report-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Mission Report</h2>
          <button type="button" className="modal-close" onClick={() => setReportOpen(false)}>
            ×
          </button>
        </header>
        <pre className="report-content">{text}</pre>
        <footer className="modal-footer">
          <button type="button" className="tb-btn" onClick={() => setReportOpen(false)}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
