import json
import os
from datetime import datetime

class CommandIntelligence:
    def __init__(self):
        self.stats_path = '~/workspace/company/intelligence/action_stats.json'
        self.history = self._load_stats()

    def _load_stats(self):
        if os.path.exists(self.stats_path):
            with open(self.stats_path, 'r') as f: return json.load(f)
        return {"action_frequency": {}, "sequences": []}

    def suggest_next(self, last_action):
        # Logic to predict next Sovereign intent based on historical sequences
        # For now, it returns the most logical next step in BMAD v6
        flow = {
            "DISPATCH_MISSION": "MONITOR_TELEMETRY",
            "SENTINEL_SCAN": "REVIEW_AUDIT",
            "CORE_UPGRADE": "SYSTEM_STRESS_TEST"
        }
        return flow.get(last_action, "INITIATE_SQUAD_SYNC")

if __name__ == "__main__":
    ci = CommandIntelligence()
    print("🧠 Adaptive Command Intelligence: ONLINE")
