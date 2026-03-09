// PROJECTS/sovereign-hub/lib/sovereign-native/recorder.ts
import { SovereignNativeAdapter, SnapshotEntry } from './adapter';
import * as diff from 'diff';

export class TraceRecorder {
  private static stepCounters: Record<string, number> = {};

  /**
   * Records a new neural event in the session trace.
   * [SH-1000] High-density temporal recording.
   */
  static async record(
    sessionId: string, 
    agentId: string, 
    type: SnapshotEntry['event_type'], 
    payload: any,
    fileChange?: { path: string, oldContent: string, newText: string }
  ) {
    if (!this.stepCounters[sessionId]) {
      this.stepCounters[sessionId] = 0;
    }

    let workspaceDiff = null;
    if (fileChange) {
      const patch = diff.createPatch(
        fileChange.path, 
        fileChange.oldContent, 
        fileChange.newText
      );
      workspaceDiff = {
        path: fileChange.path,
        patch: patch
      };
    }

    const snapshot = await SovereignNativeAdapter.recordSnapshot({
      session_id: sessionId,
      agent_id: agentId,
      step_index: this.stepCounters[sessionId]++,
      event_type: type,
      payload,
      workspace_diff: workspaceDiff
    });

    return snapshot;
  }

  /**
   * Specialized method for thought streams
   */
  static async thought(sessionId: string, agentId: string, thought: string) {
    return this.record(sessionId, agentId, 'THOUGHT', { text: thought });
  }

  /**
   * Specialized method for tool operations
   */
  static async tool(sessionId: string, agentId: string, tool: string, args: any, result?: any) {
    return this.record(sessionId, agentId, result ? 'TOOL_RESULT' : 'TOOL_CALL', { tool, args, result });
  }
}
