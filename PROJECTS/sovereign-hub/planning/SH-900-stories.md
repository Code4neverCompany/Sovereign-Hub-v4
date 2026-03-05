# 📋 User Stories: Global HUD Expansion [SH-900]
**Project:** Sovereign Hub v4.0 (Slim-Stack)  
**Epic:** Global HUD Expansion [SH-900]  
**Objective:** Strategic roadmap for Global Fleet tracking.

## 1. User Stories

### **A. Global Node Tracking (Fleet Visibility)**
*   **SH-900.1: Geographic Fleet Overview**  
    *   **Story:** *As an operator, I want to see all my bot-pods on a global map so I can verify geographic redundancy and physical distribution.*
    *   **Acceptance Criteria:** 
        *   Map displays all nodes from `node_status` table.
        *   Markers are color-coded based on status (Online/Offline/Busy).
        *   Clicking a marker reveals node name and ID.
    *   **Priority:** High | **Estimate:** 3 pts

*   **SH-900.2: Auto-Discovery of New Pods**  
    *   **Story:** *As a user, I want new nodes to automatically appear in the HUD as soon as they are provisioned and send their first heartbeat.*
    *   **Acceptance Criteria:** 
        *   UI updates in real-time when a new `node_id` is inserted into `node_status`.
        *   No page refresh required to see new infrastructure.
    *   **Priority:** Medium | **Estimate:** 2 pts

### **B. Realtime Heartbeats (Health Monitoring)**
*   **SH-900.3: Live Health Telemetry**  
    *   **Story:** *As a developer, I want to see CPU and Memory metrics for each node in real-time so I can identify bottlenecked pods before they fail.*
    *   **Acceptance Criteria:** 
        *   Node cards display micro-progress bars for CPU/MEM.
        *   Status updates via Supabase Realtime (no polling).
        *   Visual feedback (pulse animation) confirms live connectivity.
    *   **Priority:** High | **Estimate:** 3 pts

*   **SH-900.4: Stale Node Detection**  
    *   **Story:** *As an admin, I want nodes that haven't checked in for 2 minutes to be marked as 'offline' so I can troubleshoot connectivity issues.*
    *   **Acceptance Criteria:** 
        *   Frontend logic calculates `isOnline` based on `last_seen` timestamp.
        *   UI reflects 'offline' status visually (greyed out or red marker).
    *   **Priority:** High | **Estimate:** 2 pts

### **C. Infrastructure Management (Direct Access)**
*   **SH-900.5: Secure Mesh Access (Tailscale)**  
    *   **Story:** *As a sysadmin, I want a one-click way to get the Tailscale IP of a node so I can SSH in for emergency maintenance.*
    *   **Acceptance Criteria:** 
        *   Node card includes a "Copy IP" button for Tailscale address.
        *   Optional `ssh://` link protocol support.
    *   **Priority:** Medium | **Estimate:** 2 pts

---

## 2. Strategic Roadmap (30/60/90 Day)

*   **30 Days:** Core Infrastructure tab with Leaflet.js map and basic node cards. Heartbeat script deployed to initial test nodes.
*   **60 Days:** Advanced telemetry (disk, temp, uptime) and bulk node actions (restart/update via command-and-control).
*   **90 Days:** Predictive scaling—automated provisioning of new pods based on aggregate fleet load metrics.

---

## 3. Monetization Opportunities
1.  **Managed Fleet Hosting:** Offer "Sovereign Pods" as a subscription service with pre-configured heartbeats.
2.  **Infrastructure Insights:** Premium analytics dashboard for historical uptime and performance trends.
3.  **Alerting Add-on:** SMS/Telegram notifications for node failures or high-load thresholds.
