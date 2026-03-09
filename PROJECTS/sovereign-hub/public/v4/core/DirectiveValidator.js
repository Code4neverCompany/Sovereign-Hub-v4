/**
 * DirectiveValidator.js
 * 
 * Logic layer that intercepts all mission dispatches and checks them 
 * against the active governance_policies stored in Supabase before execution.
 * 
 * Epic: Sovereign Governance & Policy [SH-1700]
 */

export class DirectiveValidator {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.activePolicies = [];
  }

  /**
   * Refreshes the local cache of active policies from Supabase.
   */
  async refreshPolicies() {
    const { data, error } = await this.supabase
      .from('governance_policies')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Supabase Fetch Error: ${error.message}`);
    }

    this.activePolicies = data;
    console.log(`[GOVERNANCE] Loaded ${this.activePolicies.length} active policies.`);
  }

  /**
   * Main validation gate for mission dispatches.
   * @param {Object} mission - The mission/directive object.
   * @param {string} agentId - The ID of the agent attempting the action.
   * @returns {Promise<boolean>} - True if the action is allowed, False if blocked.
   */
  async validate(mission, agentId) {
    try {
      await this.refreshPolicies();
    } catch (e) {
      console.error('[GOVERNANCE] CRITICAL: Table unreachable. Defaulting to STRICT_LOCKDOWN.');
      return false; // RESILIENCE: Fail-shut
    }

    if (!this.activePolicies || this.activePolicies.length === 0) {
      console.warn('[GOVERNANCE] No active policies found or table empty. Defaulting to STRICT_LOCKDOWN.');
      return false; 
    }

    let isBlocked = false;
    let flaggedPolicies = [];

    for (const policy of this.activePolicies) {
      const result = this.checkPolicy(mission, policy);
      
      if (result.violated) {
        flaggedPolicies.push({ policy, result });
        if (policy.enforcement === 'BLOCK') {
          isBlocked = true;
        }
      }
    }

    // Log violations if any
    if (flaggedPolicies.length > 0) {
      await this.logViolations(flaggedPolicies, mission, agentId);
    }

    return !isBlocked;
  }

  /**
   * Core logic for checking a mission against a specific policy.
   * Extensible to include more policy types as needed.
   */
  checkPolicy(mission, policy) {
    const result = { violated: false, details: '' };

    switch (policy.name) {
      case 'daily_spend_limit':
        if (mission.budget && mission.budget > policy.value.limit) {
          result.violated = true;
          result.details = `Requested budget ${mission.budget} exceeds limit ${policy.value.limit}`;
        }
        break;

      case 'jail_isolation':
        if (mission.action === 'EXECUTE' && mission.container === 'ROOT' && policy.value.strict) {
          result.violated = true;
          result.details = 'Attempted execution in root container (Jail Law)';
        }
        break;

      case 'audit_logging':
        if (!mission.traceId && policy.value.required) {
          result.violated = true;
          result.details = 'Mission missing required Trace ID (Audit Law)';
        }
        break;

      case 'privacy_anonymization':
        if (mission.payload && mission.payload.includes('email') && policy.value.enforced) {
          result.violated = true;
          result.details = 'Unmasked PII detected in payload (Privacy Law)';
        }
        break;

      case 'uptime_criticality':
        if (mission.impact === 'CRITICAL' && mission.redundancy < policy.value.min_nodes) {
          result.violated = true;
          result.details = `Insufficient redundancy for critical task: ${mission.redundancy}/${policy.value.min_nodes} (Uptime Law)`;
        }
        break;

      case 'unauthorized_file_write':
        if (mission.action === 'WRITE_FILE' && policy.value.protected_dirs.some(dir => mission.path.startsWith(dir))) {
          result.violated = true;
          result.details = `Attempted write to protected directory: ${mission.path}`;
        }
        break;

      case 'high_risk_tool_usage':
        if (mission.tools && mission.tools.some(tool => policy.value.tools.includes(tool))) {
          result.violated = true;
          result.details = `Usage of high-risk tools: ${mission.tools.join(', ')}`;
        }
        break;

      case 'mandatory_audit':
        if (policy.value.triggers && policy.value.triggers.some(trigger => mission.action === trigger)) {
          result.violated = true;
          result.details = `Action '${mission.action}' requires a mandatory audit.`;
        }
        break;

      case 'privacy_exposure':
        if (mission.payload && JSON.stringify(mission.payload).match(new RegExp(policy.value.sensitive_pattern, 'i'))) {
          result.violated = true;
          result.details = `Sensitive data pattern '${policy.value.sensitive_pattern}' detected in payload.`;
        }
        break;

      case 'system_uptime':
        if (mission.complexity && mission.complexity > policy.value.max_complexity) {
          result.violated = true;
          result.details = `Task complexity ${mission.complexity} exceeds safe uptime threshold ${policy.value.max_complexity}`;
        }
        break;

      default:
        break;
    }

    return result;
  }

  /**
   * Records violations in the database and triggers real-time alerts.
   */
  async logViolations(violations, mission, agentId) {
    const records = violations.map(v => ({
      policy_id: v.policy.id,
      agent_id: agentId,
      action_type: mission.action || 'DISPATCH',
      payload: mission,
      resolution: v.policy.enforcement === 'BLOCK' ? 'BLOCKED' : 'PENDING_REVIEW',
      sovereign_note: `Automated ${v.policy.enforcement}: ${v.result.details}`
    }));

    const { error } = await this.supabase
      .from('policy_violations')
      .insert(records);

    if (error) {
      console.error('[GOVERNANCE] Error logging violation:', error);
    } else {
      console.warn(`[GOVERNANCE] ${records.length} violation(s) logged for agent ${agentId}.`);
    }
  }
}

export default DirectiveValidator;
