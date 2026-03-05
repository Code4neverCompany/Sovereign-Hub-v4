/**
 * 🛰️ Sovereign Hub v4.0 - SSE Bridge
 * Materialized by Dev (Phase 4)
 * Subscribed to OpenClaw /events
 */

export type IntelMessage = {
  timestamp: string;
  source: string;
  content: string;
  color?: string;
};

export class OpenClawBridge {
  private eventSource: EventSource | null = null;
  private url: string;
  private onMessageCallback: (data: IntelMessage) => void;

  constructor(onMessage: (data: IntelMessage) => void, url: string = '/events') {
    this.url = url;
    this.onMessageCallback = onMessage;
  }

  public connect() {
    if (this.eventSource) return;

    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      console.log('🛰️ SSE Neural Link Established');
      this.onMessageCallback({
        timestamp: new Date().toLocaleTimeString(),
        source: 'SYSTEM',
        content: 'Neural Link Established. Subscribed to /events.',
        color: 'var(--cyan)'
      });
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessageCallback({
          timestamp: new Date().toLocaleTimeString(),
          source: data.source || 'UNKNOWN',
          content: data.content || data.message || '',
          color: data.color
        });
      } catch (e) {
        console.error('🛰️ SSE Parse Error', e);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('🛰️ SSE Neural Link Error');
      // Simple reconnection logic could go here
    };
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  public async dispatch(action: string, params: any = {}) {
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, params }),
      });
      return await response.json();
    } catch (e) {
      console.error('🛰️ Dispatch Error', e);
      throw e;
    }
  }
}
