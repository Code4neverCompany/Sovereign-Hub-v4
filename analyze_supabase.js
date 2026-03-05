const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function analyze() {
    const tables = ['agent_logs', 'agent_states', 'telemetry_node_logs', 'todos', 'tasks', 'activities', 'system_health', 'node_logs']
    console.log("🔱 ANALYZING SUPABASE BACKEND...")
    
    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`)
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.log(`[!] Error: ${error.message}`)
        } else if (data && data.length > 0) {
            console.log("Columns:", Object.keys(data[0]))
            console.log("Sample Row:", JSON.stringify(data[0], null, 2))
        } else {
            console.log("[?] Table exists but is empty.")
        }
    }
}

analyze()
