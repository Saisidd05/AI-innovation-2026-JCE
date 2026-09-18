import React from 'react';
import { FileText, ShieldAlert, ShieldCheck } from 'lucide-react';

const EvidenceDrawer = () => {
  return (
    <div className="h-full border rounded-lg bg-white shadow-sm flex flex-col">
      <div className="bg-slate-100 px-4 py-2 border-b text-sm font-semibold flex items-center gap-2">
        <FileText size={16} /> Source Evidence
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selected Relationship</h4>
          <div className="bg-slate-50 border rounded p-3 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Person A → Person B</span>
            </div>
            <div className="text-slate-600 text-xs mb-1">Type: <span className="font-medium text-slate-900">Communication</span></div>
            <div className="text-slate-600 text-xs">Date: <span className="font-medium text-slate-900">12 Mar 2026</span></div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Verification Status</h4>
          <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 p-2 rounded border border-orange-100">
            <ShieldAlert size={16} />
            <span>Needs Review</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Source Record</h4>
          <div className="text-sm bg-white border rounded p-3 shadow-sm">
            <div className="font-mono text-xs mb-2">ID: CDR-1042</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call detail record indicating a 14-minute communication between registered endpoints. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDrawer;
