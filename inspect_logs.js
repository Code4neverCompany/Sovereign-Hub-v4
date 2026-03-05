import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://vxipofhhsmjbbehtbxbu.supabase.co'
const SUPABASE_KEY = 'REPLACE_ME' // I need the actual key or I can try to find it in the current index.html

async function inspect() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { data, error } = await supabase.from('agent_logs').select('*').limit(1)
    if (data && data.length > 0) {
        console.log("Columns in agent_logs:", Object.keys(data[0]))
        console.log("Sample Data:", data[0])
    } else {
        console.log("No data or error:", error)
    }
}
