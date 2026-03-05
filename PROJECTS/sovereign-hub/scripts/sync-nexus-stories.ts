import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local from the project root
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function syncTodos() {
  const stories = [
    { title: 'SH-601.1: Nexus Dispatch Modal', description: 'Build high-fidelity Lux 3.0 Modal UI for agent dispatching.', status: 'todo' },
    { title: 'SH-601.2: Model Engine Selector', description: 'Implement model selection dropdown with cost/speed indicators.', status: 'todo' },
    { title: 'SH-601.3: Dispatch Uplink', description: 'Integrate API POST request to spawn agent missions.', status: 'todo' },
    { title: 'SH-601.4: Mission Manifest Link', description: 'Enable realtime updates for newly spawned missions in HUD.', status: 'todo' }
  ]

  console.log('Syncing SH-601 tasks to Supabase...')

  for (const story of stories) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { 
          title: story.title, 
          description: story.description, 
          status: story.status,
          project: 'Neural Nexus [SH-600]'
        }
      ])

    if (error) {
      console.error(`Error inserting ${story.title}:`, error.message)
    } else {
      console.log(`Successfully added: ${story.title}`)
    }
  }
}

syncTodos()
