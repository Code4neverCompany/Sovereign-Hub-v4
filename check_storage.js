const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    console.log("🔱 Checking Supabase Storage Buckets...")
    const { data, error } = await supabase.storage.listBuckets()
    if (error) {
        console.log("Error listing buckets:", error.message)
    } else {
        console.log("Buckets:", data.map(b => b.name))
        for (const bucket of data) {
            const { data: files, error: err } = await supabase.storage.from(bucket.name).list()
            if (files) console.log(`Files in ${bucket.name}:`, files.map(f => f.name))
        }
    }
}

check()
