import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Search, Filter, Maximize, RefreshCw, Download, Network, Briefcase, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { graphApi, casesApi } from '../services/api';

const DEFAULT_ELEMENTS = [
  { data: { id: 'p1', label: 'John Doe', type: 'Person', status: 'VERIFIED' } },
  { data: { id: 'p2', label: 'Jane Smith', type: 'Person', status: 'OBSERVED' } },
  { data: { id: 'ph1', label: '+1 555-0192', type: 'Phone', status: 'INFERRED' } },
  { data: { id: 'c1', label: 'Corp Inc', type: 'Organization', status: 'FLAGGED' } },
  { data: { id: 'a1', label: 'ACC-892', type: 'Account', status: 'VERIFIED' } },
  { data: { id: 'e1', source: 'p1', target: 'ph1', label: 'OWNS', status: 'VERIFIED' } },
  { data: { id: 'e2', source: 'p2', target: 'ph1', label: 'CALLED', status: 'OBSERVED' } },
  { data: { id: 'e3', source: 'p1', target: 'c1', label: 'DIRECTOR', status: 'INFERRED' } },
  { data: { id: 'e4', source: 'c1', target: 'a1', label: 'OWNS', status: 'FLAGGED' } },
  { data: { id: 'e5', source: 'p2', target: 'a1', label: 'TRANSFERRED_TO', status: 'VERIFIED' } }
];

export default function GraphExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [elements, setElements] = useState<any[]>(DEFAULT_ELEMENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [selectedCaseId]);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases for graph:", err);
    }
  };

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const data = await graphApi.get(selectedCaseId || undefined);
      if (data.nodes && data.nodes.length > 0) {
        const cyNodes = data.nodes.map((n: any) => ({
          data: { id: n.id, label: n.name, type: n.type, status: n.status }
        }));
        const cyEdges = (data.edges || []).map((e: any) => ({
          data: { id: e.id, source: e.source_entity_id, target: e.target_entity_id, label: e.type, status: e.status }
        }));
        setElements([...cyNodes, ...cyEdges]);
      } else {
        setElements(DEFAULT_ELEMENTS);
      }
    } catch (err) {
      console.error("Graph fetch error:", err);
      setElements(DEFAULT_ELEMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-color': (ele) => {
              const status = ele.data('status');
              if (status === 'VERIFIED') return '#10B981';
              if (status === 'OBSERVED') return '#3B82F6';
              if (status === 'INFERRED') return '#F59E0B';
              if (status === 'FLAGGED') return '#EF4444';
              return '#6366F1';
            },
            'color': '#F8FAFC',
            'font-family': 'Inter, sans-serif',
            'font-size': '12px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-color': '#0F172A',
            'text-background-opacity': 0.85,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'color': '#94A3B8',
            'text-background-color': '#0A0E17',
            'text-background-opacity': 1,
            'text-background-padding': '2px'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#F8FAFC',
            'line-color': '#3B82F6',
            'target-arrow-color': '#3B82F6'
          }
        }
      ],
      layout: {
        name: 'cose',
        padding: 50,
        animate: false
      }
    });

    cy.on('tap', 'node', (evt) => {
      setSelectedNode(evt.target.data());
    });
    
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [elements]);

  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.layout({ name: 'cose', animate: true }).run();
      cyRef.current.fit();
    }
  };

  return (
    <div className="flex h-full bg-canvas relative">
      {/* Main Graph Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-panel border border-border rounded-lg p-1.5 shadow-lg">
            <Briefcase className="w-4 h-4 text-primary ml-2" />
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-canvas border border-border rounded px-3 py-1 text-xs text-text-main font-mono focus:outline-none focus:border-primary"
            >
              <option value="">All Case Networks</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.case_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <button onClick={handleReset} className="p-2 bg-panel border border-border shadow-lg rounded text-text-secondary hover:text-text-main hover:bg-elevated transition-colors" title="Reset Layout">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Status Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-panel/90 backdrop-blur-md border border-border shadow-lg rounded-lg p-3 flex space-x-4 text-xs font-mono">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>Verified</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Observed</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>Inferred</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span>Flagged</div>
        </div>

        {/* Cytoscape Container */}
        <div ref={containerRef} className="w-full h-full bg-canvas" />
      </div>

      {/* Inspector Sidebar */}
      {selectedNode && (
        <div className="w-80 bg-panel border-l border-border flex flex-col shadow-2xl z-20">
          <div className="p-4 border-b border-border bg-elevated/50">
            <h3 className="font-heading text-lg font-bold text-text-main">{selectedNode.label}</h3>
            <p className="text-xs text-text-secondary font-mono mt-1">{selectedNode.id} • {selectedNode.type}</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-6 font-mono text-xs">
            <div>
              <h4 className="text-text-secondary uppercase mb-2">Evidence Status</h4>
              <span className={cn(
                "inline-block px-2 py-1 rounded text-xs font-semibold border uppercase tracking-wider",
                selectedNode.status === 'VERIFIED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                selectedNode.status === 'OBSERVED' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                selectedNode.status === 'INFERRED' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}>
                {selectedNode.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
