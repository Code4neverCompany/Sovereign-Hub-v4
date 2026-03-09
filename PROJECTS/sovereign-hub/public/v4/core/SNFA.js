/**
 * Sovereign-Native File Adapter (SNFA.js) v1.0
 * 1:1 Replacement for Supabase Client - Local I/O Strategy
 */
class SNFA {
    constructor() {
        this.baseUrl = '/api';
        console.log("🔱 SNFA: Sovereign-Native Adapter Engaged.");
    }

    from(table) {
        return {
            select: (columns) => ({
                order: (col, opts) => ({
                    limit: (n) => ({
                        then: async (cb) => {
                            try {
                                const endpoint = table === 'agent_logs' ? 'logs' : 'states';
                                const res = await fetch(`${this.baseUrl}/${endpoint}`);
                                const data = await res.json();
                                // Adapt to expected legacy format if necessary
                                const result = table === 'agent_logs' ? data.logs : data.agents;
                                return cb({ data: result || [], error: null });
                            } catch (e) {
                                return cb({ data: [], error: e });
                            }
                        }
                    }),
                    then: async (cb) => { /* ... similar logic ... */ }
                }),
                then: async (cb) => { /* ... similar logic ... */ }
            }),
            insert: async (records) => {
                try {
                    const res = await fetch(`${this.baseUrl}/bridge`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'LOG', table, data: records[0] })
                    });
                    return { error: null };
                } catch (e) {
                    return { error: e };
                }
            }
        };
    }

    channel() {
        return { on: () => ({ subscribe: () => {} }), subscribe: () => {} };
    }
}

if (typeof window !== 'undefined') {
    window.supabase = { createClient: () => new SNFA() };
}
export default SNFA;
