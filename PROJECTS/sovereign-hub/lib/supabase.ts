// 🔱 SOVEREIGN HUB: GHOST-BACKEND ADAPTER
// This file replaces the real Supabase client with a local file-based implementation.
// All agents and UI components will now use this for persistence.

import fs from 'fs';
import path from 'path';

// Note: In Next.js App Router, these functions run on the server.
const DATA_DIR = path.resolve(process.cwd(), 'data');
const LOGS_PATH = path.join(DATA_DIR, 'activities.jsonl');
const STATES_DIR = path.join(DATA_DIR, 'states');

// Helper to ensure data directory exists
const ensureStorage = () => {
  if (!fs.existsSync(STATES_DIR)) fs.mkdirSync(STATES_DIR, { recursive: true });
};

export const supabase = {
  from: (table: string) => ({
    insert: async (records: any[]) => {
      ensureStorage();
      if (table === 'agent_logs') {
        const lines = records.map(r => JSON.stringify({ ...r, timestamp: r.timestamp || new Date().toISOString() })).join('\n') + '\n';
        fs.appendFileSync(LOGS_PATH, lines);
      }
      return { data: null, error: null };
    },
    upsert: async (records: any[], options: any) => {
      ensureStorage();
      if (table === 'agent_states') {
        records.forEach(r => {
          const filePath = path.join(STATES_DIR, `${r.agent_id.toLowerCase()}.json`);
          fs.writeFileSync(filePath, JSON.stringify({ ...r, updated_at: new Date().toISOString() }, null, 2));
        });
      }
      if (table === 'projects') {
        records.forEach(r => {
          const filePath = path.join(DATA_DIR, `project-${r.name.toLowerCase()}.json`);
          fs.writeFileSync(filePath, JSON.stringify({ ...r, updated_at: new Date().toISOString() }, null, 2));
        });
      }
      return { data: null, error: null };
    },
    select: (query: string) => ({
      limit: (n: number) => ({
        order: (col: string, opts: any) => ({
          // Mock select for UI hydration
          then: (cb: any) => cb({ data: [], error: null })
        }),
        then: (cb: any) => cb({ data: [], error: null })
      }),
      then: (cb: any) => cb({ data: [], error: null })
    }),
    update: (updates: any) => ({
      eq: (col: string, val: any) => ({
        then: (cb: any) => {
          ensureStorage();
          if (table === 'agent_states' && col === 'agent_id') {
             const filePath = path.join(STATES_DIR, `${val.toLowerCase()}.json`);
             let existing = {};
             if (fs.existsSync(filePath)) existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
             fs.writeFileSync(filePath, JSON.stringify({ ...existing, ...updates, updated_at: new Date().toISOString() }, null, 2));
          }
          return cb({ error: null });
        }
      })
    })
  }),
  channel: (name: string) => ({
    on: (event: string, filter: any, cb: any) => ({
      subscribe: () => ({ unsubscribe: () => {} })
    }),
    subscribe: () => {}
  })
};

// Original interface maintained for compatibility
export async function logToSupabase(log: any) {
    return supabase.from('agent_logs').insert([log]);
}

export async function updateAgentState(agent_id: string, updates: any) {
    return supabase.from('agent_states').update(updates).eq('agent_id', agent_id);
}
