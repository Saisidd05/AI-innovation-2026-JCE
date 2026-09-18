import React from 'react';
import GraphView from './components/GraphView';
import Timeline from './components/Timeline';
import EvidenceDrawer from './components/EvidenceDrawer';
import AiAssistant from './components/AiAssistant';

function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="bg-slate-900 text-white h-14 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-xl">N</div>
          <h1 className="text-lg font-semibold tracking-wide">Network Hunter</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300">Case: CASE-019</span>
          <span className="text-slate-400">Analyst View</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column: Graph & Timeline */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <GraphView />
          </div>
          <div className="h-1/3 min-h-0">
            <Timeline />
          </div>
        </div>

        {/* Right Column: Evidence & AI Assistant */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <EvidenceDrawer />
          </div>
          <div className="h-1/2 min-h-0">
            <AiAssistant />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
