import React, { useEffect, useState } from 'react';
import { FolderLock, FileText, CheckCircle, AlertTriangle, Eye, ShieldAlert, Filter, Search, Check, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { evidenceApi, casesApi } from '../services/api';

export default function EvidenceLocker() {
  const { user } = useAuthStore();
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const canVerify = ['SUPER_ADMIN', 'EVIDENCE_REVIEWER', 'INVESTIGATION_ADMIN'].includes(user?.role || '');

  useEffect(() => {
    fetchCases();
    fetchEvidence();
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [selectedCaseId]);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases:", err);
    }
  };

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await evidenceApi.getAll(selectedCaseId || undefined);
      setEvidenceList(data);
    } catch (err: any) {
      console.error("Evidence fetch error:", err);
      setError("Failed to fetch evidence records from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (evidenceId: string, newStatus: string) => {
    try {
      setVerifyingId(evidenceId);
      await evidenceApi.verify(evidenceId, newStatus, `Verified by ${user?.full_name}`);
      fetchEvidence();
    } catch (err: any) {
      console.error("Verify error:", err);
      alert(err.response?.data?.detail || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center space-x-3">
            <FolderLock className="w-6 h-6 text-primary" />
            <span>Evidence Locker</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Immutable evidence ledger with verification chain of custody</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-panel border border-border rounded px-3 py-1.5 text-xs text-text-main font-mono focus:outline-none focus:border-primary"
          >
            <option value="">All Cases Docket</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_name}
              </option>
            ))}
          </select>
          <button 
            onClick={fetchEvidence}
            className="p-2 bg-elevated border border-border rounded hover:bg-panel text-text-secondary hover:text-text-main"
            title="Refresh Evidence"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-xs font-mono">
          {error}
        </div>
      )}

      <div className="bg-panel border border-border rounded-lg flex-1 flex flex-col overflow-hidden shadow-lg">
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm">
              Loading evidence records from database ledger...
            </div>
          ) : evidenceList.length === 0 ? (
            <div className="p-12 text-center text-text-secondary font-mono text-sm space-y-3">
              <FolderLock className="w-10 h-10 mx-auto opacity-30 text-primary" />
              <p>No evidence records registered yet in this case docket.</p>
              <p className="text-xs opacity-60">Upload a CSV dataset to generate evidence entries.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-elevated/20 text-xs font-mono uppercase text-text-secondary tracking-wider">
                  <th className="p-4 font-medium">Evidence Record ID</th>
                  <th className="p-4 font-medium">Case Docket</th>
                  <th className="p-4 font-medium">Row Data Snippet</th>
                  <th className="p-4 font-medium">Status / Verification</th>
                  <th className="p-4 font-medium">Reviewed By</th>
                  <th className="p-4 font-medium text-right w-36">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border font-mono">
                {evidenceList.map((e) => (
                  <tr key={e.id} className="hover:bg-elevated/30 transition-colors">
                    <td className="p-4 text-xs font-mono text-primary font-bold">{e.id.substring(0, 8)}...</td>
                    <td className="p-4 text-xs text-text-secondary">{e.case_id ? e.case_id.substring(0, 8) : 'GLOBAL'}</td>
                    <td className="p-4 font-sans text-xs text-text-main max-w-xs truncate">
                      {e.content}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider font-semibold",
                        e.status === 'VERIFIED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        e.status === 'OBSERVED' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        e.status === 'INFERRED' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {e.status === 'VERIFIED' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {e.status === 'OBSERVED' && <Eye className="w-3 h-3 mr-1" />}
                        {e.status === 'INFERRED' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {e.status === 'FLAGGED' && <ShieldAlert className="w-3 h-3 mr-1" />}
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-text-secondary">
                      {e.reviewed_by ? e.reviewed_by.substring(0, 8) : 'Pending Review'}
                    </td>
                    <td className="p-4 text-right">
                      {canVerify && e.status !== 'VERIFIED' ? (
                        <button
                          onClick={() => handleVerify(e.id, 'VERIFIED')}
                          disabled={verifyingId === e.id}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded text-[10px] font-mono uppercase tracking-wider font-bold transition-colors"
                        >
                          {verifyingId === e.id ? 'Marking...' : 'Verify Record'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-secondary uppercase">Verified Log</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
