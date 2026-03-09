// PROJECTS/sovereign-hub/lib/sovereign-native/adapter.ts
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const WORKSPACE_DIR = '/home/skywork/workspace';
const OPENCLAW_CONFIG = '/home/skywork/.openclaw/openclaw.json';

export interface AgentState {
  agent_id: string;
  name: string;
  emoji: string;
  status: 'IDLE' | 'BUSY' | 'ERROR';
  active_task: string;
  model_engine: string;
  last_updated: string;
  progress?: number;
}

export interface LogEntry {
  timestamp: string;
  agent_id: string;
  agent_name?: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  meta: any;
}

export interface Task {
  id: string;
  agentId: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  status: 'INBOX' | 'PROGRESS' | 'REVIEW' | 'DONE';
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  meta: {
    progress: number;
    status: string;
    roi?: string;
  };
  created_at: string;
}

export interface ApprovalRequest {
  id: string;
  agent_id: string;
  action: string;
  payload: any;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  timestamp: string;
}

export class SovereignNativeAdapter {
  private static ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    ['logs', 'states', 'snapshots', 'approvals'].forEach(dir => {
      const p = path.join(DATA_DIR, dir);
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });
  }

  static async log(agentId: string, message: string, level: LogEntry['level'] = 'INFO', meta: any = {}) {
    this.ensureDir();
    const logEntry: LogEntry = { timestamp: new Date().toISOString(), agent_id: agentId, message, level, meta };
    fs.appendFileSync(path.join(DATA_DIR, 'logs', 'agent_logs.jsonl'), JSON.stringify(logEntry) + '\n');
  }

  static async getLogs(limit: number = 50) {
    const logPath = path.join(DATA_DIR, 'logs', 'agent_logs.jsonl');
    if (!fs.existsSync(logPath)) return [];
    return fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)).reverse().slice(0, limit);
  }

  static async updateState(state: Partial<AgentState> & { agent_id: string }) {
    this.ensureDir();
    const statePath = path.join(DATA_DIR, 'states', `${state.agent_id}.json`);
    const current = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};
    const newState = { ...current, ...state, last_updated: new Date().toISOString() };
    fs.writeFileSync(statePath, JSON.stringify(newState, null, 2));
    return newState;
  }

  static async getStates(): Promise<AgentState[]> {
    const dir = path.join(DATA_DIR, 'states');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  }

  static async getTasks(): Promise<Task[]> {
    const p = path.join(DATA_DIR, 'tasks.json');
    if (!fs.existsSync(p) || !fs.readFileSync(p, 'utf8')) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  static async getProjects(): Promise<Project[]> {
    const p = path.join(DATA_DIR, 'projects.json');
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  // 🛡️ Governance: Approval Engine
  static async getApprovals(): Promise<ApprovalRequest[]> {
    const p = path.join(DATA_DIR, 'approvals', 'pending.json');
    if (!fs.existsSync(p) || !fs.readFileSync(p, 'utf8')) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  static async resolveApproval(id: string, status: 'APPROVED' | 'DENIED') {
    const p = path.join(DATA_DIR, 'approvals', 'pending.json');
    if (!fs.existsSync(p)) return;
    let apps = JSON.parse(fs.readFileSync(p, 'utf8'));
    apps = apps.map((a: any) => a.id === id ? { ...a, status } : a);
    fs.writeFileSync(p, JSON.stringify(apps, null, 2));
    
    const resolved = apps.find((a: any) => a.id === id);
    await this.log('SYS', `Governance: Request ${id} ${status} by Sovereign.`, status === 'APPROVED' ? 'SUCCESS' : 'WARN');
    return resolved;
  }

  // 🛠️ Skill & Agent Management
  static async equipSkill(agentId: string, skillName: string) {
    this.ensureDir();
    const statePath = path.join(DATA_DIR, 'states', `${agentId}.json`);
    if (!fs.existsSync(statePath)) return;
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    state.skills = state.skills || [];
    if (!state.skills.includes(skillName)) {
      state.skills.push(skillName);
      fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    }
    await this.log(agentId, `Skill equipped: ${skillName}`, 'SUCCESS');
  }

  static async switchEngine(agentId: string, model: string) {
    await this.updateState({ agent_id: agentId, model_engine: model });
    await this.log(agentId, `Engine hot-swapped to: ${model}`, 'SUCCESS');
  }

  // 🧠 Memory Browser
  static async getMemoryFiles() {
    const memDir = path.join(WORKSPACE_DIR, 'memory');
    if (!fs.existsSync(memDir)) return [];
    return fs.readdirSync(memDir).filter(f => f.endsWith('.md')).map(f => ({
      name: f,
      path: `memory/${f}`,
      last_modified: fs.statSync(path.join(memDir, f)).mtime.toISOString()
    }));
  }

  // 🛠️ Skill Discovery
  static async getSkills() {
    const skillDirs = ['/app/skills', path.join(WORKSPACE_DIR, 'skills')];
    let allSkills: any[] = [];
    skillDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(s => {
          const p = path.join(dir, s, 'SKILL.md');
          if (fs.existsSync(p)) {
            allSkills.push({ name: s, path: p, source: dir.includes('app') ? 'SYSTEM' : 'USER' });
          }
        });
      }
    });
    return allSkills;
  }

  // ⚙️ Config Warden (Security-First)
  static async getConfig() {
    if (!fs.existsSync(OPENCLAW_CONFIG)) return {};
    const config = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));
    // Redact sensitive tokens before sending to UI
    const redact = (obj: any) => {
      for (let k in obj) {
        if (k.toLowerCase().includes('token') || k.toLowerCase().includes('key')) {
          obj[k] = 'REDACTED';
        } else if (typeof obj[k] === 'object') {
          redact(obj[k]);
        }
      }
    };
    const safeConfig = JSON.parse(JSON.stringify(config));
    redact(safeConfig);
    return safeConfig;
  }
}
