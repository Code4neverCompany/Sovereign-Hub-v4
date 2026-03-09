const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'PROJECTS', 'sovereign-hub', 'data');

function seed() {
  console.log("🔱 Seeding Sovereign-Native Backend...");

  // 1. Seed Projects
  const projects = [
    { "id": "p1", "name": "SOVEREIGN_HUB", "meta": { "progress": 94, "status": "STABLE", "roi": "+312%" }, "created_at": new Date().toISOString() },
    { "id": "p2", "name": "LOOPSHIELD_AI", "meta": { "progress": 45, "status": "DECOUPLED", "roi": "+124%" }, "created_at": new Date().toISOString() },
    { "id": "p3", "name": "NEXUS_CORE", "meta": { "progress": 15, "status": "PLANNING", "roi": "TBD" }, "created_at": new Date().toISOString() }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'projects.json'), JSON.stringify(projects, null, 2));

  // 2. Seed Tasks
  const tasks = [
    { "id": "t1", "agentId": "alex", "description": "Analyzing neural pathways for SH-1000.", "priority": "HIGH", "status": "PROGRESS", "created_at": new Date().toISOString() },
    { "id": "t2", "agentId": "maya", "description": "Polishing Lux 3.0 assets.", "priority": "MEDIUM", "status": "REVIEW", "created_at": new Date().toISOString() },
    { "id": "t3", "agentId": "dev", "description": "Optimizing local JSONL stream.", "priority": "HIGH", "status": "DONE", "created_at": new Date().toISOString() },
    { "id": "t4", "agentId": "jordan", "description": "Scouting market for 'Agentic C2'.", "priority": "MEDIUM", "status": "INBOX", "created_at": new Date().toISOString() }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2));

  // 3. Seed Approvals
  const approvals = [
    { "id": "app1", "agent_id": "alex", "action": "WRITE_FILE", "payload": { "path": "AGENTS.md", "content": "..." }, "status": "PENDING", "timestamp": new Date().toISOString() },
    { "id": "app2", "agent_id": "sam", "action": "EXTERNAL_MSG", "payload": { "to": "Telegram", "body": "Alert!" }, "status": "PENDING", "timestamp": new Date().toISOString() }
  ];
  const appDir = path.join(DATA_DIR, 'approvals');
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, 'pending.json'), JSON.stringify(approvals, null, 2));

  // 4. Seed Logs
  const logPath = path.join(DATA_DIR, 'logs', 'agent_logs.jsonl');
  const logs = [
    { "timestamp": new Date().toISOString(), "agent_id": "alex", "message": "Neural synchronization established.", "level": "SUCCESS", "meta": {} },
    { "timestamp": new Date().toISOString(), "agent_id": "dev", "message": "Local bridge NEP v1.1 initialized.", "level": "INFO", "meta": {} },
    { "timestamp": new Date().toISOString(), "agent_id": "sam", "message": "Perimeter hardening complete. Host secure.", "level": "SUCCESS", "meta": {} }
  ];
  fs.appendFileSync(logPath, logs.map(l => JSON.stringify(l)).join('\n') + '\n');

  console.log("✅ Seed Complete.");
}

seed();
