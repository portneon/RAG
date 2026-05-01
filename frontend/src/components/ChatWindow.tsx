import React, { useState } from 'react';
import { Send, RefreshCw, BookOpen, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

interface ChatWindowProps {
  onAsk: (query: string) => void;
  loading: boolean;
  messages: Message[];
  onSourceClick: (sources: string[]) => void;
}

export default function ChatWindow({ onAsk, loading, messages, onSourceClick }: ChatWindowProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onAsk(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex-1 overflow-y-auto space-y-8 pb-12 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <Layers size={48} />
            </div>
            <div>
              <h2 className="text-xl font-medium font-outfit">Knowledge Assistant</h2>
              <p className="text-sm">Ask anything about your synchronized documents.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-6 rounded-3xl ${
              msg.role === 'user' 
                ? 'bg-sky-500 text-white rounded-tr-none shadow-lg shadow-sky-500/20' 
                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
            }`}>
              <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-black/30 prose-pre:rounded-xl">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {msg.sources.map((src, j) => (
                    <button 
                      key={j}
                      onClick={() => onSourceClick([src])}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      <BookOpen size={12} className="text-sky-400" />
                      {src}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto group">
        <div className="absolute inset-0 bg-sky-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your documents anything..."
          className="relative w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-16 text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/[0.08] transition-all backdrop-blur-xl"
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-3 top-3 p-3 bg-sky-500 rounded-xl text-white hover:bg-sky-400 disabled:opacity-30 disabled:hover:bg-sky-500 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          {loading ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
        </button>
      </form>
    </div>
  );
}