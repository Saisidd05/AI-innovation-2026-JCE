import React from 'react';
import { Clock } from 'lucide-react';

const Timeline = () => {
  const events = [
    { date: '2026-03-12 18:42', title: 'Communication Observed', source: 'CDR-1042' },
    { date: '2026-03-14 09:15', title: 'Transaction Logged', source: 'TXN-993' }
  ];

  return (
    <div className="h-full border rounded-lg bg-white shadow-sm flex flex-col">
      <div className="bg-slate-100 px-4 py-2 border-b text-sm font-semibold flex items-center gap-2">
        <Clock size={16} /> Investigation Replay
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
          {events.map((evt, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
              <div className="text-xs text-slate-500 font-medium">{evt.date}</div>
              <div className="text-sm font-semibold mt-1">{evt.title}</div>
              <div className="text-xs text-slate-400 mt-1">Source: {evt.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
