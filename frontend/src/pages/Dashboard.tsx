import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { casesApi, hackerAiApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Database, 
  Bot, 
  Network, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  ArrowRight,
  Search,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const fetchedCases = await casesApi.getAll();
      setCases(fetchedCases);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard statistics from backend server.");
    } finally {
      setLoading(false);
    }
  };

  const activeCases = cases.filter(c => c.status === 'ACTIVE').length;
  const reviewCases = cases.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'REVIEW').length;
  const closedCases = cases.filter(c => c.status === 'CLOSED' || c.status === 'ARCHIVED').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-panel border border-border rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-heading font-bold text-text-main">
              COMMAND DASHBOARD
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-primary/10 border border-primary/30 text-primary uppercase">
              {user?.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Welcome back, <span className="text-text-main font-semibold">{user?.full_name}</span>. Access clearance granted for <span className="text-primary font-mono">{user?.department || 'Forensics Intelligence'}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'INVESTIGATION_ADMIN' || user?.role === 'INVESTIGATOR') && (
            <button
              onClick={() => navigate('/cases')}
              className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Case</span>
            </button>
          )}

          <button
            onClick={() => navigate('/hacker-ai')}
            className="bg-elevated hover:bg-panel border border-border text-text-main px-4 py-2 rounded text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all"
          >
            <Bot className="w-4 h-4 text-accent" />
            <span>Launch Hacker AI</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-panel border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-secondary">Total Investigations</p>
            <p className="text-2xl font-bold font-mono text-text-main mt-1">{loading ? '...' : cases.length}</p>
          </div>
          <div className="w-10 h-10 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-secondary">Active Operations</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{loading ? '...' : activeCases}</p>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-secondary">Pending Verification</p>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{loading ? '...' : reviewCases}</p>
          </div>
          <div className="w-10 h-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-secondary">Archived / Closed</p>
            <p className="text-2xl font-bold font-mono text-text-secondary mt-1">{loading ? '...' : closedCases}</p>
          </div>
          <div className="w-10 h-10 rounded bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-text-secondary">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Case Explorer Card */}
        <div 
          onClick={() => navigate('/cases')}
          className="bg-panel border border-border rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-primary flex items-center group-hover:translate-x-1 transition-transform">
                Explore Cases <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-main">Case Management</h3>
            <p className="text-xs text-text-secondary">
              Create, view, assign, and manage investigative cases and target entities.
            </p>
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
            <span>{cases.length} Total Cases</span>
            <span className="text-emerald-400">Live API</span>
          </div>
        </div>

        {/* Hacker AI Card */}
        <div 
          onClick={() => navigate('/hacker-ai')}
          className="bg-panel border border-border rounded-lg p-5 hover:border-accent/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-accent flex items-center group-hover:translate-x-1 transition-transform">
                Ask Assistant <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-main">Hacker AI RAG Engine</h3>
            <p className="text-xs text-text-secondary">
              Ask questions over ingested case datasets with citation-backed evidence links.
            </p>
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
            <span>Semantic Vector Store</span>
            <span className="text-accent">Groq / SentenceTransformers</span>
          </div>
        </div>

        {/* Dataset Ingestion Card */}
        <div 
          onClick={() => navigate('/upload')}
          className="bg-panel border border-border rounded-lg p-5 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-purple-400 flex items-center group-hover:translate-x-1 transition-transform">
                Ingest Data <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-main">Dataset Ingestion</h3>
            <p className="text-xs text-text-secondary">
              Upload CSV evidence files to automatically extract entities, relationships, and events.
            </p>
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono text-text-secondary">
            <span>Auto Extraction</span>
            <span className="text-purple-400">CSV Vectorizer</span>
          </div>
        </div>
      </div>

      {/* Active Cases List Preview */}
      <div className="bg-panel border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-heading font-bold text-text-main flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span>Active Cases Overview</span>
          </h2>
          <button 
            onClick={() => navigate('/cases')}
            className="text-xs font-mono text-primary hover:underline"
          >
            View All Cases →
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-text-secondary font-mono text-sm">
            Fetching case telemetry from backend...
          </div>
        ) : cases.length === 0 ? (
          <div className="p-8 text-center text-text-secondary font-mono text-sm space-y-3">
            <p>No cases registered in database.</p>
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'INVESTIGATION_ADMIN' || user?.role === 'INVESTIGATOR') && (
              <button
                onClick={() => navigate('/cases')}
                className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded text-xs font-mono"
              >
                Create First Case
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {cases.slice(0, 5).map((c: any) => (
              <div 
                key={c.id} 
                onClick={() => navigate('/cases')}
                className="py-3 flex items-center justify-between hover:bg-elevated/50 px-2 rounded transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-sm text-text-main font-heading">{c.case_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      c.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-1">{c.description || 'No description provided.'}</p>
                </div>

                <div className="flex items-center space-x-6 text-xs font-mono text-text-secondary">
                  <div>
                    <span className="text-text-main font-bold">{c.entity_count}</span> entities
                  </div>
                  <div>
                    <span className="text-text-main font-bold">{c.relationship_count}</span> relations
                  </div>
                  <div>
                    <span className="text-text-main font-bold">{c.source_count}</span> files
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
