import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I' // Truncated/Invalid key just for testing if table exists via error or success

async function verify() {
    console.log("Verifying Supabase Schema...");
    const supabase = createClient(SUPABASE_URL, 'REPLACE_WITH_REAL_KEY_FROM_USER_LATER')
    
    const tables = ['agent_states', 'agent_logs', 'todos']
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.error(`Table ${table} check failed:`, error.message)
        } else {
            console.log(`Table ${table} exists and is reachable.`)
        }
    }
}

// verify(); // Manual trigger
