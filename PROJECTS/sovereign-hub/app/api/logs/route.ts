import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await SovereignNativeAdapter.getLogs(100);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Logs API error:', error);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
