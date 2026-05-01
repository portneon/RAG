import { useState, useEffect } from 'react';
import { RefreshCw, Layers, ChevronRight, Settings } from 'lucide-react';
import ChatWindow from './components/ChatWindow';
import SourceSidebar from './components/SourceSidebar';
import StatusBreadcrumb from './components/StatusBreadcrumb';
import { askQuestion, syncDrive, checkHealth, AskResponse } from './api';

type Status = 'idle' | 'searching' | 'reading' | 'generating';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

function App() {
  const [folderId, setFolderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [backendStatus, setBackendStatus] = useState('offline');
  const [selectedSources, setSelectedSources] = useState<string[] | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await checkHealth();
        setBackendStatus('online');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncDrive(folderId || undefined as any);
      alert('Knowledge base synchronized successfully!');
    } catch (err: any) {
      alert('Sync failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleAsk = async (userQuery: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setStatus('searching');

    try {
      setTimeout(() => setStatus('reading'), 800);
      setTimeout(() => setStatus('generating'), 1600);

      const data: AskResponse = await askQuestion(userQuery);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        sources: data.sources
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error while processing your request: ' + (err.response?.data?.detail || err.message)
      }]);
    } finally {
      setLoading(false);
      setStatus('idle');
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-sky-500 rounded-xl shadow-lg shadow-sky-500/20 text-white">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Highwatch</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Knowledge OS</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sync Source</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Optional: Drive Folder ID"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500/30 transition-all text-slate-200"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                />
                <button 
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/10 disabled:opacity-50"
                >
                  {syncing ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                  {syncing ? 'Syncing...' : 'Sync Knowledge Base'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>Server Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
              <span className={backendStatus === 'online' ? 'text-emerald-500' : 'text-rose-500'}>{backendStatus}</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm text-slate-400 group">
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span>Settings</span>
            </div>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="p-8 pb-0">
          <StatusBreadcrumb status={status} />
        </div>
        
        <ChatWindow 
          onAsk={handleAsk} 
          loading={loading} 
          messages={messages} 
          onSourceClick={(srcs) => setSelectedSources(srcs)}
        />

        {selectedSources && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedSources(null)}
          />
        )}

        {selectedSources && (
          <SourceSidebar 
            sources={selectedSources} 
            onClose={() => setSelectedSources(null)} 
          />
        )}
      </main>
    </div>
  );
}

export default App;