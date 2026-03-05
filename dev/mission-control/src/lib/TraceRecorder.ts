/**
 * 🛰️ TraceRecorder.ts
 * Background listener for OpenClaw /events to capture neural snapshots.
 * Part of Sovereign Hub v4.0 (SH-1000)
 */

import { IntelMessage } from './openclaw-bridge';

export interface NeuralSnapshot {
    session_id: string;
    agent_id: string;
    step_index: number;
    event_type: 'THOUGHT' | 'TOOL_CALL' | 'TOOL_RESULT' | 'STATE_CHANGE' | 'ERROR';
    payload: any;
    workspace_diff?: any;
    metadata?: any;
    timestamp?: string;
}

export class TraceRecorder {
    private sessionId: string;
    private stepCounter: number = 0;
    private buffer: NeuralSnapshot[] = [];
    private flushInterval: number = 500; // ms
    private timer: any = null;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
    }

    public recordEvent(event: any) {
        const snapshot: NeuralSnapshot = {
            session_id: this.sessionId,
            agent_id: event.agent_id || 'UNKNOWN',
            step_index: this.stepCounter++,
            event_type: this.mapEventType(event.type),
            payload: event.payload || event.message || event,
            workspace_diff: event.diff || null,
            metadata: {
                model: event.model,
                tokens: event.usage,
                latency: event.latency
            }
        };

        this.buffer.push(snapshot);
        this.startTimer();
    }

    private mapEventType(type: string): NeuralSnapshot['event_type'] {
        switch (type) {
            case 'thought': return 'THOUGHT';
            case 'call': return 'TOOL_CALL';
            case 'result': return 'TOOL_RESULT';
            case 'state': return 'STATE_CHANGE';
            case 'error': return 'ERROR';
            default: return 'THOUGHT';
        }
    }

    private startTimer() {
        if (this.timer) return;
        this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }

    private async flush() {
        if (this.buffer.length === 0) {
            this.timer = null;
            return;
        }

        const batch = [...this.buffer];
        this.buffer = [];
        this.timer = null;

        try {
            await fetch('/api/trace/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ snapshots: batch })
            });
        } catch (e) {
            console.error('🛰️ TraceRecorder Flush Error:', e);
            // Re-queue on failure? Or just log.
        }
    }
}
