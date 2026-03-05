import { supabase } from '@/lib/supabase'

export interface TelemetryNodeLog {
  id: string;
  source_node: string;
  target_node: string;
  data_type: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  timestamp: string;
}

export async function logTelemetry(log: Omit<TelemetryNodeLog, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('telemetry_node_logs')
    .insert([log])
    .select();
  
  if (error) {
    console.error('Error logging telemetry:', error);
    return null;
  }
  return data?.[0];
}
