export const dynamic = 'force-static';

import { NextRequest, NextResponse } from 'next/server';
import { logToSupabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { agentId, agentName } = await req.json();

    // Log to Supabase first as requested
    await logToSupabase({
      agent_id: agentId,
      message: `Dispatching agent: ${agentName}`,
      level: 'INFO',
      timestamp: new Date().toISOString(),
    });

    // Integrated with OpenClaw session_spawn tool (simulated for now as actual tool access is via system calling)
    // In a real environment, this might call an OpenClaw Gateway API or use an internal library
    console.log(`[OpenClaw] Spawning session for agent: ${agentId}`);

    return NextResponse.json({ success: true, message: `Agent ${agentName} dispatched.` });
  } catch (error: any) {
    console.error('Dispatch API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
