import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await SovereignNativeAdapter.getConfig();
    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}
