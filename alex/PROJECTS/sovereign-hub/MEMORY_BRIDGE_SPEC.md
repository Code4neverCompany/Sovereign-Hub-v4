# MEMORY BRIDGE INTEGRATION BLUEPRINT (SH-005.2)

## 1. Goal
Establish a bidirectional synchronization mechanism between the transient **Intel Stream** (Next.js/PostgreSQL/Supabase) and the persistent **Quantum Vault** (Local JSONL Journals) to ensure long-term sovereign memory retention.

## 2. Vault Structure: `BRAIN/quantum-vault/journals/`
Journals are stored as daily `.jsonl` (JSON Lines) files to support efficient appending and streaming.

**Directory Mapping:**
- `BRAIN/quantum-vault/journals/YYYY-MM-DD.jsonl`: Primary storage.
- `BRAIN/quantum-vault/journals/index.json`: High-level metadata for fast lookups.

**Entry Schema (JSONL Line):**
```json
{
  "timestamp": "ISO8601",
  "id": "uuid-v4",
  "source": "intel-stream | system | manual",
  "layer": "ingestion | synthesis | storage",
  "epic": "SH-005",
  "story": "SH-005.2",
  "payload": {
    "summary": "Short description",
    "content": "Full markdown or structured data",
    "tags": ["memory-bridge", "architecture"]
  },
  "metadata": {
    "session_id": "openclaw-session-uuid",
    "agent_id": "alex"
  }
}
```

## 3. API Architecture
The Bridge operates via a two-way sync runner (Bridge Agent).

### A. Next.js -> Vault (Uplink)
1. **Trigger:** A message is marked as "Permanent" or an Epic is completed in the HUD.
2. **Action:** Next.js pushes to `/api/bridge/journal`.
3. **Execution:** The server-side route invokes `openclaw exec` to append the entry to the current day's `.jsonl` file in the vault.
4. **Log:** Status is mirrored to Supabase `memory_logs` table.

### B. Vault -> Next.js (Downlink/Rehydration)
1. **Trigger:** HUD Load or Memory Search.
2. **Action:** `/api/bridge/query` reads `.jsonl` lines.
3. **Execution:** Filtered entries (via `grep` or JSON parsing) are streamed back to the Next.js UI to "rehydrate" the Intel Stream with historical context.

## 4. Supabase Schema (The Mirror)
To maintain the "Log to Supabase first" requirement, a `memory_bridge_ops` table is required:
- `id`: UUID.
- `operation`: `UPLINK` | `DOWNLINK`.
- `vault_path`: String.
- `status`: `PENDING` | `COMMITTED` | `FAILED`.
- `payload_hash`: SHA-256 (to ensure integrity between SQL and JSONL).

## 5. Implementation Steps
- [ ] Create `BRAIN/quantum-vault/journals/` schema validator.
- [ ] Implement `sync_to_vault.sh` utility for OpenClaw.
- [ ] Configure Supabase real-time listeners for bridge status updates.

---
**Status:** DESIGN COMPLETE | **Owner:** Alex (Architect) | **Epoch:** 2026-03-04
🦾🏗️🛰️
