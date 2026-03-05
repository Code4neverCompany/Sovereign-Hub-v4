const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXBvZmhoc21qYmJlaHRieGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDQxODMsImV4cCI6MjA4ODA4MDE4M30.iXUj3G_1MpL8lRRKHsxR858sqCdYeQZNvX0t7nJE7_I'
const supabase = createClient(supabaseUrl, supabaseKey)

const todos = [
  {
    priority: 'HIGH',
    assigned_to: 'Alex',
    status: 'pending',
    task_description: 'SH-501: Materialize Sentinel-Trace HUD (Security Scanning Module).'
  },
  {
    priority: 'MEDIUM',
    assigned_to: 'Maya',
    status: 'pending',
    task_description: 'SH-502: Implement BMad Pulse (Agent state heartbeat visually pulsing).'
  },
  {
    priority: 'MEDIUM',
    assigned_to: 'Jordan',
    status: 'pending',
    task_description: 'SH-503: Audit Supabase RLS policies for Agent-Log isolation.'
  },
  {
    priority: 'LOW',
    assigned_to: 'Builder',
    status: 'pending',
    task_description: 'SH-504: Lux 3.0 Silk Noise Grain Optimization.'
  },
  {
    priority: 'HIGH',
    assigned_to: 'Alex',
    status: 'pending',
    task_description: 'SH-505: Integrate Gateway Telemetry (Brave Search API results).'
  }
]

async function populateTodos() {
  console.log('Inserting strategic tasks into todos table...')
  const { data, error } = await supabase
    .from('todos')
    .insert(todos)
    .select()

  if (error) {
    console.error('Error inserting todos:', error)
    process.exit(1)
  }

  console.log('Successfully inserted todos:', JSON.stringify(data, null, 2))
}

populateTodos()
