// scripts/test_stream.ts
import { logToSupabase } from '../lib/supabase.ts';

async function simulateAgentLogs() {
    console.log('--- Starting Simulated Agent Intel Transmission ---');
    
    const agents = ['NIGHT_EYE', 'GOLD_REAPER', 'VOID_WALKER', 'CORE_SENTINEL'];
    const messages = [
        'Surveillance perimeter secure.',
        'Target quadrant identified: Maya Luxury district.',
        'Infiltrating encrypted subnet Alpha-9.',
        'Core integrity check complete: 100%.',
        'Protocol AUREUM initiated.',
        'Detected unusual activity in the peripheral data streams.',
        'Aura emission normalized to Cyan-Glow levels.',
        'Sovereign access reaffirmed by administrative override.'
    ];

    for (let i = 0; i < 5; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        
        await logToSupabase({
            agent_id: agent,
            message: msg,
            level: Math.random() > 0.8 ? 'WARN' : 'INFO',
            timestamp: new Date().toISOString()
        });

        // Delay between logs (shortened for test)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('--- Transmission Complete ---');
}

simulateAgentLogs();
