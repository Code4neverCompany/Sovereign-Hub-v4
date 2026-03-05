const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    const queries = [
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        "SELECT column_name, data_type, table_name FROM information_schema.columns WHERE table_schema = 'public'"
    ]
    
    for (const sql of queries) {
        console.log(`\n🔱 Executing: ${sql}`)
        // Try 'exec' first, then 'exec_sql'
        let res = await supabase.rpc('exec', { sql })
        if (res.error) {
            console.log(`[!] 'exec' failed: ${res.error.message}. Trying 'exec_sql'...`)
            res = await supabase.rpc('exec_sql', { sql_query: sql })
        }
        
        if (res.error) {
            console.log(`[!] ERROR: ${res.error.message}`)
        } else {
            console.table(res.data)
        }
    }
}

run()
