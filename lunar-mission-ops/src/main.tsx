import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MissionWorkspace } from './components/MissionWorkspace';
import './styles/mission-ops.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MissionWorkspace />
  </StrictMode>,
);
