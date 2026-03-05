const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const categories = ['Work']
  const priorities = ['High', 'Medium', 'Low']
  const statuses = ['Pending']
  const extraFields = ['description', 'notes', 'user_id', 'created_at', 'updated_at', 'is_completed']
  
  for (const field of extraFields) {
    console.log(`Trying with extra field: ${field}...`)
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: 'Test', category: 'Work', priority: 'High', status: 'Pending', [field]: field === 'is_completed' ? false : 'test' }])
      .select()
    if (!error) {
      console.log('SUCCESS with field:', field)
      process.exit(0)
    } else {
       if (!error.message.includes('check constraint')) {
          console.log(`Field ${field} Failed (Non-constraint):`, error.message)
       }
    }
  }
}

testInsert()
