import { MapCanvas } from './canvas/MapCanvas';
import { InspectorPanel } from './panels/InspectorPanel';
import { LayerPanel } from './panels/LayerPanel';
import { MissionReportModal } from './report/MissionReportModal';
import { MissionToolbar } from './toolbar/MissionToolbar';
import { WorkflowBar } from './workflow/WorkflowBar';
import { WorkflowDetail } from './workflow/WorkflowDetail';

export function MissionWorkspace() {
  return (
    <div className="mission-app">
      <MissionToolbar />
      <WorkflowBar />
      <div className="mission-body">
        <LayerPanel />
        <main className="workspace-main">
          <MapCanvas />
          <WorkflowDetail />
        </main>
        <InspectorPanel />
      </div>
      <MissionReportModal />
    </div>
  );
}
