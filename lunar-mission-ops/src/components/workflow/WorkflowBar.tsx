import { useMissionStore } from '../../store/missionStore';
import { WORKFLOW_STEPS, type WorkflowStep } from '../../types/mission';

export function WorkflowBar() {
  const workflowStep = useMissionStore((s) => s.workflowStep);
  const metadata = useMissionStore((s) => s.metadata);
  const analysis = useMissionStore((s) => s.analysis);
  const setWorkflowStep = useMissionStore((s) => s.setWorkflowStep);

  const stepComplete = (id: WorkflowStep): boolean => {
    switch (id) {
      case 'ingestion':
        return !!metadata;
      case 'hazard':
        return !!analysis.hazardClass;
      case 'ice':
        return !!analysis.iceProbability;
      case 'landing':
        return !!analysis.landingSite;
      case 'traverse':
        return !!analysis.roverPath;
      case 'evaluation':
        return analysis.missionFeasibility > 0;
      default:
        return false;
    }
  };

  const currentIdx = WORKFLOW_STEPS.findIndex((s) => s.id === workflowStep);

  return (
    <nav className="workflow-bar" aria-label="Mission workflow">
      {WORKFLOW_STEPS.map((step, i) => {
        const complete = stepComplete(step.id);
        const active = step.id === workflowStep;
        const accessible = i === 0 || stepComplete(WORKFLOW_STEPS[i - 1].id) || complete;

        return (
          <button
            key={step.id}
            type="button"
            className={`wf-step ${active ? 'active' : ''} ${complete ? 'complete' : ''} ${accessible ? '' : 'locked'}`}
            onClick={() => accessible && setWorkflowStep(step.id)}
            disabled={!accessible}
            title={step.label}
          >
            <span className="wf-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="wf-label">{step.label}</span>
            {i < WORKFLOW_STEPS.length - 1 && (
              <span className={`wf-connector ${i < currentIdx ? 'done' : ''}`} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
