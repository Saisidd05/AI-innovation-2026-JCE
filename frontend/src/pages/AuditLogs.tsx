import React, { useEffect, useState } from 'react';
import { History, Shield, RefreshCw } from 'lucide-react';
import { auditApi } from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await auditApi.getAll();
      setLogs(data);
    } catch (err: any) {
      console.error("Audit log error:", err);
      setError("Failed to fetch audit telemetry. Ensure Super Admin clearance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center space-x-3">
            <History className="w-6 h-6 text-primary" />
            <span>Audit Log Ledger</span>
          </h1>
          <p className="text-sm text-text-secondary font-sans mt-1">Immutable security activity audit trail and data access logs</p>
        </div>

        <button 
          onClick={fetchLogs}
          className="p-2 bg-elevated border border-border rounded text-text-secondary hover:text-text-main"
          title="Refresh Logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-xs">
          {error}
        </div>
      )}

      <div className="bg-panel border border-border rounded-lg flex-1 flex flex-col overflow-hidden shadow-lg">
        <div className="overflow-x-auto flex-1">
          {loading ? (
            <div className="p-12 text-center text-text-secondary text-sm">
              Loading security audit telemetry...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-text-secondary text-sm space-y-2">
              <Shield className="w-10 h-10 mx-auto opacity-30 text-primary" />
              <p>No audit events logged yet.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-elevated/20 text-xs uppercase text-text-secondary tracking-wider">
                  <th className="p-4 font-medium">Log Reference</th>
                  <th className="p-4 font-medium">User Identifier</th>
                  <th className="p-4 font-medium">Action Performed</th>
                  <th className="p-4 font-medium">Target Resource</th>
                  <th className="p-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-elevated/30 transition-colors">
                    <td className="p-4 text-primary font-bold">{log.id.substring(0, 8)}...</td>
                    <td className="p-4 text-text-main">{log.user_id ? log.user_id.substring(0, 8) : 'SYSTEM'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {log.resource_type || 'N/A'} {log.resource_id ? `(${log.resource_id.substring(0, 8)})` : ''}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
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
