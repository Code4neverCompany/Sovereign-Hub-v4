#!/bin/bash
# 4NeverCompany Knowledge Backup Script
# Nova Core Logic

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
cd /home/skywork/workspace

echo "Starting Backup at $TIMESTAMP..."

# Sicherstellen, dass Git konfiguriert ist
git config --global user.name "Nova Agent"
git config --global user.email "nova@4nevercompany.ai"

# Dateien hinzufügen
git add IDENTITY.md SOUL.md company/ bmad-openclaw/ README.md

# Commit erstellen
git commit -m "Daily Knowledge Sync: $TIMESTAMP"

# Push (Erfordert konfiguriertes Remote und Credentials/SSH)
if git remote | grep -q 'origin'; then
    git push origin main
    echo "Backup successfully pushed to GitHub."
else
    echo "ERROR: No git remote 'origin' found. Backup stored locally in Git history."
fi
