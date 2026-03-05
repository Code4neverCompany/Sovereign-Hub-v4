import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AgentLog {
  agent_id: string;
  message: string;
  level: string;
  timestamp: string;
  hash?: string;
}

export interface AgentState {
  agent_id: string;
  name: string;
  emoji: string;
  model_engine: string;
  status: AgentStatus;
  active_task?: string;
  last_updated: string;
}

export type AgentStatus = 'IDLE' | 'BUSY' | 'ERROR' | 'OFFLINE';

export function calculateHash(log: Omit<AgentLog, 'hash'>): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(log))
    .digest('hex');
}

export async function logToSupabase({ agent_id, message, level, timestamp, hash }: AgentLog) {
    try {
        const { error } = await supabase
            .from('agent_logs')
            .insert([{ agent_id, message, level, timestamp, hash }])
        if (error) throw error
    } catch (e) {
        console.error('Failed to log to Supabase', e)
    }
}

export function subscribeToLogs(callback: (payload: any) => void) {
  return supabase
    .channel('agent_logs_realtime')
    .on('postgres_changes', { event: 'INSERT', table: 'agent_logs' }, callback)
    .subscribe();
}

export function subscribeToAgentStates(callback: (payload: any) => void) {
  return supabase
    .channel('agent_states_realtime')
    .on('postgres_changes', { event: 'UPDATE', table: 'agent_states' }, callback)
    .subscribe();
}

export async function updateAgentState(agent_id: string, updates: Partial<AgentState>) {
  try {
    const { error } = await supabase
      .from('agent_states')
      .update(updates)
      .eq('agent_id', agent_id);
    if (error) throw error;
  } catch (e) {
    console.error(`Failed to update agent state for ${agent_id}`, e);
  }
}
