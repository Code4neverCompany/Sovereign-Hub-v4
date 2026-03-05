const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const priorities = ['High', 'Medium', 'Low', 'high', 'medium', 'low']
  const categories = ['Work', 'Personal']
  const statuses = ['Pending']
  
  for (const category of categories) {
    for (const status of statuses) {
      for (const priority of priorities) {
        console.log(`Trying category="${category}", status="${status}", priority="${priority}"...`)
        const { data, error } = await supabase
          .from('todos')
          .insert([{ title: 'Test', category, priority, status }])
          .select()
        if (error) {
           console.log(`Failed: ${error.message}`)
        } else {
          console.log('SUCCESS!')
          return
        }
      }
    }
  }
}

testInsert()
