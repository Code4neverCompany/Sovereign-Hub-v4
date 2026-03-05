const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const categories = ['Work', 'work', 'Personal', 'personal', 'Other', 'other']
  const priorities = ['High', 'high', 'Medium', 'medium', 'Low', 'low']
  
  for (const category of categories) {
    for (const priority of priorities) {
      console.log(`Trying category="${category}", priority="${priority}"...`)
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: 'Test', category, priority }])
        .select()
      if (!error) {
        console.log('SUCCESS!')
        console.log('Valid Columns:', Object.keys(data[0]))
        return
      } else {
        console.log('Failed:', error.message)
      }
    }
  }
}

testInsert()
