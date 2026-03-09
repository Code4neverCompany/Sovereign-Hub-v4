import { NextResponse } from 'next/server';
import os from 'os';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.round((usedMem / totalMem) * 100);

    const cpus = os.cpus();
    const loadAvg = os.loadavg()[0]; // 1 minute load average
    const cpuCount = cpus.length;
    const cpuUsage = Math.min(100, Math.round((loadAvg / cpuCount) * 100));

    const uptime = os.uptime();

    return NextResponse.json({
      cpu: {
        usage: cpuUsage,
        model: cpus[0].model,
        cores: cpuCount
      },
      memory: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usagePercent: memUsage
      },
      system: {
        uptime: Math.floor(uptime / 3600) + 'h ' + Math.floor((uptime % 3600) / 60) + 'm',
        platform: os.platform(),
        arch: os.arch()
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 });
  }
}
