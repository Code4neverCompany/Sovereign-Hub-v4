const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    const guesses = ['contents', 'posts', 'articles', 'outputs', 'memories', 'journals']
    for (const g of guesses) {
        const { data, error } = await supabase.from(g).select('*').limit(1)
        if (!error) {
            console.log(`✅ Table '${g}' exists. Columns:`, data.length > 0 ? Object.keys(data[0]) : "Empty")
        }
    }
}

check()
