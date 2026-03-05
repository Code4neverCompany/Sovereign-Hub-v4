import { logToSupabase } from '../lib/supabase';

async function main() {
  try {
    await logToSupabase({
      agent_id: 'SYSTEM-DEV',
      message: 'MISSION COMPLETE: Implementation of the Aesthetic Restoration (v3.2 LUX). Globals updated, layout cinematic, components refactored to .glass-panel, and full production build exported to public/.',
      level: 'INFO',
      timestamp: new Date().toISOString()
    });
    console.log('Final log sent to Supabase.');
  } catch (error) {
    console.error('Failed to log to Supabase:', error);
    process.exit(1);
  }
}

main();
