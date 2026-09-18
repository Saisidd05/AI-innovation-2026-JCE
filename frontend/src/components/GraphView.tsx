import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { Network, Filter, Maximize2, Layers } from 'lucide-react';

const GraphView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        { data: { id: 'a', label: 'Victor K.', type: 'person' } },
        { data: { id: 'b', label: 'Ghost Sec.', type: 'org' } },
        { data: { id: 'c', label: 'Offshore ACC', type: 'account' } },
        { data: { id: 'ab', source: 'a', target: 'b', label: 'ASSOCIATED_WITH' } },
        { data: { id: 'ac', source: 'a', target: 'c', label: 'TRANSFERRED' } }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4f46e5',
            'label': 'data(label)',
            'color': '#f8fafc',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-size': '11px',
            'text-margin-y': 6,
            'width': 40,
            'height': 40,
            'border-width': 2,
            'border-color': '#818cf8',
            'font-family': 'Inter, sans-serif'
          }
        },
        {
          selector: 'node[type="org"]',
          style: {
            'background-color': '#0ea5e9',
            'border-color': '#38bdf8',
            'shape': 'hexagon'
          }
        },
        {
          selector: 'node[type="account"]',
          style: {
            'background-color': '#10b981',
            'border-color': '#34d399',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'color': '#94a3b8',
            'font-family': 'Inter, sans-serif'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1,
        padding: 50
      }
    });
    
    return () => cy.destroy();
  }, []);

  return (
    <div className="glass-panel flex flex-col h-full w-full rounded-2xl overflow-hidden relative group">
      {/* Decorative gradient border top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-2 text-indigo-300">
          <Network size={16} />
          <span className="text-sm font-semibold tracking-wide text-slate-200">Relationship Topology</span>
        </div>
        <div className="flex gap-2">
          <button className="text-xs text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white px-3 py-1.5 border border-white/5 rounded-md flex items-center gap-1.5 transition-all">
            <Filter size={12} /> Filter
          </button>
          <button className="text-xs text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white px-3 py-1.5 border border-white/5 rounded-md flex items-center gap-1.5 transition-all">
            <Layers size={12} /> Layout
          </button>
          <button className="p-1.5 text-slate-400 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md transition-all">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      
      {/* Graph Container */}
      <div className="flex-1 w-full relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#0a0f1c]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xOSAxOWgtMTh2LTE4aDE4djE4eiIgZmlsbD0iIzFlMjkzYiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50"></div>
        <div ref={containerRef} className="absolute inset-0 z-10" />
      </div>
    </div>
  );
};

export default GraphView;
