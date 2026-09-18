import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const AiAssistant = () => {
  return (
    <div className="h-full border rounded-lg bg-white shadow-sm flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 border-b text-sm font-semibold flex items-center gap-2 text-white rounded-t-lg">
        <Bot size={16} /> AI Pattern Assistant
      </div>
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <div className="bg-slate-50 border rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-2 font-medium text-indigo-700">
              <Sparkles size={14} /> Network Summary
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on the retrieved records, Person A and Person B share 3 mutual communication events and 1 shared financial transaction within CASE-019. This cluster appears isolated from the wider network.
            </p>
            <div className="mt-2 text-[10px] text-slate-400 font-medium">Grounded in: CDR-1042, TXN-993</div>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <input 
            type="text" 
            placeholder="Ask about this network..." 
            className="w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
