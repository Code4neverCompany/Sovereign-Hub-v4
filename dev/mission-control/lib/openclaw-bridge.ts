/**
 * 🔱 OpenClaw Neural Link Bridge 🔱
 * Mission Control Dashboard - Sovereign Hub v3.9
 * 
 * Purpose: Establish WebSocket connection to OpenClaw Gateway
 * for live telemetry streaming to the Mission Control Dashboard.
 * 
 * Developer: Dev | Phase: 4 | Protocol: BMad FAB-WP
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// === TYPE DEFINITIONS ===
export interface TelemetryData {
  timestamp: string;
  source: string;
  event: string;
  payload: Record<string, any>;
  metadata?: {
    sessionId?: string;
    agentId?: string;
    nodeId?: string;
  };
}

export interface OpenClawConfig {
  gatewayUrl?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export interface NeuralLinkStatus {
  connected: boolean;
  lastHeartbeat: Date | null;
  reconnectAttempts: number;
  activeStreams: number;
}

// === OPENCLAW NEURAL LINK CLASS ===
export class OpenClawBridge {
  private ws: WebSocket | null = null;
  private supabase: SupabaseClient | null = null;
  private config: Required<OpenClawConfig>;
  private status: NeuralLinkStatus;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: TelemetryData) => void>>;

  constructor(config: OpenClawConfig = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY || 'ws://localhost:3000/ws',
      supabaseUrl: config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey: config.supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      reconnectInterval: config.reconnectInterval || 5000,
      heartbeatInterval: config.heartbeatInterval || 30000,
    };

    this.status = {
      connected: false,
      lastHeartbeat: null,
      reconnectAttempts: 0,
      activeStreams: 0,
    };

    this.listeners = new Map();

    // Initialize Supabase if credentials provided
    if (this.config.supabaseUrl && this.config.supabaseKey) {
      this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseKey);
    }
  }

  /**
   * Connect to OpenClaw Gateway via WebSocket
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Only create WebSocket in browser environment
        if (typeof window === 'undefined') {
          console.warn('[Neural Link] WebSocket only available in browser');
          return reject(new Error('WebSocket not available in server environment'));
        }

        this.ws = new WebSocket(this.config.gatewayUrl);

        this.ws.onopen = () => {
          console.log('🔱 [Neural Link] Connected to OpenClaw Gateway');
          this.status.connected = true;
          this.status.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('🔱 [Neural Link] WebSocket error:', error);
          this.status.connected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.warn('🔱 [Neural Link] Connection closed');
          this.status.connected = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (error) {
        console.error('🔱 [Neural Link] Failed to connect:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from OpenClaw Gateway
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.status.connected = false;
  }

  /**
   * Subscribe to telemetry events
   */
  public subscribe(eventType: string, callback: (data: TelemetryData) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    this.status.activeStreams++;

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(eventType);
        }
        this.status.activeStreams--;
      }
    };
  }

  /**
   * Send telemetry to OpenClaw Gateway
   */
  public send(event: string, payload: Record<string, any>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[Neural Link] Cannot send - not connected');
      return;
    }

    const message: TelemetryData = {
      timestamp: new Date().toISOString(),
      source: 'mission-control',
      event,
      payload,
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Log telemetry to Supabase
   */
  public async logToSupabase(data: TelemetryData): Promise<void> {
    if (!this.supabase) {
      console.warn('[Neural Link] Supabase not configured');
      return;
    }

    try {
      const { error } = await this.supabase
        .from('telemetry_logs')
        .insert({
          timestamp: data.timestamp,
          source: data.source,
          event: data.event,
          payload: data.payload,
          metadata: data.metadata,
        });

      if (error) {
        console.error('[Neural Link] Supabase log error:', error);
      }
    } catch (error) {
      console.error('[Neural Link] Failed to log to Supabase:', error);
    }
  }

  /**
   * Get current status
   */
  public getStatus(): NeuralLinkStatus {
    return { ...this.status };
  }

  // === PRIVATE METHODS ===

  private handleMessage(data: string): void {
    try {
      const telemetry: TelemetryData = JSON.parse(data);
      
      // Update heartbeat
      this.status.lastHeartbeat = new Date();

      // Notify subscribers
      const listeners = this.listeners.get(telemetry.event) || new Set();
      const allListeners = this.listeners.get('*') || new Set();
      
      [...listeners, ...allListeners].forEach(callback => {
        try {
          callback(telemetry);
        } catch (error) {
          console.error('[Neural Link] Listener error:', error);
        }
      });

      // Optional: Log to Supabase
      if (this.supabase) {
        this.logToSupabase(telemetry);
      }
    } catch (error) {
      console.error('[Neural Link] Failed to parse message:', error);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send('heartbeat', { status: 'alive' });
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimer) return;

    this.status.reconnectAttempts++;
    console.log(`🔱 [Neural Link] Reconnecting... (Attempt ${this.status.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(() => {
        // Will retry via onclose handler
      });
    }, this.config.reconnectInterval);
  }
}

// === SINGLETON INSTANCE ===
let bridgeInstance: OpenClawBridge | null = null;

export function getOpenClawBridge(config?: OpenClawConfig): OpenClawBridge {
  if (!bridgeInstance) {
    bridgeInstance = new OpenClawBridge(config);
  }
  return bridgeInstance;
}

// === REACT HOOK ===
export function useOpenClawTelemetry(
  eventType: string,
  callback: (data: TelemetryData) => void
): NeuralLinkStatus {
  const bridge = getOpenClawBridge();
  const [status, setStatus] = React.useState<NeuralLinkStatus>(bridge.getStatus());

  React.useEffect(() => {
    // Connect if not connected
    if (!bridge.getStatus().connected) {
      bridge.connect().catch(console.error);
    }

    // Subscribe to events
    const unsubscribe = bridge.subscribe(eventType, callback);

    // Update status periodically
    const statusInterval = setInterval(() => {
      setStatus(bridge.getStatus());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [eventType, callback]);

  return status;
}

// Note: React import for hook
import * as React from 'react';
