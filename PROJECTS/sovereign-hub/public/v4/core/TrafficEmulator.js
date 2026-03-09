/**
 * TrafficEmulator.js
 * [SH-1400] The "Simulated Traction" Layer
 * Simulates user behavior based on Market Heat and Product Quality.
 */

export class TrafficEmulator {
    constructor(supabase) {
        this.supabase = supabase;
        this.interval = null;
        this.simulationRateMs = 60000; // Run simulation every minute
    }

    async start() {
        console.log("🚦 Traffic Emulator: Initiated.");
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.simulateStep(), this.simulationRateMs);
        this.simulateStep(); // Initial run
    }

    async stop() {
        if (this.interval) clearInterval(this.interval);
        this.interval = null;
        console.log("🛑 Traffic Emulator: Halted.");
    }

    async simulateStep() {
        // 1. Get all ACTIVE prototypes (LIVE status)
        const { data: deployments, error } = await this.supabase
            .from('deployment_manifests')
            .select('product_id, product_blueprints(name, market_data, status)')
            .eq('deployment_status', 'LIVE');

        if (error || !deployments) return;

        const batch = [];
        const timestamp = new Date().toISOString();

        for (const dep of deployments) {
            const product = dep.product_blueprints;
            const productId = dep.product_id;
            
            // 2. Calculate Traffic Volume (Base: 5-20 visits per minute based on Heat)
            const heat = product.market_data?.heat || 50;
            const baseVisits = Math.floor((heat / 100) * 15) + 5;
            const visits = Math.floor(Math.random() * baseVisits);

            if (visits > 0) {
                batch.push({ 
                    product_id: productId, 
                    event_type: 'VISIT', 
                    value: visits, 
                    is_simulated: true, 
                    timestamp 
                });
                
                // 3. Conversion Funnel Roll
                // Clicks (10-30% of visits)
                const clickRate = 0.1 + (Math.random() * 0.2);
                const clicks = Math.floor(visits * clickRate);
                if (clicks > 0) {
                    batch.push({ 
                        product_id: productId, 
                        event_type: 'CLICK', 
                        value: clicks, 
                        is_simulated: true, 
                        timestamp 
                    });
                    
                    // Signups (5-15% of clicks)
                    const signupRate = 0.05 + (Math.random() * 0.1);
                    const signups = Math.floor(clicks * signupRate);
                    if (signups > 0) {
                        batch.push({ 
                            product_id: productId, 
                            event_type: 'SIGNUP', 
                            value: signups, 
                            is_simulated: true, 
                            timestamp 
                        });
                        
                        // 4. Conversions / Revenue (Reward better builds with higher conversion rate)
                        let conversionRate = 0.05; // Base 5%
                        if (product.status === 'LIVE') conversionRate += 0.05; 
                        if (heat > 75) conversionRate += 0.05;
                        
                        const conversions = Math.floor(signups * conversionRate);
                        if (conversions > 0) {
                            const value = conversions * 29.00; // Mock $29/mo value
                            batch.push({ 
                                product_id: productId, 
                                event_type: 'CONVERSION', 
                                value: value, 
                                is_simulated: true, 
                                timestamp 
                            });
                        }
                    }
                }
            }
        }

        if (batch.length > 0) {
            const { error: insertError } = await this.supabase
                .from('market_metrics')
                .insert(batch);
            
            if (insertError) {
                console.error("TrafficEmulator: Batch insert failed:", insertError.message);
            }
        }
    }

    async logMetric(productId, type, count, value = 0) {
        // [DEPRECATED] metrics are now batched in simulateStep()
    }
}
