const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  console.log('Testing minimal insert...')
  const { data, error } = await supabase
    .from('todos')
    .insert([{ task: 'test_task' }])
    .select()

  if (error) {
    console.error('Insert error (task):', error.message)
    const { data: data2, error: error2 } = await supabase
      .from('todos')
      .insert([{ title: 'test_title' }])
      .select()
    if (error2) {
        console.error('Insert error (title):', error2.message)
    } else {
        console.log('Success with "title" column')
    }
  } else {
    console.log('Success with "task" column')
  }
}

testInsert()
