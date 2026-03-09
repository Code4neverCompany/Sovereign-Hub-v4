// PROJECTS/sovereign-hub/app/api/states/route.ts
import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let agents = await SovereignNativeAdapter.getStates();
    
    // Seed default agents if none exist
    if (agents.length === 0) {
      const defaultAgents = [
        { agent_id: 'alex', name: 'Alex', emoji: '🦾', status: 'IDLE', active_task: 'Awaiting directive...', model_engine: 'Llama 3 70B' },
        { agent_id: 'maya', name: 'Maya', emoji: '🎨', status: 'IDLE', active_task: 'Awaiting design directive...', model_engine: 'Claude 3.5 Opus' },
        { agent_id: 'jordan', name: 'Jordan', emoji: '📈', status: 'IDLE', active_task: 'Scanning market trends...', model_engine: 'GPT-4o' },
        { agent_id: 'dev', name: 'Dev', emoji: '💻', status: 'IDLE', active_task: 'Standby for implementation...', model_engine: 'DeepSeek Coder' },
        { agent_id: 'sam', name: 'Sam', emoji: '🛡️', status: 'IDLE', active_task: 'Monitoring system integrity...', model_engine: 'Mistral Large' }
      ];
      
      for (const agent of defaultAgents) {
        // @ts-ignore
        await SovereignNativeAdapter.updateState(agent);
      }
      agents = await SovereignNativeAdapter.getStates();
    }
      
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('States API error:', error);
    return NextResponse.json({ error: 'Failed to read agent states' }, { status: 500 });
  }
}
