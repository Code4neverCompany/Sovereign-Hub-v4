import { NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const skills = await SovereignNativeAdapter.getSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
