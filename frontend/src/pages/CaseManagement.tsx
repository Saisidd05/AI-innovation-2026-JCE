import React, { useEffect, useState } from 'react';
import { Briefcase, Search, Filter, Plus, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { casesApi } from '../services/api';

export default function CaseManagement() {
  const { user } = useAuthStore();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // New Case Modal state
  const [showModal, setShowModal] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState('');

  const canCreate = ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR'].includes(user?.role || '');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await casesApi.getAll();
      setCases(data);
    } catch (err: any) {
      console.error("Fetch cases error:", err);
      setError("Failed to load cases from backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName.trim()) return;

    try {
      setCreating(true);
      setModalError('');
      await casesApi.create({
        case_name: newCaseName.trim(),
        description: newDescription.trim(),
        status: 'ACTIVE'
      });
      setShowModal(false);
      setNewCaseName('');
      setNewDescription('');
      fetchCases();
    } catch (err: any) {
      console.error("Create case error:", err);
      setModalError(err.response?.data?.detail || "Failed to create case.");
    } fontFinally: {
      setCreating(false);
    }
  };

  const filteredCases = cases.filter(c => 
    c.case_name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-primary" />
            <span>Case Management</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage, query, and assign investigation dockets</p>
        </div>
        
        {canCreate && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center bg-primary hover:bg-primary-light text-white px-4 py-2 rounded transition-all font-mono text-xs uppercase tracking-wider font-semibold shadow-[0_0_12px_rgba(59,130,246,0.3)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case Docket
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-xs font-mono flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-panel border border-border rounded-lg flex-1 flex flex-col overflow-hidden shadow-lg">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-elevated/40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Filter cases by name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-canvas border border-border rounded pl-9 pr-4 py-1.5 text-sm w-72 focus:outline-none focus:border-primary text-text-main font-mono"
            />
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-text-secondary">
            <span>Showing <strong className="text-text-main">{filteredCases.length}</strong> cases</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm">
              Loading cases from database server...
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm space-y-3">
              <p>No investigation cases found matching search criteria.</p>
              {canCreate && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded text-xs font-mono hover:bg-primary/30"
                >
                  Create Case Docket
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-elevated/20 text-xs font-mono uppercase text-text-secondary tracking-wider">
                  <th className="p-4 font-medium">Docket Reference</th>
                  <th className="p-4 font-medium">Case Name</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Entities</th>
                  <th className="p-4 font-medium text-right">Relations</th>
                  <th className="p-4 font-medium text-right">Evidence Files</th>
                  <th className="p-4 font-medium">Created Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border font-mono">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-elevated/30 transition-colors group">
                    <td className="p-4 text-xs font-mono text-primary font-bold">
                      {c.id.substring(0, 8)}...
                    </td>
                    <td className="p-4 font-sans font-semibold text-text-main">
                      {c.case_name}
                      {c.description && (
                        <p className="text-xs text-text-secondary font-normal mt-0.5 line-clamp-1">{c.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider font-semibold",
                        c.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        c.status === 'UNDER_REVIEW' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-slate-500/10 text-text-secondary border-slate-500/20"
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-text-main font-bold">{c.entity_count || 0}</td>
                    <td className="p-4 text-right text-text-main font-bold">{c.relationship_count || 0}</td>
                    <td className="p-4 text-right text-text-main font-bold">{c.source_count || 0}</td>
                    <td className="p-4 text-xs text-text-secondary">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for New Case */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-panel border border-border rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Create Investigation Case</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-xs font-mono">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Case Title / Operational Codename *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Operation Dark Silk"
                  value={newCaseName}
                  onChange={(e) => setNewCaseName(e.target.value)}
                  className="w-full bg-elevated border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">Investigation Scope & Description</label>
                <textarea
                  rows={3}
                  placeholder="Target entities, initial intelligence summary, objectives..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-elevated border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary text-sm font-sans"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border rounded text-xs font-mono text-text-secondary hover:bg-elevated"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded text-xs font-mono uppercase tracking-wider font-semibold disabled:opacity-50"
                >
                  {creating ? 'Creating Docket...' : 'Initialize Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
