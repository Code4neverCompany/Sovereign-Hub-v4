/**
 * 🛰️ Sovereign Hub v4.0 - Swarm Pulse [SH-1100]
 * Materialized by Dev (Phase 4)
 * High-performance SVG knowledge flow visualization using D3.js.
 */

class SwarmPulse {
  constructor(containerId) {
    this.containerId = containerId;
    this.nodes = [];
    this.links = [];
    this.width = window.innerWidth;
    this.height = 400;
    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.height)
      .style('background', '#0A0A0A');

    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', () => this.ticked());

    this.linkGroup = this.svg.append('g').attr('class', 'links');
    this.nodeGroup = this.svg.append('g').attr('class', 'nodes');

    // Central "Hive Mind" Node
    this.hiveNode = { id: 'hive', name: 'HIVE MIND', type: 'HUB', x: this.width / 2, y: this.height / 2, fixed: true };
    this.addNode(this.hiveNode);
  }

  addNode(node) {
    if (!this.nodes.find(n => n.id === node.id)) {
      this.nodes.push(node);
      this.update();
    }
  }

  addPulse(sourceId, targetId, color = '#00f3ff') {
    const link = { source: sourceId, target: targetId, id: `${sourceId}-${targetId}-${Date.now()}` };
    this.links.push(link);
    this.update();

    // Remove link after a few seconds to simulate a "pulse"
    setTimeout(() => {
      this.links = this.links.filter(l => l.id !== link.id);
      this.update();
    }, 2000);
  }

  update() {
    // Update links
    const link = this.linkGroup.selectAll('line').data(this.links, d => d.id);
    link.exit().remove();
    const linkEnter = link.enter().append('line')
      .attr('stroke', d => d.color || '#fbbf24')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Update nodes
    const node = this.nodeGroup.selectAll('circle').data(this.nodes, d => d.id);
    const nodeEnter = node.enter().append('circle')
      .attr('r', d => d.type === 'HUB' ? 15 : 8)
      .attr('fill', d => d.type === 'HUB' ? '#00f3ff' : '#fbbf24')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .call(d3.drag()
        .on('start', (event, d) => this.dragstarted(event, d))
        .on('drag', (event, d) => this.dragged(event, d))
        .on('end', (event, d) => this.dragended(event, d)));

    nodeEnter.append('title').text(d => d.name || d.id);

    this.simulation.nodes(this.nodes);
    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  ticked() {
    this.linkGroup.selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.nodeGroup.selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  dragstarted(event, d) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragended(event, d) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Global initialization
window.SwarmPulse = SwarmPulse;
