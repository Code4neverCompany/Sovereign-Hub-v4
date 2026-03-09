import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await SovereignNativeAdapter.getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
