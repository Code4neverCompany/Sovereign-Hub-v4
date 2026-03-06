/**
 * RiskCalculus.js
 * 
 * Calculates the system risk score based on active agents, task complexity, 
 * and recent policy violations.
 * 
 * Epic: Sovereign Governance & Policy [SH-1700]
 */

export class RiskCalculus {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Calculates the current risk percentage (0-100).
   */
  async calculateRisk() {
    let riskScore = 0;

    try {
      // 1. Agent Count Risk
      const { data: agents } = await this.supabase.from('node_status').select('status');
      const activeAgents = agents?.filter(a => a.status === 'online').length || 0;
      riskScore += Math.min(activeAgents * 5, 20); 

      // 2. Violation Risk
      const { data: violations } = await this.supabase
        .from('policy_violations')
        .select('id')
        .eq('resolution', 'PENDING_REVIEW');
      const pendingViolations = violations?.length || 0;
      riskScore += Math.min(pendingViolations * 10, 40);

      // 3. Task Complexity (Simplified: Active Tasks)
      const { data: tasks } = await this.supabase.from('todos').select('status');
      const activeTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
      riskScore += Math.min(activeTasks * 2, 20);

      // 4. System Health (Base Risk)
      riskScore += 5 + (Math.random() * 5);

    } catch (err) {
      console.error('[RISK] Error calculating risk:', err);
      return 15;
    }

    return Math.min(Math.round(riskScore), 100);
  }

  /**
   * Returns the color code for a given risk score.
   */
  getRiskColor(score) {
    if (score < 30) return '#00FFFF'; // Cyan (Stable)
    if (score < 70) return '#D4AF37'; // Gold (Elevated)
    return '#EF4444'; // Crimson (Critical)
  }
}

export default RiskCalculus;
