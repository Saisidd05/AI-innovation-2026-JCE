import React from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';

const AiAssistant = () => {
  return (
    <div className="glass-panel h-full rounded-2xl flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.1)]">
      {/* Animated glowing top border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-indigo-900/20 backdrop-blur-md">
        <Bot size={18} className="text-indigo-400" /> 
        <span className="text-sm font-semibold tracking-wide text-indigo-100">Groq Intelligence</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold">Online</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 hide-scrollbar">
          
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/20">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-sm p-4 backdrop-blur-sm">
              <h5 className="text-xs font-semibold text-indigo-300 mb-2">Network Summary Generated</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Based on the retrieved records, Victor K. and Ghost Sec. share 3 mutual communication events and 1 shared financial transaction within <span className="text-indigo-400 font-mono">OP-ICEBERG</span>. This cluster exhibits bridging behavior to Offshore ACC.
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-indigo-500/20">
                <span className="text-[9px] uppercase text-indigo-400/60 font-bold tracking-widest">Grounded In</span>
                <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">SIGINT-902A</span>
                <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">TXN-993</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="relative mt-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 blur transition duration-1000 group-hover:opacity-50"></div>
          <div className="relative flex items-center bg-[#0f172a] rounded-xl border border-slate-700/50 overflow-hidden shadow-inner">
            <input 
              type="text" 
              placeholder="Ask Groq about this pattern..." 
              className="w-full text-sm px-4 py-3 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <button className="p-2 mr-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
