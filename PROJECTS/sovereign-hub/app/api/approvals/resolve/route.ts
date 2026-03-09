import { NextRequest, NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    
    const result = await SovereignNativeAdapter.resolveApproval(id, status);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve approval' }, { status: 500 });
  }
}
