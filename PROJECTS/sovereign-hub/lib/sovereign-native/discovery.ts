import fs from 'fs';
import path from 'path';

// The source of truth for OpenClaw
const OPENCLAW_CONFIG = '/home/skywork/.openclaw/openclaw.json';

export const AgentDiscovery = {
  async getAgents() {
    try {
      if (!fs.existsSync(OPENCLAW_CONFIG)) {
        console.error("OpenClaw configuration not found at:", OPENCLAW_CONFIG);
        return [];
      }

      const config = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));
      const agentsList = config.agents?.list || [];

      // Map OpenClaw agents to Sovereign Hub UI format
      return agentsList.map((agent: any) => ({
        id: agent.id,
        name: agent.identity?.name || agent.name,
        emoji: agent.identity?.emoji || '🤖',
        workspace: agent.workspace,
        model: agent.model,
        status: 'ONLINE', // Initial status
        role: agent.id === 'main' ? 'Orchestrator' : 'Specialist'
      }));
    } catch (error) {
      console.error("Failed to discover agents:", error);
      return [];
    }
  }
};
