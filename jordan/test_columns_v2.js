const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  console.log('Testing insert with title and category...')
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title: 'SH-501', category: 'High' }])
    .select()

  if (error) {
    console.error('Insert error:', error.message)
  } else {
    console.log('Success! Table schema confirmed (title, category). Columns:', Object.keys(data[0]))
  }
}

testInsert()
