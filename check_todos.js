const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function getColumns() {
    console.log("🔱 Fetching columns for 'todos'...")
    // Use an empty insert to trigger a schema error or just a select with no rows
    // Actually, select * from todos limit 0 doesn't give columns in JS usually.
    // I'll try to insert an invalid object to see the error.
    const { data, error } = await supabase.from('todos').insert({}).select()
    if (error) {
        console.log("Error:", error.message)
        // If it's a constraint error, it might mention columns.
    }
    
    // Better way: query rpc or information_schema if allowed (usually not for anon)
    // I'll try to guess common columns and see what sticks.
    const { data: cols, error: err } = await supabase.from('todos').select('*').limit(1)
    if (cols) {
        console.log("Success fetching table (even if empty).")
    }
}

getColumns()
