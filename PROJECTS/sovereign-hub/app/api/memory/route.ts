import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const files = await SovereignNativeAdapter.getMemoryFiles();
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memory files' }, { status: 500 });
  }
}
