/**
 * 🛰️ Sovereign Hub v4.0 - HiveSync Bridge [SH-1100]
 * Materialized by Dev (Phase 4)
 * Handles real-time swarm knowledge broadcasting and listening.
 */

import { createClient } from '@supabase/supabase-js';

// placeholders - these should be provided via environment variables in production
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Broadcasts an insight to the swarm.
 * @param {string} agentId - The ID of the agent (e.g., 'dev', 'alex').
 * @param {string} sessionId - The current session ID.
 * @param {object} insight - The insight data (JSON).
 * @param {number} relevanceScore - Relevance score (0.0 to 1.0).
 */
export async function broadcastInsight(agentId, sessionId, insight, relevanceScore = 1.0) {
  const { data, error } = await supabase
    .from('swarm_knowledge')
    .insert([
      {
        agent_id: agentId,
        session_id: sessionId,
        insight_json: insight,
        relevance_score: relevanceScore,
        type: insight.type || 'INSIGHT',
        content: insight.content || JSON.stringify(insight),
        priority: insight.priority || 1,
        timestamp: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('🛰️ Swarm Broadcast Error:', error);
    return null;
  }
  return data;
}

/**
 * Sets up a listener for swarm insights.
 * @param {function} onInsight - Callback function called when a new insight is received.
 */
export function listenToSwarm(onInsight) {
  const channel = supabase
    .channel('swarm_knowledge_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'swarm_knowledge',
      },
      (payload) => {
        onInsight(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
