import { NextRequest, NextResponse } from 'next/server';

/**
 * 🛰️ MISSION CONTROL - AGENT DISPATCH API
 * Materialized by Dev (Phase 4.5)
 * Handles POST requests from the Sovereign Hub to trigger OpenClaw actions.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, params } = body;

    console.log(`[DISPATCH] Action: ${action}`, params);

    // Simulate/Proxy agent activation
    // In a real OpenClaw environment, this would hit the gateway's REST API or a socket.
    // For now, we simulate success and log the dispatch event.
    
    // Simulating a delay to mimic network/agent startup
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (action === 'ACTIVATE_AGENT' && params?.agent === 'ALEX') {
      return NextResponse.json({
        success: true,
        message: 'ALEX [ARCHITECT] Activated.',
        timestamp: new Date().toISOString(),
        dispatch_id: `ax-${Math.random().toString(36).substr(2, 9)}`
      });
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' dispatched successfully.`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[DISPATCH ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown dispatch error' },
      { status: 500 }
    );
  }
}
