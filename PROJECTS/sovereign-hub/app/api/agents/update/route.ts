import { NextRequest, NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../../lib/sovereign-native/adapter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { agentId, skillName, model } = await req.json();
    
    if (skillName) {
      await SovereignNativeAdapter.equipSkill(agentId, skillName);
      return NextResponse.json({ success: true, message: `Skill ${skillName} equipped.` });
    }
    
    if (model) {
      await SovereignNativeAdapter.switchEngine(agentId, model);
      return NextResponse.json({ success: true, message: `Engine switched to ${model}.` });
    }

    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}
