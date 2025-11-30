import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FlowData, FlowNode } from '../types';

interface VisualizerProps {
  data: FlowData;
  currentNodeId: string;
  onNodeClick: (id: string) => void;
}

// Layout configuration - SIGNIFICANTLY INCREASED FOR READABILITY
const NODE_WIDTH = 300; 
const NODE_HEIGHT = 160; 
const LAYER_SPACING = 450; // More horizontal space for edge labels
const NODE_SPACING = 220; // More vertical breathing room

const Visualizer: React.FC<VisualizerProps> = ({ data, currentNodeId, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 800;
    
    // Clear previous renders
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup SVG and Zoom behavior
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      // Close inspector when clicking background
      .on("click", () => setInspectedNodeId(null));
      
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 1.5]) // Limit zoom out to prevent tiny text
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Define Arrow Marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 0) // We manually offset in the path
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#94a3b8"); // Slate-400

    // --- 1. Compute Layout (BFS Layering) ---
    
    interface GraphNode {
      id: string;
      data: FlowNode;
      layer: number;
      indexInLayer: number;
      x: number;
      y: number;
    }

    interface GraphLink {
      source: GraphNode;
      target: GraphNode;
      isBackwards: boolean;
      label?: string;
    }

    const graphNodes: Map<string, GraphNode> = new Map();
    const links: GraphLink[] = [];

    // Initialize nodes map
    Object.values(data).forEach((node: FlowNode) => {
      graphNodes.set(node.id, {
        id: node.id,
        data: node,
        layer: -1,
        indexInLayer: 0,
        x: 0,
        y: 0
      });
    });

    // BFS to assign layers (Depth)
    const queue: { id: string, layer: number }[] = [{ id: 'root', layer: 0 }];
    const visited = new Set<string>();
    const layerCounts: { [key: number]: number } = {};

    while (queue.length > 0) {
      const { id, layer } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const node = graphNodes.get(id);
      if (node) {
        node.layer = layer;
        node.indexInLayer = layerCounts[layer] || 0;
        layerCounts[layer] = (layerCounts[layer] || 0) + 1;

        // Find neighbors
        const targets: string[] = [];
        node.data.options?.forEach(opt => targets.push(opt.nextId));
        if (node.data.progressionLink) targets.push(node.data.progressionLink.nextId);

        targets.forEach(targetId => {
          if (!visited.has(targetId)) {
            queue.push({ id: targetId, layer: layer + 1 });
          }
        });
      }
    }

    // Assign Coordinates
    graphNodes.forEach(node => {
      // If a node was unreachable (layer -1), we can just hide it or place it at 0
      const safeLayer = node.layer === -1 ? 0 : node.layer;
      
      // Calculate Y to center the layer vertically around the middle
      const totalInLayer = layerCounts[safeLayer] || 1;
      const layerHeight = totalInLayer * NODE_SPACING;
      const startY = (height / 2) - (layerHeight / 2) + 100;
      
      node.x = safeLayer * LAYER_SPACING + 100;
      node.y = startY + (node.indexInLayer * NODE_SPACING);
    });

    // Create Links
    graphNodes.forEach(sourceNode => {
      // Option Links (Forward)
      sourceNode.data.options?.forEach(opt => {
        const targetNode = graphNodes.get(opt.nextId);
        if (targetNode) {
            const isBackwards = targetNode.layer <= sourceNode.layer;
            links.push({ 
                source: sourceNode, 
                target: targetNode, 
                isBackwards,
                label: opt.label
            });
        }
      });
      // Progression Links
      if (sourceNode.data.progressionLink) {
        const targetNode = graphNodes.get(sourceNode.data.progressionLink.nextId);
        if (targetNode) {
            const isBackwards = targetNode.layer <= sourceNode.layer;
            links.push({ 
                source: sourceNode, 
                target: targetNode, 
                isBackwards,
                label: sourceNode.data.progressionLink.label 
            });
        }
      }
    });

    // --- 2. Render Links ---
    const linkGroup = g.selectAll(".link-group")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link-group");

    // Paths
    linkGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", d => d.isBackwards ? "#475569" : "#64748b")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => d.isBackwards ? "6,6" : "none")
      .attr("marker-end", "url(#arrowhead)")
      .attr("d", d => {
        const sx = d.source.x + NODE_WIDTH;
        const sy = d.source.y + NODE_HEIGHT / 2;
        const tx = d.target.x;
        const ty = d.target.y + NODE_HEIGHT / 2;

        if (d.isBackwards) {
           // Curve underneath for backwards links (loops)
           return `M${d.source.x + NODE_WIDTH/2},${d.source.y + NODE_HEIGHT} 
                   C${d.source.x + NODE_WIDTH/2},${d.source.y + NODE_HEIGHT + 120} 
                    ${d.target.x + NODE_WIDTH/2},${d.target.y + NODE_HEIGHT + 120} 
                    ${d.target.x + NODE_WIDTH/2},${d.target.y + NODE_HEIGHT}`;
        }
        
        // Standard horizontal bezier
        const midX = (sx + tx) / 2;
        return `M${sx},${sy} C${midX},${sy} ${midX},${ty} ${tx - 10},${ty}`; // Stop 10px early for arrow
      });

    // Labels
    linkGroup.each(function(d) {
        if (!d.label) return;
        const sel = d3.select(this);
        
        let x, y;
        if (d.isBackwards) {
            // Place label at bottom of loop
            x = (d.source.x + d.target.x + NODE_WIDTH) / 2 - 75; // Center 150px width
            y = Math.max(d.source.y, d.target.y) + NODE_HEIGHT + 90;
        } else {
            // Place label in middle of curve
            const sx = d.source.x + NODE_WIDTH;
            const tx = d.target.x;
            const sy = d.source.y + NODE_HEIGHT / 2;
            const ty = d.target.y + NODE_HEIGHT / 2;
            x = (sx + tx) / 2 - 75;
            y = (sy + ty) / 2 - 14;
        }

        sel.append("foreignObject")
            .attr("width", 150)
            .attr("height", 28)
            .attr("x", x)
            .attr("y", y)
            .append("xhtml:div")
            .attr("class", "flex justify-center items-center w-full h-full pointer-events-none") // Ensure clicks pass through
            .html(`
                <span class="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-[11px] font-bold text-slate-300 shadow-lg whitespace-nowrap truncate max-w-full">
                    ${d.label}
                </span>
            `);
    });

    // --- 3. Render Nodes (ForeignObjects) ---
    const nodeSelection = g.selectAll(".node")
      .data(Array.from(graphNodes.values()).filter(n => n.layer !== -1))
      .enter()
      .append("foreignObject")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", NODE_WIDTH)
      .attr("height", NODE_HEIGHT)
      .style("overflow", "visible");

    nodeSelection.append("xhtml:div")
      .style("width", `${NODE_WIDTH}px`)
      .style("height", `${NODE_HEIGHT}px`)
      .html(d => {
        const isActive = d.id === currentNodeId;
        const isResult = d.data.type === 'result';
        
        // Base Colors
        let borderClass = 'border-slate-600';
        let bgClass = 'bg-slate-800';
        let titleColor = 'text-slate-400';
        let contentColor = 'text-slate-300';
        
        // Active State
        if (isActive) {
            borderClass = 'border-indigo-500 ring-2 ring-indigo-500/50';
            bgClass = 'bg-slate-700';
            titleColor = 'text-indigo-300';
            contentColor = 'text-white';
        } else if (isResult) {
            borderClass = 'border-emerald-600/60';
            bgClass = 'bg-slate-800';
            titleColor = 'text-emerald-400';
            contentColor = 'text-emerald-50';
        }

        // Less aggressive truncation
        const contentPreview = d.data.content;

        return `
          <div 
            class="w-full h-full rounded-xl border ${borderClass} ${bgClass} p-5 shadow-2xl 
                   cursor-pointer transition-all duration-200 flex flex-col justify-start relative group
                   hover:scale-105 hover:ring-2 hover:ring-indigo-400 hover:border-indigo-400 hover:z-20"
          >
            <!-- Badge -->
            <div class="flex justify-between items-start mb-3">
               <span class="text-[10px] uppercase font-black tracking-widest ${isResult ? 'text-emerald-500' : 'text-indigo-400'}">
                 ${isResult ? 'Result' : 'Step'}
               </span>
               ${isActive ? '<span class="flex h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)]"></span>' : ''}
            </div>
            
            <!-- Title -->
            <div class="text-xs font-bold ${titleColor} mb-2 leading-tight uppercase tracking-wide">
                ${d.data.title}
            </div>

            <!-- Content -->
            <div class="text-sm font-medium ${contentColor} leading-snug line-clamp-4">
                ${contentPreview}
            </div>

            <!-- Hover Hint Icon -->
            <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
          </div>
        `;
      });
      
    nodeSelection.on("click", (e, d) => {
         e.stopPropagation(); 
         setInspectedNodeId(d.id);
    });

    // --- 4. Auto-Center Active Node (Initial Only) ---
    // Only auto-center if we aren't inspecting something
    if (!inspectedNodeId) {
        const activeNode = graphNodes.get(currentNodeId);
        if (activeNode) {
          const transform = d3.zoomIdentity
            .translate(width / 2 - activeNode.x - NODE_WIDTH / 2, height / 2 - activeNode.y - NODE_HEIGHT / 2)
            .scale(1);
            
          svg.transition().duration(750).call(zoom.transform as any, transform);
        }
    }

  }, [data, currentNodeId]); 

  const inspectedNode = inspectedNodeId ? data[inspectedNodeId] : null;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 overflow-hidden relative border-t border-slate-700">
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur p-4 rounded-xl text-xs text-slate-400 border border-slate-700 shadow-xl pointer-events-none z-10 hidden sm:block">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full border border-indigo-500 bg-slate-700"></div>
            <span className="font-medium text-indigo-200">Current Step</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full border border-emerald-600 bg-slate-800"></div>
            <span className="font-medium text-emerald-200">Result / Roadmap</span>
        </div>
        <div className="mt-3 text-[10px] text-slate-500 border-t border-slate-700 pt-2 leading-relaxed max-w-[150px]">
            Follow lines to trace logic.<br/>Click nodes for details.
        </div>
      </div>

      {/* D3 Canvas */}
      <svg ref={svgRef} className="w-full h-full cursor-move touch-none"></svg>

      {/* Inspector Side Panel (Popover) */}
      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-slate-900/95 border-l border-slate-700 shadow-2xl z-20 overflow-y-auto backdrop-blur-md transform transition-transform duration-300 ease-in-out ${inspectedNode ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {inspectedNode && (
            <div className="p-8 min-h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                    <span className={`text-xs font-bold tracking-wider uppercase px-2 py-1 rounded ${
                        inspectedNode.type === 'result' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-900/50 text-indigo-400'
                    }`}>
                        {inspectedNode.type === 'result' ? 'Recommendation' : 'Question'}
                    </span>
                    </div>
                    <button onClick={() => setInspectedNodeId(null)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6 leading-tight">{inspectedNode.title}</h2>
                <div className="prose prose-invert prose-base text-slate-300 mb-8 leading-relaxed">
                    {inspectedNode.content}
                </div>

                {/* Options Preview */}
                {inspectedNode.type === 'question' && inspectedNode.options && (
                    <div className="mb-8 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Paths</h3>
                        <div className="space-y-3">
                            {inspectedNode.options.map((opt, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm group/opt p-3 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                <span className="text-white font-bold mb-1 sm:mb-0">{opt.label}</span>
                                <span className="text-slate-500 text-xs flex items-center gap-1 group-hover/opt:text-indigo-400 transition-colors">
                                    <span>leads to</span>
                                    <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
                                        {data[opt.nextId]?.title.split(':')[0] || 'Next'}
                                    </span>
                                </span>
                            </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Roadmap Preview */}
                {inspectedNode.roadmap && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Roadmap Preview</h3>
                        <div className="space-y-4">
                            {inspectedNode.roadmap.map((step, idx) => (
                            <div key={idx} className="relative pl-6 border-l-2 border-slate-700">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
                                <div className="text-sm font-bold text-white">{step.title}</div>
                                <div className="text-sm text-slate-400 mt-1 leading-relaxed">{step.description}</div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto pt-8 border-t border-slate-800">
                    <button 
                        onClick={() => {
                        onNodeClick(inspectedNode.id);
                        setInspectedNodeId(null);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Navigate to this Step</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    {inspectedNodeId !== currentNodeId && (
                         <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-wider">
                             Clicking will switch view to Wizard mode
                         </p>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;