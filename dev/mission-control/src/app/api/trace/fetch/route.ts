import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get('session_id');

  // MOCK DATA for SH-1000 Demonstration
  const snapshots = [
    {
      step_index: 0,
      event_type: 'THOUGHT',
      payload: "Initializing Sovereign Hub v4.0 architecture...",
      timestamp: new Date().toISOString()
    },
    {
      step_index: 1,
      event_type: 'TOOL_CALL',
      payload: { tool: 'read_file', path: 'ARCHITECTURE_SH1000.md' },
      timestamp: new Date().toISOString()
    },
    {
      step_index: 2,
      event_type: 'STATE_CHANGE',
      payload: { workspace: 'Updated neural trace logic.' },
      workspace_diff: { old: 'null', new: 'TraceRecorder.ts' },
      timestamp: new Date().toISOString()
    },
    {
      step_index: 3,
      event_type: 'THOUGHT',
      payload: "Neural Trace recording active. Beginning materialization of Time-Machine UI.",
      timestamp: new Date().toISOString()
    },
    {
        step_index: 4,
        event_type: 'TOOL_CALL',
        payload: { tool: 'write_file', path: 'SentinelTrace.tsx', content: 'export default function SentinelTrace()...' },
        timestamp: new Date().toISOString()
    },
    {
        step_index: 5,
        event_type: 'STATE_CHANGE',
        payload: { status: 'PHASE 4: MATERIALIZATION_IN_PROGRESS' },
        workspace_diff: { modified: 'index.html', component: 'TemporalEngine' },
        timestamp: new Date().toISOString()
    }
  ];

  return NextResponse.json({ snapshots });
}
