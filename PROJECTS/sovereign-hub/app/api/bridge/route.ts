export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { logToSupabase, calculateHash } from '../../../lib/supabase';
import fs from 'fs/promises';
import path from 'path';

// Define the absolute path to the quantum vault
const VAULT_PATH = path.join(process.cwd(), 'BRAIN/quantum-vault/journals');

/**
 * UPLINK: Mission Intel Stream -> Journal Append
 */
export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  try {
    const { message, agent_id, level = 'info' } = await req.json();

    if (!agent_id || !message) {
      return NextResponse.json({ error: 'agent_id and message are required' }, { status: 400 });
    }

    // 1. Calculate Verification Hash
    const logData = { agent_id, message, level, timestamp };
    const hash = calculateHash(logData);

    // 2. Log to Supabase (Source of Truth for verification)
    await logToSupabase({ ...logData, hash });

    // 3. Append to Local Journal (.jsonl)
    const filename = `${agent_id}.jsonl`;
    const filePath = path.join(VAULT_PATH, filename);
    
    // Ensure the directory exists
    await fs.mkdir(VAULT_PATH, { recursive: true });

    const signedEntry = JSON.stringify({ ...logData, hash }) + '\n';
    await fs.appendFile(filePath, signedEntry);

    return NextResponse.json({ 
      status: 'success', 
      message: 'Intel archived in Memory Bridge',
      hash 
    });
  } catch (error: any) {
    console.error('Bridge Uplink Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

/**
 * DOWNLINK: Dashboard Rehydration -> Journal Fetch
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agent_id = searchParams.get('agent_id');

  if (!agent_id) {
    return NextResponse.json({ error: 'agent_id required for downlink' }, { status: 400 });
  }

  try {
    const filePath = path.join(VAULT_PATH, `${agent_id}.jsonl`);
    
    let logs = [];
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      logs = content.trim().split('\n').filter(Boolean).map(line => {
        const entry = JSON.parse(line);
        // Verify integrity during read (Red-Green-Refactor principle)
        const { hash, ...data } = entry;
        const computed = calculateHash(data);
        return { ...entry, verified: computed === hash };
      });
    } catch (e) {
      // File missing means empty history for this agent
      logs = [];
    }

    return NextResponse.json({ 
      agent_id, 
      count: logs.length,
      logs 
    });
  } catch (error: any) {
    console.error('Bridge Downlink Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
