const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    console.log("🔱 Fetching 'todos' sample row...")
    const { data, error } = await supabase.from('todos').select('*').limit(1).order('created_at', { ascending: false })
    if (data && data.length > 0) {
        console.log("✅ Columns:", Object.keys(data[0]))
        console.log("Sample:", data[0])
    }
}

check()
