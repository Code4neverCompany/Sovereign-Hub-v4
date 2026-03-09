import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LOGS_DIR = path.join(DATA_DIR, 'logs');
const STATES_DIR = path.join(DATA_DIR, 'states');

// Ensure directories exist
[DATA_DIR, LOGS_DIR, STATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export interface SovereignLog {
  agent_id: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  timestamp: string;
  meta?: any;
}

export const SovereignNative = {
  // Replacement for Supabase .from('agent_logs').insert()
  async log(entry: SovereignLog) {
    const fileName = `agent-${entry.agent_id.toLowerCase()}.jsonl`;
    const filePath = path.join(LOGS_DIR, fileName);
    const globalPath = path.join(DATA_DIR, 'activities.jsonl');
    
    const line = JSON.stringify({ ...entry, timestamp: entry.timestamp || new Date().toISOString() }) + '\n';
    
    fs.appendFileSync(filePath, line);
    fs.appendFileSync(globalPath, line);
    
    return { error: null };
  },

  // Replacement for Supabase .from('agent_states').upsert()
  async updateState(agent_id: string, state: any) {
    const filePath = path.join(STATES_DIR, `${agent_id.toLowerCase()}.json`);
    const data = {
      agent_id,
      ...state,
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { error: null };
  },

  // Fetch all projects (Saturation HUD replacement)
  async getProjects() {
    const projectsPath = path.join(DATA_DIR, 'projects.json');
    if (!fs.existsSync(projectsPath)) return { data: [], error: null };
    
    const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    return { data, error: null };
  }
};
