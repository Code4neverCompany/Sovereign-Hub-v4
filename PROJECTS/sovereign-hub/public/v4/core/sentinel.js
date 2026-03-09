/**
 * Sentinel-Trace HUD Module (SH-501)
 * HTML5 Canvas Logic for Radial Infrastructure Monitoring
 * Lux Aesthetic 3.0 Compliance
 */

const SENTINEL_COLORS = {
    void: '#0A0A0B',
    gold: '#FFD700',
    violet: '#A855F7',
    red: '#EF4444',
    emerald: '#10B981',
    amber: '#F59E0B'
};

export class SentinelTrace {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.nodes = [];
        this.pulses = [];
        this.rotation = 0;
        this.lastFrame = 0;
        this.fps = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initial System Core Node
        this.nodes.push({
            id: 'core',
            name: 'SUPABASE_CORE',
            type: 'core',
            r: 0,
            theta: 0,
            status: 'nominal',
            load: 0.1,
            pulseTimer: 0
        });

        this.animate();
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radius = Math.min(this.width, this.height) * 0.4;
    }

    updateNodes(nodeData) {
        // Map Tailscale/Supabase nodes to radial coordinates
        // For now, we simulate placement based on incoming data
        const existingNode = this.nodes.find(n => n.id === nodeData.id);
        if (existingNode) {
            Object.assign(existingNode, nodeData);
            if (nodeData.activity) this.createPulse(existingNode);
        } else {
            // New node placement logic (Spiral/Circular)
            const angle = (this.nodes.length * 137.5) * (Math.PI / 180); // Phyllotaxis spiral
            const dist = this.radius * (0.3 + Math.random() * 0.6);
            this.nodes.push({
                ...nodeData,
                r: dist,
                theta: angle,
                pulseTimer: 0
            });
        }
    }

    createPulse(node) {
        this.pulses.push({
            x: this.centerX + node.r * Math.cos(node.theta + this.rotation),
            y: this.centerY + node.r * Math.sin(node.theta + this.rotation),
            r: 0,
            maxR: 50,
            opacity: 1,
            color: node.type === 'core' ? SENTINEL_COLORS.violet : SENTINEL_COLORS.gold
        });
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
        ctx.lineWidth = 1;

        // Circular rings
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.radius * (i / 4), 0, Math.PI * 2);
            ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(this.centerX - this.radius, this.centerY);
        ctx.lineTo(this.centerX + this.radius, this.centerY);
        ctx.moveTo(this.centerX, this.centerY - this.radius);
        ctx.lineTo(this.centerX, this.centerY + this.radius);
        ctx.stroke();
        
        // Rotating Scanner
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.rotation);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0, 'rgba(0, 242, 255, 0)');
        grad.addColorStop(1, 'rgba(0, 242, 255, 0.1)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, this.radius, -0.2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawNodes(delta) {
        const ctx = this.ctx;
        this.nodes.forEach(node => {
            const worldTheta = node.theta + (node.type === 'core' ? 0 : this.rotation * 0.1);
            const x = this.centerX + node.r * Math.cos(worldTheta);
            const y = this.centerY + node.r * Math.sin(worldTheta);

            // Pulse for activity
            if (node.status === 'active' || node.type === 'core') {
                node.pulseTimer += delta;
                if (node.pulseTimer > 2000) {
                    this.createPulse(node);
                    node.pulseTimer = 0;
                }
            }

            // Draw Node Dot
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.status === 'nominal' ? SENTINEL_COLORS.emerald : SENTINEL_COLORS.amber;
            ctx.fillStyle = ctx.shadowColor;
            ctx.beginPath();
            ctx.arc(x, y, node.type === 'core' ? 6 : 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Labels (Lux 3.0 minimalist)
            if (node.r > 0) {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
                ctx.font = '8px JetBrains Mono';
                ctx.fillText(node.name, x + 8, y + 3);
            }
        });
    }

    drawPulses(delta) {
        const ctx = this.ctx;
        this.pulses = this.pulses.filter(p => p.opacity > 0);
        this.pulses.forEach(p => {
            p.r += delta * 0.05;
            p.opacity -= delta * 0.001;
            
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.globalAlpha = 1.0;
    }

    animate(time) {
        const delta = time - this.lastFrame || 0;
        this.lastFrame = time;
        this.fps = 1000 / delta;

        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.rotation += 0.005;
        this.drawGrid();
        this.drawPulses(delta);
        this.drawNodes(delta);

        requestAnimationFrame((t) => this.animate(t));
    }
}
