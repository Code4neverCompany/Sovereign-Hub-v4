import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY' // REPLACE WITH REAL KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const sampleTasks = [
    { title: "Analyze competitor content strategy", category: "Work", priority: "Urgent", track_status: "At Risk", status: "todo", completed: false },
    { title: "Write weekly newsletter draft", category: "Marketing", priority: "Normal", track_status: "On Track", status: "todo", completed: false },
    { title: "Set up API integration", category: "Development", priority: "Normal", track_status: "On Track", status: "in_progress", completed: false },
    { title: "Record product demo video", category: "Marketing", priority: "Urgent", track_status: "At Risk", status: "in_progress", completed: false },
    { title: "Update landing page copy", category: "Work", priority: "Someday", track_status: "On Track", status: "done", completed: true },
    { title: "Research new influencer partnerships", category: "Marketing", priority: "Normal", track_status: "On Track", status: "done", completed: true }
]

async function seed() {
    console.log("🔱 Seeding Tactical Tasks...")
    const { data, error } = await supabase.from('todos').insert(sampleTasks)
    if (error) {
        console.error("🔱 SEED FAILED:", error.message)
    } else {
        console.log("🔱 SEED SUCCESSFUL: 6 Tasks Injected.")
    }
}

// seed()
