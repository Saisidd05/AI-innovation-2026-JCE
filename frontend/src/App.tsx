import React from 'react';
import GraphView from './components/GraphView';
import Timeline from './components/Timeline';
import EvidenceDrawer from './components/EvidenceDrawer';
import AiAssistant from './components/AiAssistant';
import { Target, Activity } from 'lucide-react';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans text-slate-100 bg-[#0a0f1c] relative selection:bg-indigo-500/30">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navigation */}
      <header className="glass-header h-16 flex items-center px-6 justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
            <Target className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Network Hunter</h1>
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-medium">Evidence Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-200 font-medium text-xs tracking-wide">CASE: <span className="text-white font-bold">OP-ICEBERG</span></span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
            <span className="text-xs font-bold text-slate-300">INV</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-5 grid grid-cols-12 gap-5 min-h-0 relative z-10">
        
        {/* Left Column: Graph & Timeline */}
        <div className="col-span-8 flex flex-col gap-5 min-h-0">
          <div className="flex-1 min-h-0">
            <GraphView />
          </div>
          <div className="h-1/3 min-h-0">
            <Timeline />
          </div>
        </div>

        {/* Right Column: Evidence & AI Assistant */}
        <div className="col-span-4 flex flex-col gap-5 min-h-0">
          <div className="flex-1 min-h-0">
            <EvidenceDrawer />
          </div>
          <div className="h-[45%] min-h-0">
            <AiAssistant />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
