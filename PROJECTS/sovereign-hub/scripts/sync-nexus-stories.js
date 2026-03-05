const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

loadEnv(path.join(__dirname, '../.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncTodos() {
  const stories = [
    { title: 'SH-601.1: Nexus Dispatch Modal', status: 'todo', category: 'Work', priority: 'Normal' },
    { title: 'SH-601.3: Dispatch Uplink', status: 'todo', category: 'Work', priority: 'Normal' }
  ];

  console.log('Syncing SH-601 missing tasks to Supabase (Schema V11 - Priority fix)...');

  for (const story of stories) {
    const { error } = await supabase
      .from('todos')
      .insert([
        { 
          title: story.title, 
          status: story.status,
          category: story.category,
          priority: story.priority
        }
      ]);

    if (error) {
      console.error(`Error inserting ${story.title}:`, error.message);
    } else {
      console.log(`Successfully added: ${story.title}`);
    }
  }
}

syncTodos();
