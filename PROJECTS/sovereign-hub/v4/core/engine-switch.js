/**
 * Sovereign Hub v4.0 | engine-switch.js
 * Epic: Strategic Optimization [SH-800]
 * Dynamic Model-Switching Middleware
 */

export class EngineSwitch {
    constructor() {
        this.models = {
            FLASH: 'gemini-3-flash',
            OPUS: 'claude-opus-4.6'
        };

        this.highComplexityKeywords = [
            'refactor', 'philosophical', 'deep-dive', 'optimization', 
            'strategic', 'blueprint', 'debug', 'architecture'
        ];

        this.stats = {
            flashTasks: 0,
            opusTasks: 0,
            savingsEstimate: 0
        };
    }

    /**
     * Determines the optimal model for a task with Swarm Collective Intelligence. [SH-1100]
     * @param {Object} task - Task object { type, content, priority }
     * @param {Object} swarmState - Optional swarm state listener
     * @returns {string} - Model ID
     */
    async getProvider(task, swarmState = null) {
        const { type, content = '', priority = 'LOW' } = task;

        // 1. Swarm-Driven Failure Signal (SH-1100)
        if (swarmState && typeof swarmState.getRecentFailureRate === 'function') {
            const failureRate = await swarmState.getRecentFailureRate(type);
            
            // If the swarm reports high failure (> 30%) for this task type, 
            // force escalation regardless of standard logic.
            if (failureRate > 0.3) {
                console.warn(`🛰️ Swarm Failure Signal Detected: Escalating ${type} to OPUS.`);
                this.stats.opusTasks++;
                return this.models.OPUS;
            }
        }

        // 2. Mandatory Overrides (T3/T4)
        if (priority === 'CRITICAL' || type === 'ARCHITECTURE') {
            this.stats.opusTasks++;
            return this.models.OPUS;
        }

        // 3. Keyword-Based Escalation (T3)
        const hasSignal = this.highComplexityKeywords.some(sig => 
            content.toLowerCase().includes(sig)
        );

        if (hasSignal) {
            this.stats.opusTasks++;
            return this.models.OPUS;
        }

        // 4. Efficiency Default (T1/T2)
        this.stats.flashTasks++;
        return this.models.FLASH;
    }

    /**
     * SH-700 Integration: Get Savings/Efficiency Metrics
     */
    getStats() {
        // Mock calculation: Opus cost is ~25x Flash cost
        const opusCostBase = 1.0;
        const flashCostBase = 0.04;

        const baselineCost = (this.stats.flashTasks + this.stats.opusTasks) * opusCostBase;
        const actualCost = (this.stats.flashTasks * flashCostBase) + (this.stats.opusTasks * opusCostBase);
        
        return {
            totalTasks: this.stats.flashTasks + this.stats.opusTasks,
            distribution: {
                flash: this.stats.flashTasks,
                opus: this.stats.opusTasks
            },
            savings: baselineCost - actualCost,
            efficiencyPercent: baselineCost > 0 ? ((baselineCost - actualCost) / baselineCost) * 100 : 100
        };
    }
}
