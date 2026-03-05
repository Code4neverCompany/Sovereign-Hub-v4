import { logToSupabase } from './lib/supabase';

async function test() {
  console.log('Testing Supabase Logging for Dispatch...');
  const testLog = {
    agent_id: 'sam-audit',
    message: 'AUDIT: Simulated Dispatch Test SH-005.1',
    level: 'INFO',
    timestamp: new Date().toISOString(),
  };
  
  try {
    // We can't really run this without the ENV vars, but I can check if it compiles
    console.log('Payload ready:', JSON.stringify(testLog));
  } catch (e) {
    console.error(e);
  }
}

test();
