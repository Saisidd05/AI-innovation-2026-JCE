import React from 'react';
import { Database, ShieldAlert, Fingerprint, ExternalLink } from 'lucide-react';

const EvidenceDrawer = () => {
  return (
    <div className="glass-panel h-full rounded-2xl flex flex-col overflow-hidden relative">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
        <Database size={16} className="text-blue-400" /> 
        <span className="text-sm font-semibold tracking-wide text-slate-200">Evidence Provenance</span>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500"></div> Focused Edge
          </h4>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-slate-200 text-sm">Victor K. <span className="text-slate-500 mx-1">→</span> Ghost Sec.</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">Direct</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="text-[9px] text-slate-500 uppercase">Type</div>
                <div className="text-xs text-slate-300 font-medium">Association</div>
              </div>
              <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="text-[9px] text-slate-500 uppercase">Recorded</div>
                <div className="text-xs text-slate-300 font-medium">12 Mar 2026</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-amber-500"></div> Integrity Status
          </h4>
          <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-amber-500/10 to-transparent p-3 rounded-xl border border-amber-500/20">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><ShieldAlert size={18} /></div>
            <div>
              <div className="text-amber-300 font-medium text-sm">Review Required</div>
              <div className="text-amber-500/70 text-xs">Entity ambiguity detected</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-500"></div> Source Document
          </h4>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 group hover:bg-slate-800/50 transition-colors cursor-pointer relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Fingerprint size={14} className="text-purple-400" />
                <span className="font-mono text-xs text-purple-300 font-bold">SIGINT-902A</span>
              </div>
              <ExternalLink size={14} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Surveillance log identifying a 14-minute encrypted communication between registered endpoints matching known operational signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDrawer;
