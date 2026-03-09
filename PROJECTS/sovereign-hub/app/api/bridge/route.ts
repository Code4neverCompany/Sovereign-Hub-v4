export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define paths
const VAULT_PATH = path.join(process.cwd(), 'BRAIN/quantum-vault/journals');
const HUB_DATA_PATH = path.join(process.cwd(), 'data');

/**
 * SOVEREIGN UPLINK: Mission Intel Stream -> Local Journal Append
 */
export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  try {
    const payload = await req.json();
    
    // Support both direct payloads and {action, data} payloads from the v8.0 adapter
    const data = payload.action === 'LOG' ? payload.data : payload;
    const { message, agent_id, level = 'INFO' } = data;

    if (!agent_id || !message) {
      return NextResponse.json({ error: 'agent_id and message are required' }, { status: 400 });
    }

    const logEntry = { agent_id, message, level, timestamp };

    // 1. Append to Global Hub Activity (.jsonl)
    const globalPath = path.join(HUB_DATA_PATH, 'activities.jsonl');
    await fs.mkdir(HUB_DATA_PATH, { recursive: true });
    await fs.appendFile(globalPath, JSON.stringify(logEntry) + '\n');

    // 2. Append to Agent-Specific Journal in Quantum Vault
    const agentFilename = `${agent_id.toLowerCase()}.jsonl`;
    const vaultPath = path.join(VAULT_PATH, agentFilename);
    await fs.mkdir(VAULT_PATH, { recursive: true });
    await fs.appendFile(vaultPath, JSON.stringify(logEntry) + '\n');

    return NextResponse.json({ 
      status: 'success', 
      message: 'Intel archived in Sovereign Native Stack',
      agent_id 
    });
  } catch (error: any) {
    console.error('Sovereign Bridge Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

/**
 * DOWNLINK: Dashboard Rehydration
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agent_id = searchParams.get('agent_id');

  const targetPath = agent_id 
    ? path.join(VAULT_PATH, `${agent_id.toLowerCase()}.jsonl`)
    : path.join(HUB_DATA_PATH, 'activities.jsonl');

  try {
    let logs = [];
    try {
      const content = await fs.readFile(targetPath, 'utf-8');
      logs = content.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
    } catch (e) {
      logs = [];
    }

    return NextResponse.json({ 
      count: logs.length,
      logs: logs.reverse().slice(0, 50) 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
