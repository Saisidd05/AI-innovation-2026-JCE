import React, { useState, useEffect } from 'react';
import { Bot, Send, Database, CheckCircle2, FileText, Loader, Briefcase, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { hackerAiApi, casesApi } from '../services/api';

interface Message {
  role: 'user' | 'ai';
  content: string;
  sources?: { filename?: string; row_id: string; content: string }[];
  loading?: boolean;
}

export default function HackerAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [activeSources, setActiveSources] = useState<any[]>([]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (err) {
      console.error("Failed to load cases:", err);
    }
  };

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || query;
    if (!q.trim() || asking) return;

    const userMsg: Message = { role: 'user', content: q };
    const loadingMsg: Message = { role: 'ai', content: '', loading: true };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    if (!customQuery) setQuery('');
    setAsking(true);

    try {
      const res = await hackerAiApi.ask(q, selectedCaseId || undefined);
      
      setMessages(prev => prev.map((m, idx) => {
        if (idx === prev.length - 1) {
          return {
            role: 'ai',
            content: res.answer,
            sources: res.sources
          };
        }
        return m;
      }));

      if (res.sources && res.sources.length > 0) {
        setActiveSources(res.sources);
      }
    } catch (err: any) {
      console.error("Hacker AI error:", err);
      const errMsg = err.response?.data?.detail || "Failed to reach Hacker AI engine. Make sure GROQ_API_KEY is configured or vector database has evidence.";
      setMessages(prev => prev.map((m, idx) => {
        if (idx === prev.length - 1) {
          return {
            role: 'ai',
            content: `⚠️ Engine Notice: ${errMsg}`
          };
        }
        return m;
      }));
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="flex h-full p-4 space-x-4 max-w-[1600px] mx-auto">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-panel border border-border rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-elevated/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center text-accent shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-heading text-text-main font-bold tracking-wide flex items-center space-x-2">
                <span>Hacker AI Assistant</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/10 text-accent border border-accent/30">
                  RAG ENGINE
                </span>
              </h2>
              <p className="text-xs text-text-secondary font-mono">Evidence-grounded analytical retrieval & synthesis</p>
            </div>
          </div>

          {/* Case Filter Selector */}
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-text-secondary" />
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-canvas border border-border rounded px-3 py-1.5 text-xs text-text-main font-mono focus:outline-none focus:border-primary max-w-[200px]"
            >
              <option value="">All Ingested Cases</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.case_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary space-y-6 max-w-xl mx-auto text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-text-main">Hacker AI RAG Search</h3>
                <p className="text-xs font-mono text-text-secondary">
                  Queries are matched against high-dimensional semantic embeddings stored in the vector database. All answers reference original source rows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                {[
                  'Which phone numbers appear in multiple datasets?',
                  'Summarize key entity activities in active cases.',
                  'List all transactions exceeding threshold.',
                  'Find unverified evidence rows needing review.'
                ].map((suggestion, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(undefined, suggestion)} 
                    className="text-left p-3 rounded-lg border border-border bg-elevated/50 hover:border-accent/40 hover:bg-accent/5 transition-all text-xs font-mono text-text-main flex flex-col justify-between space-y-2 group"
                  >
                    <span>{suggestion}</span>
                    <span className="text-[10px] text-accent opacity-60 group-hover:opacity-100 flex items-center">
                      Ask vector engine →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-xl p-4 shadow-md space-y-3 font-sans", 
                  msg.role === 'user' 
                    ? "bg-primary text-white font-medium" 
                    : "bg-elevated border border-border text-text-main"
                )}>
                  {msg.loading ? (
                    <div className="flex items-center space-x-3 text-xs font-mono text-accent py-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Retrieving vector embeddings & synthesizing answer...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="text-xs font-mono text-accent font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>GROUNDED CITATIONS ({msg.sources.length} sources)</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((s, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setActiveSources([s])}
                                className="px-2.5 py-1 bg-canvas border border-border rounded text-[11px] font-mono text-text-secondary hover:text-text-main hover:border-accent transition-colors flex items-center space-x-1.5"
                              >
                                <FileText className="w-3 h-3 text-accent" />
                                <span>{s.filename || 'Dataset'} (Row {s.row_id})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-elevated/80 border-t border-border space-y-2">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={asking}
              placeholder="Ask Hacker AI any question about uploaded evidence or case entities..."
              className="w-full bg-canvas border border-border rounded-lg pl-4 pr-12 py-3 text-sm text-text-main focus:outline-none focus:border-accent transition-all font-sans"
            />
            <button 
              type="submit" 
              disabled={asking || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent hover:bg-emerald-600 disabled:opacity-40 rounded-md text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-text-secondary font-mono px-1">
            <span>GROUNDING: GROQ LLaMA 3.3 70B / SENTENCE-TRANSFORMERS</span>
            <span>SYNTHETIC INTEL AUDIT TRAIL ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Retrieved Evidence Context */}
      <div className="w-88 bg-panel border border-border rounded-lg flex flex-col overflow-hidden shadow-lg flex-shrink-0">
        <div className="p-4 border-b border-border bg-elevated/40 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-main flex items-center space-x-2">
            <Database className="w-4 h-4 text-accent" />
            <span>Retrieved Evidence</span>
          </h3>
          <span className="text-xs font-mono text-text-secondary">{activeSources.length} records</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-text-secondary text-center space-y-3 p-4">
              <Database className="w-8 h-8 opacity-30" />
              <p className="text-xs font-mono">
                Ask a question or click a grounded citation button to inspect exact source data.
              </p>
            </div>
          ) : (
            activeSources.map((source, i) => (
              <div key={i} className="bg-elevated border border-border rounded-lg p-3 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-border pb-2 text-text-secondary">
                  <span className="text-accent font-semibold flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {source.filename || 'Source Dataset'}
                  </span>
                  <span className="text-[10px] bg-canvas px-1.5 py-0.5 rounded border border-border">
                    Row {source.row_id}
                  </span>
                </div>
                <div className="text-text-main font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-canvas p-2.5 rounded border border-border">
                  {source.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
