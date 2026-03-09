# User Stories: Autonomous Scaling & Replication [SH-1800]
## Project: Sovereign Hub v4.0
## Epic: SH-1800
## Strategist: Jordan

---

### 1. Infrastructure Manager
- **SH-1800.1: Provider-Agnostic Provisioning Engine**
  - **As the** Hub's Orchestrator,
  - **I want** a `InfraManager.js` that integrates with AWS and RunPod SDKs,
  - **So that** I can autonomously spawn nodes across different cloud providers based on specific needs (GPU vs. CPU).
  - **Priority:** CRITICAL | **Estimate:** 5 pts

- **SH-1800.2: Sovereign Machine Image Registry**
  - **As a** System Administrator,
  - **I want** the Hub to manage a registry of pre-configured AMIs/Snapshots,
  - **So that** new nodes boot with the Sovereign OS environment ready for immediate replication.
  - **Priority:** HIGH | **Estimate:** 3 pts

- **SH-1800.3: Multi-Cloud Load Monitoring**
  - **As the** Hub,
  - **I want** to track real-time telemetry (CPU > 75%, RAM > 80%, Latency > 2s),
  - **So that** I can trigger `PROVISION_NODE` events when the swarm reaches saturation.
  - **Priority:** HIGH | **Estimate:** 4 pts

---

### 2. Genesis Middleware
- **SH-1800.4: Autonomous Genesis Bootstrap Script**
  - **As a** new cloud instance,
  - **I want** to execute a `genesis-bootstrap.sh` script via Cloud-Init,
  - **So that** I can clone the Sovereign repository and join the Tailscale mesh without manual intervention.
  - **Priority:** CRITICAL | **Estimate:** 5 pts

- **SH-1800.5: Secure One-Time Genesis Keys**
  - **As the** Orchestrator,
  - **I want** to generate short-lived, 256-bit "Genesis Keys",
  - **So that** only authenticated nodes can request secrets and register with the swarm.
  - **Priority:** CRITICAL | **Estimate:** 4 pts

- **SH-1800.6: Cloud Metadata Identity Verification**
  - **As a** new node,
  - **I want** my identity to be verified via Cloud Metadata (AWS/RunPod) before secrets are released,
  - **So that** the swarm is protected against unauthorized node injection.
  - **Priority:** HIGH | **Estimate:** 4 pts

---

### 3. Replication Protocols
- **SH-1800.7: Automatic Node Registration & READY State**
  - **As a** fully provisioned node,
  - **I want** to assign myself a unique hostname and update my status to `READY` in Supabase,
  - **So that** the swarm recognizes me as an active compute resource.
  - **Priority:** HIGH | **Estimate:** 3 pts

- **SH-1800.8: Graceful Node Draining (Scale Down)**
  - **As a** node targeted for decommissioning,
  - **I want** to transition to a `DRAINING` state,
  - **So that** I can finish active tasks before the instance is terminated to prevent data loss.
  - **Priority:** MEDIUM | **Estimate:** 4 pts

- **SH-1800.9: 24-Hour Secret Rotation & mTLS**
  - **As a** Security Officer,
  - **I want** the registration secrets to rotate daily and for nodes to use mTLS certificates,
  - **So that** inter-node communication remains secure and resilient.
  - **Priority:** HIGH | **Estimate:** 5 pts

---

### 4. Handoff to Maya (HUD Design)
- **SH-1800.10: Global Capacity Meter & Infrastructure Expansion HUD**
  - **As a** User,
  - **I want** to see aggregated vCPU, RAM, and VRAM across the entire swarm,
  - **So that** I can understand the current scale of the Hub's biological footprint.
  - **Priority:** MEDIUM | **Estimate:** 6 pts

- **SH-1800.11: Real-Time Node Timeline & Cost Burn**
  - **As a** User,
  - **I want** to track the status of nodes (Provisioning -> Online) and see the real-time hourly cost burn rate,
  - **So that** I can monitor infrastructure spend and expansion efficiency.
  - **Priority:** MEDIUM | **Estimate:** 5 pts

---

### 🚀 INFRASTRUCTURE SELECTION PRIORITY
1. **RunPod:** PRIMARY for AI/GPU tasks (Cost-efficient inference & training).
2. **AWS:** PRIMARY for general compute, high-availability orchestration, and storage.
3. **DigitalOcean:** SECONDARY for lightweight edge nodes and staging environments.
4. **GCP:** BACKUP for specialized AI services and general compute overflow.

---

### 🎨 HANDOFF: DESIGN BRIEF FOR MAYA [PHASE 3]
**Objective:** Visualize the Hive's physical expansion.

**1. Infrastructure Expansion HUD:**
- A cinematic dashboard view within the "Infrastructure" tab.
- Use the **Aureum Gold** theme for active nodes and **Void Black** for background.
- Include a "Preferred Regions" selector map.

**2. Global Capacity Meter:**
- A high-impact visual widget showing total swarm resources.
- Progress bars for vCPU, RAM, and GPU memory utilization.
- A "Burn Rate" ticker showing `$/hour` updated in real-time.

**3. Node Timeline:**
- A vertical or horizontal timeline for each node showing the sequence: `PROVISIONING` -> `BOOTING` -> `SYNCING` -> `ONLINE`.
- Color-coded pips for health and latency.
