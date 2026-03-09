/**
 * RevenueController.js
 * [SH-1400] The High-Fidelity "Revenue" Tab
 * Handles the logic for rendering the Revenue HUD.
 */

export class RevenueController {
    constructor(supabase) {
        this.supabase = supabase;
        this.charts = {
            funnel: null,
            pmfGauge: null,
            revenueHistory: null
        };
        this.currentProductId = null;
    }

    async init() {
        console.log("💰 Revenue Controller: Initializing HUD...");
        await this.loadPortfolioMetrics();
        this.initCharts();
        this.subscribeToMetrics();
    }

    async loadPortfolioMetrics() {
        const { data: metrics, error } = await this.supabase
            .from('market_metrics')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error("Revenue: Failed to fetch metrics:", error.message);
            return;
        }

        this.processMetrics(metrics);
    }

    processMetrics(metrics) {
        const counts = { VISIT: 0, CLICK: 0, SIGNUP: 0, CONVERSION: 0, VALUE: 0 };
        (metrics || []).forEach(m => {
            if (m.event_type === 'CONVERSION') {
                counts.CONVERSION++;
                counts.VALUE += m.value;
            } else if (counts[m.event_type] !== undefined) {
                counts[m.event_type] += m.value;
            }
        });

        // Update UI Big Numbers
        const mrrEl = document.getElementById('mrr-forecast');
        const visitsEl = document.getElementById('total-visits');
        const convEl = document.getElementById('total-conversions');

        if (mrrEl) mrrEl.innerText = `$${Math.round(counts.VALUE).toLocaleString()}`;
        if (visitsEl) visitsEl.innerText = counts.VISIT.toLocaleString();
        if (convEl) convEl.innerText = counts.CONVERSION.toLocaleString();

        // Calculate PMF Score (Normalized 0-100)
        // Logic: (Signups / Visits) * Multiplier (Benchmark: 2% signup rate is good)
        const pmfScore = counts.VISIT > 0 ? (counts.SIGNUP / counts.VISIT) * 500 : 0; 
        const normalizedPMF = Math.min(Math.round(pmfScore), 100);
        this.updatePMF(normalizedPMF);

        // Update Funnel Chart
        this.updateFunnelChart(counts);
    }

    initCharts() {
        const pmfEl = document.querySelector("#pmfGaugeChart");
        if (pmfEl) {
            const gaugeOptions = {
                series: [0],
                chart: { height: 300, type: 'radialBar', toolbar: { show: false } },
                plotOptions: {
                    radialBar: {
                        startAngle: -135, endAngle: 135,
                        hollow: { size: '70%' },
                        dataLabels: {
                            name: { fontSize: '12px', color: '#FFD700', offsetY: 120, text: 'PMF SCORE' },
                            value: { offsetY: 76, fontSize: '36px', color: '#fff', fontWeight: 'bold', formatter: (val) => val + '%' }
                        },
                        track: { background: "rgba(255, 255, 255, 0.05)", strokeWidth: '97%' }
                    }
                },
                fill: { type: 'gradient', gradient: { shade: 'dark', type: 'horizontal', gradientToColors: ['#A855F7'], stops: [0, 100] } },
                stroke: { lineCap: 'round' },
                labels: ['PMF']
            };
            this.charts.pmfGauge = new ApexCharts(pmfEl, gaugeOptions);
            this.charts.pmfGauge.render();
        }

        const funnelEl = document.querySelector("#revenueFunnelChart");
        if (funnelEl) {
            const funnelOptions = {
                series: [{ name: "Funnel", data: [0, 0, 0, 0] }],
                chart: { type: 'bar', height: 350, toolbar: { show: false } },
                plotOptions: {
                    bar: { borderRadius: 0, horizontal: true, distributed: true, isFunnel: true }
                },
                colors: ['#A855F7', '#A855F7', '#FFD700', '#FFD700'],
                dataLabels: { enabled: true, formatter: (val, opt) => opt.w.globals.labels[opt.dataPointIndex] + ': ' + val, dropShadow: { enabled: true } },
                xaxis: { categories: ['Visits', 'Clicks', 'Signups', 'Revenue'] },
                legend: { show: false }
            };
            this.charts.funnel = new ApexCharts(funnelEl, funnelOptions);
            this.charts.funnel.render();
        }
    }

    updatePMF(score) {
        if (this.charts.pmfGauge) this.charts.pmfGauge.updateSeries([score]);
        const needle = document.getElementById('pmf-needle');
        if (needle) {
            const rotation = (score / 100 * 180) - 90; // Align with gauge range
            needle.style.transform = `rotate(${rotation}deg)`;
        }
    }

    updateFunnelChart(counts) {
        if (this.charts.funnel) {
            this.charts.funnel.updateSeries([{
                name: "Funnel",
                data: [counts.VISIT, counts.CLICK, counts.SIGNUP, counts.CONVERSION]
            }]);
        }
    }

    subscribeToMetrics() {
        this.supabase
            .channel('public:market_metrics')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'market_metrics' }, () => {
                this.loadPortfolioMetrics();
            })
            .subscribe();
    }

    async loadDeployments() {
        const { data: manifests } = await this.supabase
            .from('deployment_manifests')
            .select('*, product_blueprints(name)');
        
        const grid = document.getElementById('deployment-table-body');
        if (!grid) return;

        grid.innerHTML = '';
        (manifests || []).forEach(m => {
            const tr = document.createElement('tr');
            tr.className = "deployment-row h-14 border-b border-white/5 hover:bg-white/[0.02]";
            
            // SECURITY: Sanitize live_url and use safe assignment
            const safeUrl = (m.live_url || '').startsWith('http') ? m.live_url : '#';
            const productName = m.product_blueprints?.name || 'Unknown';
            const slug = m.subdomain_slug || 'alpha';
            
            tr.innerHTML = `
                <td class="px-6 font-bold text-white text-xs name-target"></td>
                <td class="px-6 font-mono text-[10px] text-[#8B5CF6]/60 italic slug-target"></td>
                <td class="px-6">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[9px] font-bold text-emerald-400 uppercase status-target"></span>
                    </div>
                </td>
                <td class="px-6 text-[10px] text-white/40 font-mono time-target"></td>
                <td class="px-6 text-right">
                    <a href="${safeUrl}" target="_blank" class="px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[8px] font-bold uppercase rounded hover:bg-gold/20">Visit</a>
                </td>
            `;
            
            tr.querySelector('.name-target').textContent = productName;
            tr.querySelector('.slug-target').textContent = `${slug}.sovereign.hub`;
            tr.querySelector('.status-target').textContent = m.deployment_status;
            tr.querySelector('.time-target').textContent = new Date(m.last_deployed || m.created_at).toLocaleTimeString();
            
            grid.appendChild(tr);
        });
    }
}
