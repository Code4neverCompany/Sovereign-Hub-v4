const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

async function createTable() {
  console.log('Attempting to create todos_v4 table...')
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS todos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        priority TEXT,
        assigned_to TEXT,
        status TEXT DEFAULT 'pending',
        task_description TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `
  })

  if (error) {
    console.error('RPC Error:', error.message)
    console.log('Falling back to direct SQL test via fetch...')
  } else {
    console.log('Success (maybe)?', data)
  }
}

createTable()
