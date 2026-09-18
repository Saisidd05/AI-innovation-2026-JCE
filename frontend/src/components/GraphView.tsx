import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const GraphView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        { data: { id: 'a', label: 'Person A' } },
        { data: { id: 'b', label: 'Person B' } },
        { data: { id: 'ab', source: 'a', target: 'b', label: 'communicated' } }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#1f2937',
            'label': 'data(label)',
            'color': '#ffffff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'width': 60,
            'height': 60
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#9ca3af',
            'target-arrow-color': '#9ca3af',
            'target-arrow-shape': 'triangle',
            'label': 'data(label)',
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });
    
    return () => {
      cy.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 border-b text-sm font-semibold flex justify-between items-center">
        <span>Relationship Network</span>
        <div className="flex gap-2">
          <button className="text-xs bg-white px-2 py-1 border rounded hover:bg-slate-50">Filter</button>
          <button className="text-xs bg-white px-2 py-1 border rounded hover:bg-slate-50">Layout</button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 w-full bg-slate-50" />
    </div>
  );
};

export default GraphView;
