import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const approvals = await SovereignNativeAdapter.getApprovals();
    return NextResponse.json({ approvals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
  }
}
