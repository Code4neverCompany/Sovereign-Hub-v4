import os
import yaml
import json

# 🌌 4NeverCompany - BMAD Handoff Engine
# Connects phases by injecting previous artifacts into sub-agent context

PROJECT_ROOT = "/home/skywork/workspace/c4n-CompanyDashboard"
ARTIFACTS_PATH = os.path.join(PROJECT_ROOT, "_bmad-output")

def get_context_for_phase(target_agent):
    """Gathers required files based on the BMAD state-machine handoff rules."""
    context_files = []
    
    # Mappings from state-machine.md
    if target_agent == "architect":
        context_files = ["planning-artifacts/prd.md", "planning-artifacts/ux-design.md"]
    elif target_agent == "scrum-master":
        context_files = ["planning-artifacts/prd.md", "planning-artifacts/architecture.md"]
    elif target_agent == "dev-story":
        # Find latest ready-for-dev story
        context_files = ["planning-artifacts/architecture.md"] 
    elif target_agent == "code-review":
        context_files = ["planning-artifacts/architecture.md"]

    context_data = ""
    for file_path in context_files:
        full_path = os.path.join(ARTIFACTS_PATH, file_path)
        if os.path.exists(full_path):
            with open(full_path, 'r') as f:
                context_data += f"\n\n### CONTEXT FROM: {file_path}\n"
                context_data += f.read()
    
    return context_data

def prepare_spawn_command(agent_id, task_description):
    """Constructs the high-fidelity prompt for sessions_spawn."""
    context = get_context_for_phase(agent_id)
    
    full_task = f"""You are executing the {agent_id} workflow for c4n-CompanyDashboard.

## Project Context
{context}

## Current Mission
{task_description}

Begin implementation now. Follow BMAD v6 standards."""

    return full_task

if __name__ == "__main__":
    # Test logic
    print("--- BMAD HANDOFF ENGINE (V6) START ---")
    mock_task = prepare_spawn_command("dev-story", "Integrate Webhook logic for Sentinel.")
    print(mock_task)
