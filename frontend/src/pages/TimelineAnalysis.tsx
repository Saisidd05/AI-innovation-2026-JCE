import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, Activity, AlertTriangle, CheckCircle, Briefcase, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { timelineApi, casesApi } from '../services/api';

export default function TimelineAnalysis() {
  const [events, setEvents] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchCases();
    fetchTimeline();
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [selectedCaseId]);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases:", err);
    }
  };

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const data = await timelineApi.get(selectedCaseId || undefined);
      setEvents(data);
    } catch (err) {
      console.error("Timeline fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-canvas p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center space-x-3">
            <Clock className="w-6 h-6 text-primary" />
            <span>Chronological Event Timeline</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Sequential reconstruction of intelligence events and timestamps</p>
        </div>

        <div className="flex items-center space-x-3">
          <Briefcase className="w-4 h-4 text-primary" />
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-panel border border-border rounded px-3 py-1.5 text-xs text-text-main font-mono focus:outline-none focus:border-primary"
          >
            <option value="">All Case Timelines</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_name}
              </option>
            ))}
          </select>
          <button 
            onClick={fetchTimeline}
            className="p-2 bg-elevated border border-border rounded text-text-secondary hover:text-text-main"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Event Ledger */}
      <div className="flex-1 bg-panel border border-border rounded-lg overflow-hidden flex flex-col shadow-lg">
        <div className="p-4 border-b border-border bg-elevated/40 flex justify-between items-center">
          <h3 className="font-heading font-bold text-text-main text-sm uppercase font-mono tracking-wider">Event Sequence Ledger</h3>
          <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-semibold">
            {events.length} Events Recorded
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm">
              Fetching chronological event telemetry...
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm space-y-2">
              <Clock className="w-10 h-10 mx-auto opacity-30 text-primary" />
              <p>No timeline events recorded yet for this case docket.</p>
              <p className="text-xs text-text-secondary opacity-60">Upload CSV datasets containing timestamped actions to generate events.</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <div key={event.id} className="relative pl-8 pb-4">
                {idx !== events.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-border"></div>
                )}
                
                <div className={cn(
                  "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-panel shadow",
                  event.status === 'VERIFIED' ? "bg-emerald-500" :
                  event.status === 'OBSERVED' ? "bg-blue-500" :
                  event.status === 'INFERRED' ? "bg-amber-500" :
                  "bg-rose-500"
                )}></div>

                <div className="bg-elevated border border-border rounded-lg p-4 hover:border-primary/50 transition-colors shadow-sm space-y-2 font-mono">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-primary font-bold">{event.date_time ? new Date(event.date_time).toLocaleString() : 'Undated Event'}</span>
                      <span className="bg-canvas border border-border px-2 py-0.5 rounded text-text-secondary font-semibold uppercase">{event.event_type || 'ACTIVITY'}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border",
                      event.status === 'VERIFIED' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                      event.status === 'OBSERVED' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                      event.status === 'INFERRED' ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                      "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    )}>
                      {event.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm text-text-main font-sans font-semibold">{event.description}</h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
