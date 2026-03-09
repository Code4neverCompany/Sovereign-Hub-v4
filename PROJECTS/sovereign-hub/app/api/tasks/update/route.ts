import { NextRequest, NextResponse } from 'next/server';
import { SovereignNativeAdapter } from '../../../../lib/sovereign-native/adapter';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    
    const DATA_DIR = path.join(process.cwd(), 'data');
    const p = path.join(DATA_DIR, 'tasks.json');
    if (!fs.existsSync(p)) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    let tasks = JSON.parse(fs.readFileSync(p, 'utf8'));
    tasks = tasks.map((t: any) => t.id === id ? { ...t, status } : t);
    fs.writeFileSync(p, JSON.stringify(tasks, null, 2));
    
    await SovereignNativeAdapter.log('SYS', `Task ${id} moved to ${status}.`, 'INFO');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
