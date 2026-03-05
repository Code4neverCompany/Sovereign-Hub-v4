/**
 * SovereignGateway.js
 * [SH-1400] Dynamic Routing Logic
 * Maps internal prototype IDs to public-ready mock URLs.
 */

export class SovereignGateway {
    constructor(supabase) {
        this.supabase = supabase;
        this.routingTable = new Map();
        this.updateInterval = 60000; // Update cache every 1 min
    }

    async init() {
        console.log("🌐 Sovereign Gateway: Powering Up...");
        await this.refreshRoutingTable();
        setInterval(() => this.refreshRoutingTable(), this.updateInterval);
    }

    async refreshRoutingTable() {
        const { data: manifests, error } = await this.supabase
            .from('deployment_manifests')
            .select('*');

        if (error) {
            console.error("Gateway: Failed to fetch routing table:", error.message);
            return;
        }

        manifests.forEach(m => {
            this.routingTable.set(m.subdomain_slug, m);
        });

        console.log(`Gateway: Routing Table Updated. Active Slugs: ${this.routingTable.size}`);
    }

    /**
     * Resolves a public-facing URL from a slug.
     * @param {string} slug - e.g., 'loopshield'
     * @returns {string|null} - e.g., 'loopshield-v1.vercel.app'
     */
    resolve(slug) {
        const manifest = this.routingTable.get(slug);
        if (manifest && manifest.deployment_status === 'LIVE') {
            return manifest.live_url;
        }
        return null;
    }

    /**
     * Generates a new deployment manifest for a product.
     * @param {string} productId 
     * @param {string} slug 
     */
    async provision(productId, slug) {
        // SECURITY FIX: Regex validation for subdomain_slug to prevent injection
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            console.error("Gateway: Invalid subdomain slug:", slug);
            return null;
        }

        const { data, error } = await this.supabase
            .from('deployment_manifests')
            .insert([{
                product_id: productId,
                subdomain_slug: slug,
                provider: 'VERCEL',
                live_url: `https://${slug}.sovereign.hub.mock`, // Mock live URL
                deployment_status: 'PROVISIONING',
                ssl_status: 'PENDING'
            }])
            .select()
            .single();

        if (error) {
            console.error("Gateway: Provisioning failed:", error.message);
            return null;
        }

        console.log(`Gateway: Manifest Provisioned for ${slug}. Initiating deployment sequence...`);
        
        // Mock deployment delay
        setTimeout(async () => {
            await this.supabase
                .from('deployment_manifests')
                .update({ 
                    deployment_status: 'LIVE',
                    ssl_status: 'VALID',
                    last_deployed: new Date().toISOString()
                })
                .eq('id', data.id);
            console.log(`Gateway: Deployment LIVE for ${slug}.`);
            await this.refreshRoutingTable();
        }, 3000);

        return data;
    }
}
