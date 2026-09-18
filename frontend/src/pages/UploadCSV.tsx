import React, { useState, useEffect } from 'react';
import { UploadCloud, File, AlertTriangle, CheckCircle, Database, Loader, Briefcase, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { hackerAiApi, casesApi } from '../services/api';

export default function UploadCSV() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
      if (data.length > 0) {
        setSelectedCaseId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch cases for selector:", err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleRealUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    try {
      const response = await hackerAiApi.uploadCsv(file, selectedCaseId || undefined);
      setResult(response);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.detail || "Upload failed. Check backend logs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-main flex items-center space-x-3">
            <UploadCloud className="w-6 h-6 text-primary" />
            <span>Dataset Ingestion Pipeline</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Upload CSV evidence files into the semantic vector engine</p>
        </div>
      </div>

      {/* Case Assignment Selector */}
      <div className="bg-panel border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-5 h-5 text-primary" />
          <div>
            <label className="block text-xs font-mono uppercase text-text-secondary">Target Investigation Case</label>
            <span className="text-xs text-text-secondary">Associate evidence records with a case docket</span>
          </div>
        </div>

        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          className="bg-canvas border border-border rounded px-3 py-2 text-sm text-text-main font-mono focus:outline-none focus:border-primary min-w-[240px]"
        >
          <option value="">Global / Unassigned Dataset</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.case_name} ({c.id.substring(0, 8)})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-xs font-mono">
          {error}
        </div>
      )}

      {result ? (
        <div className="bg-panel border border-emerald-500/30 rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-main">Dataset Ingested & Vectorized</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Successfully parsed <strong className="text-emerald-400 font-mono">{result.rows_processed}</strong> records from <span className="font-mono text-text-main">{result.filename}</span> into vector storage.
          </p>

          <div className="flex justify-center space-x-4 pt-4 font-mono text-xs">
            <button
              onClick={() => { setFile(null); setResult(null); }}
              className="px-4 py-2 bg-elevated border border-border rounded text-text-main hover:bg-panel"
            >
              Upload Another CSV
            </button>
            <a
              href="/hacker-ai"
              className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded uppercase tracking-wider font-semibold shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            >
              Query in Hacker AI →
            </a>
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all text-center",
            dragActive ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "border-border bg-panel",
            file ? "border-emerald-500/50 bg-emerald-500/5" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <div className="w-16 h-16 rounded-full bg-elevated border border-border flex items-center justify-center mb-4 text-primary">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-text-main mb-1">Drag and drop your CSV dataset here</p>
              <p className="text-xs text-text-secondary mb-6 font-mono">Format: Standard .csv files with headers (e.g. phone, timestamp, location, note)</p>
              <label className="cursor-pointer bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                Browse System Files
                <input type="file" className="hidden" accept=".csv" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
              </label>
            </>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md space-y-4">
              <File className="w-12 h-12 text-emerald-400 mb-2" />
              <h3 className="font-semibold text-text-main text-lg truncate w-full font-mono">{file.name}</h3>
              <p className="text-xs text-text-secondary font-mono">{(file.size / 1024).toFixed(1)} KB</p>
              
              {!uploading ? (
                <div className="flex space-x-3 pt-4 font-mono text-xs">
                  <button 
                    onClick={() => setFile(null)} 
                    className="px-4 py-2 rounded bg-elevated border border-border text-text-secondary hover:text-text-main transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRealUpload} 
                    className="px-6 py-2 rounded bg-primary text-white hover:bg-primary-light transition-all uppercase tracking-wider font-semibold shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  >
                    Ingest into Vector Store
                  </button>
                </div>
              ) : (
                <div className="w-full pt-4 space-y-4 text-left">
                  <div className="flex items-center justify-center text-xs font-mono text-primary space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Parsing rows, embedding vectors, registering evidence...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-panel border border-border rounded-lg p-4 flex items-start space-x-3 text-xs text-text-secondary font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p>
          Uploaded datasets are processed by the vector engine. Text fields are converted into high-dimensional semantic embeddings for Hacker AI retrieval. Ensure column names are standard for automated entity extraction.
        </p>
      </div>
    </div>
  );
}
