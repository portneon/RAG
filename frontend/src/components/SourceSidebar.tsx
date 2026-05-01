import React from 'react';
import { X, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceSidebarProps {
  sources: string[];
  onClose: () => void;
}

export default function SourceSidebar({ sources, onClose }: SourceSidebarProps) {
  return (
    <aside className="fixed right-0 top-0 w-[400px] h-screen bg-slate-900 border-l border-white/10 z-50 shadow-2xl flex flex-col animate-fade-in">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-bold text-lg tracking-tight">Verified Sources</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {sources.map((source, i) => (
          <div key={i} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-sky-400 transition-colors">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{source}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Document Source</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-black/20 text-xs text-slate-400 leading-relaxed italic mb-4">
              "...the primary drivers for the quarterly growth were identified in the internal audit as the new SaaS subscription models..."
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all">
              <ExternalLink size={14} />
              Open Original Document
            </button>
          </div>
        ))}

        {sources.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-600 text-center px-8">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-sm">No sources selected. Click a citation to view details.</p>
          </div>
        )}
      </div>
    </aside>
  );
}