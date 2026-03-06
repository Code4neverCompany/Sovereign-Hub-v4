/**
 * test_genesis_sync.js - Sovereign Hub v4.0 Integration Test
 * 
 * Verifies NodeGenesis.js and InfraManager.js interaction and persistence.
 */

const NodeGenesis = require('./NodeGenesis');

async function testScaling() {
    const SUPABASE_URL = "https://vxipofhhsmjbbehtbxbu.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I";

    const genesis = new NodeGenesis(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log("--- TEST 1: High Load (Scale UP) ---");
    // High CPU (90%) and High Mem (85%)
    await genesis.analyze({ cpu: 90, mem: 85, latency: 500 });

    console.log("\n--- TEST 2: Low Load (Scale DOWN) ---");
    // Wait for provisioning simulation to at least start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Low CPU (10%) and Low Mem (15%)
    await genesis.analyze({ cpu: 10, mem: 15, latency: 100 });

    console.log("\nTests Complete. Check Supabase 'scaling_events' and 'infrastructure_nodes' tables.");
}

testScaling();
