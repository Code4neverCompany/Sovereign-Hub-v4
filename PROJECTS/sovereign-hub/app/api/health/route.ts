export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';

export async function GET() {
  const tailscaleSocket = "/home/skywork/workspace/tailscale/tailscaled.sock";
  const tailscaleStatus = fs.existsSync(tailscaleSocket) ? 'ONLINE' : 'OFFLINE';
  
  const status = {
    timestamp: new Date().toISOString(),
    tailscale: tailscaleStatus,
    node: 'ONLINE', // If this API responds, Node is running
  };

  try {
    // Log to Supabase first
    await supabase
      .from('system_health')
      .insert([status]);
  } catch (err) {
    console.error('Supabase logging failed:', err);
  }

  return NextResponse.json(status);
}
