
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://vxipofhhsmjbbehtbxbu.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
    const sql = fs.readFileSync('/home/skywork/workspace/PROJECTS/sovereign-hub/v4/setup_forge.sql', 'utf8');
    
    // Using rpc if available, but usually we just run it via the dashboard.
    // For automation in this environment, we'll try to use the REST API to execute SQL if possible, 
    // or just assume the user/system will run it. 
    // Since I'm Dev, I'll try a trick: creating a function to exec SQL.
    
    console.log("Migration SQL prepared. Please ensure 'product_blueprints' table is created.");
    console.log(sql);
    
    // Attempting a direct insert to check if table exists
    const { error } = await supabase.from('product_blueprints').select('id').limit(1);
    if (error && error.code === 'PGRST116') {
         console.log("Table 'product_blueprints' does not exist. Manual SQL execution required in Supabase dashboard.");
    } else if (error) {
         console.log("Error checking table:", error.message);
    } else {
         console.log("Table 'product_blueprints' exists.");
    }
}

runMigration();
