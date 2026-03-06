/**
 * NodeGenesis.js - Sovereign Hub v4.0 Middleware
 * 
 * Logic that monitors Hive load and decides when to spawn a new physical node.
 * Integrates with SwarmPulse for telemetry and InfraManager for provisioning.
 */

import { InfraManager } from './InfraManager.js';

export class NodeGenesis {
    constructor(supabase) {
        this.supabase = supabase;
        this.infra = new InfraManager(supabase);
        this.metricsBuffer = [];
        this.scaleThresholds = {
            UP: { cpu: 75, mem: 80, latency: 2000, sustain_count: 5 },
            DOWN: { cpu: 20, mem: 25, sustain_count: 10 }
        };
        this.initialized = false;
    }

    /**
     * Start monitoring the Hive via SwarmPulse.
     */
    async init() {
        if (this.initialized) return;
        console.log("[NodeGenesis] Initializing Growth Monitoring...");
        
        // Start simulation loop for v4.0
        this.startSimulation();
        this.initialized = true;
    }

    /**
     * Simulation loop to mimic telemetry analysis.
     */
    startSimulation() {
        setInterval(() => {
            const mockData = {
                cpu: Math.floor(Math.random() * 100),
                mem: Math.floor(Math.random() * 100),
                latency: Math.floor(Math.random() * 3000)
            };
            this.analyze(mockData);
        }, 60000); // Check every minute
    }

    /**
     * Analyze incoming telemetry to determine if a scaling event is needed.
     * @param {Object} data - Swarm telemetry data
     */
    async analyze(data) {
        this.metricsBuffer.push({ ...data, timestamp: Date.now() });
        this.pruneBuffer();

        const avgCpu = this.getAverage('cpu');
        const avgMem = this.getAverage('mem');
        const avgLatency = this.getAverage('latency');

        console.log(`[NodeGenesis] Heartbeat: CPU ${avgCpu}% | MEM ${avgMem}% | LAT ${avgLatency}ms`);

        if (this.shouldScaleUp(avgCpu, avgMem, avgLatency)) {
            await this.triggerGenesis('SCALE_UP', 'High System Utilization');
        } else if (this.shouldScaleDown(avgCpu, avgMem)) {
            await this.triggerGenesis('SCALE_DOWN', 'Low System Utilization');
        }
    }

    /**
     * Logic to determine if scaling up is required.
     */
    shouldScaleUp(cpu, mem, latency) {
        return (cpu > this.scaleThresholds.UP.cpu || 
                mem > this.scaleThresholds.UP.mem || 
                latency > this.scaleThresholds.UP.latency);
    }

    /**
     * Logic to determine if scaling down is required.
     */
    shouldScaleDown(cpu, mem) {
        return (cpu < this.scaleThresholds.DOWN.cpu && mem < this.scaleThresholds.DOWN.mem);
    }

    /**
     * Trigger a Genesis event (Provisioning or Draining).
     */
    async triggerGenesis(type, reason) {
        console.warn(`[NodeGenesis] TRIGGERING ${type}: ${reason}`);
        
        // 1. Log to Supabase 'scaling_events'
        const { error: scalingError } = await this.supabase
            .from('scaling_events')
            .insert([{ event_type: type, reason: reason }]);

        if (scalingError) console.error("[NodeGenesis] Failed to log scaling event:", scalingError);

        // 2. Call InfraManager to provision/terminate
        if (type === 'SCALE_UP') {
            await this.infra.provisionNewNode();
        } else {
            // Get oldest online node to drain
            const { data } = await this.supabase
                .from('infrastructure_nodes')
                .select('id')
                .eq('status', 'ONLINE')
                .order('created_at', { ascending: true })
                .limit(1);
            
            if (data && data.length > 0) {
                await this.infra.drainNode(data[0].id);
            }
        }
    }

    /**
     * Prune old metrics to maintain the observation window.
     */
    pruneBuffer() {
        const thirtyMinAgo = Date.now() - (30 * 60 * 1000);
        this.metricsBuffer = this.metricsBuffer.filter(m => m.timestamp > thirtyMinAgo);
    }

    getAverage(metric) {
        if (this.metricsBuffer.length === 0) return 0;
        const sum = this.metricsBuffer.reduce((acc, m) => acc + (m[metric] || 0), 0);
        return Math.round(sum / this.metricsBuffer.length);
    }
}

export default NodeGenesis;
