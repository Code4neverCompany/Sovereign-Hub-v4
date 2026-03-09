// PROJECTS/sovereign-hub/components/Office3D/agentsConfig.ts
export interface AgentState {
  id: string;
  status: string;
  currentTask?: string;
  model?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
}

export const AGENTS: AgentConfig[] = [
  { id: 'ALEX', name: 'Alex', position: [-2, 0, -2], color: '#3B82F6' },
  { id: 'DEV', name: 'Dev', position: [2, 0, -2], color: '#10B981' },
  { id: 'JORDAN', name: 'Jordan', position: [-3, 0, 1], color: '#F59E0B' },
  { id: 'MAYA', name: 'Maya', position: [3, 0, 1], color: '#EC4899' },
  { id: 'SENTINEL', name: 'Sentinel', position: [0, 0, 3], color: '#EF4444' }
];
