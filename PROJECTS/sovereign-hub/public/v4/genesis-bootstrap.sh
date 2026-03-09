#!/bin/bash
# genesis-bootstrap.sh - Sovereign Hub v4.0 Node Replication
# This script is injected via Cloud-Init UserData by InfraManager.js

set -e

echo "[GENESIS] Starting Sovereign Node Bootstrapping..."

# 1. Update & Install Base Dependencies
apt-get update && apt-get install -y git curl nodejs npm tailscale

# 2. Clone Sovereign Hub Repository
REPO_URL="https://github.com/your-org/sovereign-hub.git"
INSTALL_DIR="/opt/sovereign"
git clone $REPO_URL $INSTALL_DIR
cd $INSTALL_DIR

# 3. Join Tailscale Mesh
# TS_AUTH_KEY is injected by the orchestrator during provisioning
tailscale up --authkey="${TS_AUTH_KEY}" --hostname="$(hostname)"

# 4. Fetch Secrets from Central Orchestrator
# Uses a one-time Genesis Key to authenticate the initial pull
GENESIS_KEY="${GENESIS_KEY}"
ORCHESTRATOR_URL="https://api.sovereign-hub.io/v4/genesis/secrets"

echo "[GENESIS] Requesting environment secrets..."
curl -H "X-Genesis-Key: $GENESIS_KEY" -o .env "$ORCHESTRATOR_URL"

# 5. Start Sovereign Node Service
npm install
npm run build
pm2 start npm --name "sovereign-node" -- start

# 6. Announce Ready State to Supabase
# Requires the newly pulled .env for Supabase credentials
node core/registration.js --status ONLINE

echo "[GENESIS] Node Replication Complete. Node is ONLINE."
