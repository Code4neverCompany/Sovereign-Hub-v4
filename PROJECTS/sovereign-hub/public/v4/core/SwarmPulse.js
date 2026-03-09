/**
 * SwarmPulse.js (SH-1100)
 * Logic for Neural Connectivity and Collective Intelligence.
 */

export class SwarmPulse {
    constructor(supabase) {
        this.supabase = supabase;
        this.pulseData = { nodes: [], links: [] };
        this.agentMap = {
            'Alex': { role: 'Research Analyst', color: '#3B82F6', emoji: '🔍' },
            'Maya': { role: 'Content Writer', color: '#7C3AED', emoji: '✍️' },
            'Jordan': { role: 'Marketing Strategist', color: '#F59E0B', emoji: '📊' },
            'Dev': { role: 'Full Stack Developer', color: '#10B981', emoji: '💻' },
            'Sam': { role: 'Social Media Manager', color: '#EC4899', emoji: '📱' }
        };
    }

    async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.render();
        this.subscribe();
    }

    render() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 450;
        const agents = Object.keys(this.agentMap);

        this.pulseData.nodes = [
            { id: 'HIVE_MIND', type: 'HUB', x: width / 2, y: height / 2, fx: width / 2, fy: height / 2 },
            ...agents.map(name => ({ 
                id: name, 
                type: 'AGENT', 
                color: this.agentMap[name].color,
                emoji: this.agentMap[name].emoji
            }))
        ];

        this.pulseData.links = agents.map(name => ({
            source: 'HIVE_MIND',
            target: name
        }));

        d3.select(this.container).selectAll('svg').remove();
        const svg = d3.select(this.container).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`);

        const defs = svg.append('defs');
        const hubGrad = defs.append('radialGradient').attr('id', 'hubGrad');
        hubGrad.append('stop').attr('offset', '0%').attr('stop-color', '#FFD700').attr('stop-opacity', 0.8);
        hubGrad.append('stop').attr('offset', '100%').attr('stop-color', '#FFD700').attr('stop-opacity', 0);

        this.sim = d3.forceSimulation(this.pulseData.nodes)
            .force('link', d3.forceLink(this.pulseData.links).id(d => d.id).distance(180))
            .force('charge', d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll('line')
            .data(this.pulseData.links)
            .join('line')
            .attr('class', 'pulse-link')
            .attr('stroke', 'rgba(212, 175, 55, 0.1)')
            .attr('stroke-dasharray', '4');

        const node = svg.append('g')
            .selectAll('g')
            .data(this.pulseData.nodes)
            .join('g')
            .attr('class', 'pulse-node');

        node.each(function(d) {
            const el = d3.select(this);
            if (d.type === 'HUB') {
                el.append('circle').attr('r', 40).attr('fill', 'url(#hubGrad)');
                el.append('circle').attr('r', 10).attr('fill', '#FFD700').attr('class', 'animate-pulse');
            } else {
                el.append('circle').attr('r', 20).attr('fill', 'rgba(255,255,255,0.03)').attr('stroke', d.color).attr('stroke-width', 1);
                el.append('text').text(d.emoji).attr('text-anchor', 'middle').attr('dy', 5).attr('font-size', '16px');
                el.append('text').text(d.id).attr('text-anchor', 'middle').attr('dy', 30).attr('font-size', '9px').attr('font-weight', 'bold').attr('fill', 'rgba(212,175,55,0.4)');
            }
        });

        this.sim.on('tick', () => {
            link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    subscribe() {
        this.supabase.channel('public:swarm_knowledge')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'swarm_knowledge' }, (payload) => {
                this.triggerPulse(payload.new);
            })
            .subscribe();
    }

    triggerPulse(entry) {
        const agentNode = this.pulseData.nodes.find(n => n.id === entry.agent_id);
        if (!agentNode) return;
        
        const isContribution = entry.type !== 'QUERY';
        const color = isContribution ? '#FFD700' : '#A855F7';
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const svg = d3.select(this.container).select('svg');
        
        const particle = svg.append('circle')
            .attr('r', 4)
            .attr('fill', color)
            .attr('filter', `drop-shadow(0 0 4px ${color})`);

        const hubPos = { x: width/2, y: height/2 };
        const start = isContribution ? agentNode : hubPos;
        const end = isContribution ? hubPos : agentNode;

        particle.attr('cx', start.x).attr('cy', start.y)
            .transition().duration(1200).ease(d3.easeCubicInOut)
            .attr('cx', end.x).attr('cy', end.y)
            .remove();
    }
}
