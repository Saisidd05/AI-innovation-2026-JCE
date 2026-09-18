import React from 'react';
import { History, Play, Pause, FastForward, CheckCircle2 } from 'lucide-react';

const Timeline = () => {
  const events = [
    { date: 'MAR 12, 2026 • 18:42', title: 'Communication Established', source: 'CDR-1042', status: 'verified' },
    { date: 'MAR 14, 2026 • 09:15', title: 'Offshore Transfer Executed', source: 'TXN-993', status: 'pending' },
    { date: 'APR 02, 2026 • 22:11', title: 'Secondary Meeting', source: 'LOC-404', status: 'verified' }
  ];

  return (
    <div className="glass-panel h-full rounded-2xl flex flex-col relative overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-2 text-emerald-400">
          <History size={16} />
          <span className="text-sm font-semibold tracking-wide text-slate-200">Investigation Replay</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-all"><Play size={14} /></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded transition-all"><Pause size={14} /></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded transition-all"><FastForward size={14} /></button>
        </div>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto hide-scrollbar relative">
        <div className="absolute top-0 bottom-0 left-8 w-[1px] bg-gradient-to-b from-emerald-500/50 via-slate-700 to-transparent"></div>
        
        <div className="space-y-6">
          {events.map((evt, i) => (
            <div key={i} className="relative pl-12 group cursor-pointer">
              {/* Timeline Dot */}
              <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0f1c] shadow-[0_0_8px_rgba(0,0,0,0.5)] z-10 transition-all duration-300 group-hover:scale-125 ${evt.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              
              <div className="glass-panel p-3 rounded-xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="text-[10px] text-emerald-400/80 font-semibold tracking-widest mb-1">{evt.date}</div>
                <div className="text-sm font-medium text-slate-200">{evt.title}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Ref: {evt.source}</span>
                  {evt.status === 'verified' && <CheckCircle2 size={12} className="text-emerald-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
