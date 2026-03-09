import { NextRequest, NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { agentId, agentName, description, priority } = await req.json();

    // 🔱 Sovereign-Native Dispatch: OpenClaw backend integration
    await SovereignNativeAdapter.log(
      'SYS', 
      `Dispatching agent: ${agentName} for task: ${description}`, 
      'INFO', 
      { agentId, priority }
    );

    const task = await SovereignNativeAdapter.addTask({
      agentId,
      description,
      priority: priority || 'MEDIUM'
    });

    console.log(`[OpenClaw Native] Mission dispatched: ${task.id} for agent: ${agentId}`);

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('Dispatch API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
