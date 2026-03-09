/**
 * dataTransformer.js
 * Formats Supabase JSON into ApexCharts series format.
 */

const DataTransformer = {
    /**
     * Transforms token_usage records into a time-series for an Area Chart.
     * Expected format: [{ x: timestamp, y: total_tokens }]
     */
    toTokenTimeSeries(data) {
        if (!data || data.length === 0) return [];
        
        // Sort by timestamp
        const sorted = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return sorted.map(item => ({
            x: new Date(item.timestamp).getTime(),
            y: item.total_tokens || 0
        }));
    },

    /**
     * Aggregates execution_time_ms by agent_id for a Bar Chart.
     * Expected format: { categories: [agent_ids], series: [avg_latencies] }
     */
    toAgentLatencyComparison(data) {
        if (!data || data.length === 0) return { categories: [], series: [] };

        const stats = {};
        data.forEach(item => {
            if (!stats[item.agent_id]) {
                stats[item.agent_id] = { total: 0, count: 0 };
            }
            stats[item.agent_id].total += item.execution_time_ms || 0;
            stats[item.agent_id].count += 1;
        });

        const categories = Object.keys(stats);
        const series = categories.map(agent => Math.round(stats[agent].total / stats[agent].count));

        return { categories, series };
    },

    /**
     * Groups status by count for a Donut Chart.
     * Expected format: { labels: [statuses], series: [counts] }
     */
    toStatusDistribution(data) {
        if (!data || data.length === 0) return { labels: [], series: [] };

        const distribution = {};
        data.forEach(item => {
            const status = item.status || 'unknown';
            distribution[status] = (distribution[status] || 0) + 1;
        });

        return {
            labels: Object.keys(distribution),
            series: Object.values(distribution)
        };
    }
};

// Export for use in index.html (Simple browser global for Slim-Stack)
window.DataTransformer = DataTransformer;
