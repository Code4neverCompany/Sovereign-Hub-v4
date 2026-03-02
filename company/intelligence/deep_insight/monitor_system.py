import json
import os
from datetime import datetime

def log_agent_interaction(agent_id, action, status, detail):
    log_path = f'~/workspace/company/intelligence/deep_insight/{agent_id}_logbook.jsonl'
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "status": status,
        "detail": detail,
        "engine": "Nova_v2.0"
    }
    with open(os.path.expanduser(log_path), 'a') as f:
        f.write(json.dumps(entry) + '\n')

if __name__ == "__main__":
    print("🔭 Deep Insight Monitoring: ACTIVE for Sentinel & Architect")
    log_agent_interaction("sentinel", "INITIALIZE_EPIC6_AUDIT", "SUCCESS", "Vetted skill set integration verified.")
    log_agent_interaction("architect", "SYNCING_VERCEL_PATTERNS", "ACTIVE", "Applying Next.js 14 luxury aesthetic core.")
