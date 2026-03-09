import { NextRequest, NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    const snapshots = await SovereignNativeAdapter.getSnapshots(sessionId);
    return NextResponse.json({ snapshots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read snapshots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const entry = await req.json();
    const snapshot = await SovereignNativeAdapter.recordSnapshot(entry);
    return NextResponse.json({ success: true, snapshot });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record snapshot' }, { status: 500 });
  }
}
