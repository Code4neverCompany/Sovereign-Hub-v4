const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Monitors MEMORY.md and broadcasts updates to the swarm.
 */
async function watchMemoryAndBroadcast(agentId, sessionId) {
  const memoryPath = path.join(process.cwd(), 'MEMORY.md');
  console.log(`🛰️ Monitoring ${memoryPath} for swarm signals...`);

  let lastContent = '';
  if (fs.existsSync(memoryPath)) {
    lastContent = fs.readFileSync(memoryPath, 'utf8');
  }

  fs.watch(memoryPath, async (event) => {
    if (event === 'change') {
      const currentContent = fs.readFileSync(memoryPath, 'utf8');
      if (currentContent !== lastContent) {
        console.log('🛰️ MEMORY.md changed, broadcasting insight...');
        
        // Extract the last few lines or specific tags as "insight"
        const lines = currentContent.split('\n');
        const lastEntry = lines.slice(-5).join('\n'); // Just a heuristic

        await supabase.from('swarm_knowledge').insert([{
          agent_id: agentId,
          session_id: sessionId,
          insight_json: { content: lastEntry, type: 'MEMORY_UPDATE' },
          relevance_score: 0.9,
          timestamp: new Date().toISOString()
        }]);

        lastContent = currentContent;
      }
    }
  });
}

module.exports = { watchMemoryAndBroadcast };
