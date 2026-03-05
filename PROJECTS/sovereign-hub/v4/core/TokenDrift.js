/**
 * TokenDrift.js
 * Functional pattern-matching engine for visualizing recursive loops and agentic drift.
 * [FORGE_IMPL_CYCLE_01]
 */

export class TokenDrift {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
        this.history = [];
        this.driftThreshold = 0.4; // 40% deviation
        this.loopThreshold = 0.85; // 85% similarity indicates recursive loop
        this.isLooping = false;
    }

    /**
     * Pattern matching logic to detect recursive loops in token sequences.
     * Uses a simplified Levenshtein-style distance or Jaccard similarity.
     */
    detectRecursiveLoop(tokens) {
        if (tokens.length < 10) return false;
        
        // Windowed similarity check
        const half = Math.floor(tokens.length / 2);
        const windowA = tokens.slice(0, half).join(' ');
        const windowB = tokens.slice(half).join(' ');
        
        const similarity = this.calculateSimilarity(windowA, windowB);
        this.isLooping = similarity > this.loopThreshold;
        return this.isLooping;
    }

    calculateSimilarity(a, b) {
        const setA = new Set(a.split(' '));
        const setB = new Set(b.split(' '));
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        return intersection.size / union.size;
    }

    /**
     * Detects "Agentic Drift" - when current intent deviates from initial PRD constraints.
     */
    detectDrift(currentTokens, prdTokens) {
        const similarity = this.calculateSimilarity(currentTokens.join(' '), prdTokens.join(' '));
        const drift = 1 - similarity;
        return drift > this.driftThreshold;
    }

    /**
     * Visualize the drift on the Canvas.
     */
    render(dataPoints) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const step = this.width / (dataPoints.length - 1);
        dataPoints.forEach((p, i) => {
            const x = i * step;
            const y = this.height - (p * this.height);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        
        // Pulse effect if looping
        if (this.isLooping) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
