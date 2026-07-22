import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import { localQuerySearch } from '../data/portfolioData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PRE_CONFIGURED_PILLS = [
  "Tell me about yourself",
  "What is your core engineering stack?",
  "Tell me about your CogVerse project",
  "How can we get in touch?"
];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I am Aryan's AI clone. Ask me anything about my software engineering projects, technical stack, or background, and I'll answer in character!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalEngine, setUseLocalEngine] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message or typing updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, role: 'user', content: text }
    ];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Add empty assistant response to update live
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: '' }
    ]);

    if (useLocalEngine) {
      setTimeout(() => {
        const localAnswer = localQuerySearch(text);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: localAnswer } : msg
          )
        );
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });

      if (!response.ok) {
        throw new Error('Backend server is not active (static hosting)');
      }

      if (!response.body) {
        throw new Error('SSE stream is empty.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: !done });
          // SSE outputs: data: {"text": "..."}
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('data: ')) {
              const dataContent = cleanLine.slice(6);
              if (dataContent === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataContent);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                    )
                  );
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Ignore parsing errors for intermediate partial lines
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn("Backend API unavailable, falling back to instant local portfolio search engine:", err);
      setUseLocalEngine(true);
      const localAnswer = localQuerySearch(text);
      const notice = `🤖 [Using Live Local Knowledge Base fallback]\n\n${localAnswer}`;
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId ? { ...msg, content: notice } : msg
        )
      );
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-[90vw] sm:w-[400px] h-[580px] bg-[#0c0d12]/95 border border-white/[0.08] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl mb-4"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">Aryan's AI Clone</h4>
                  <span className="text-[10px] text-rose-400/80 font-mono flex items-center gap-1.5 uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Cognitive System Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Conversation Window */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 text-rose-500">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-4.5 py-3 rounded-2xl text-[13.5px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-rose-600 border border-rose-500/30 text-white rounded-tr-none shadow-md shadow-rose-950/20'
                        : 'bg-white/[0.03] border border-white/[0.06] text-slate-200 rounded-tl-none font-mono'
                    }`}
                  >
                    {msg.content === '' && isLoading ? (
                      <div className="flex gap-1 items-center justify-center py-1.5">
                        <span className="w-2 h-2 bg-rose-500/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-rose-500/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-rose-500/70 rounded-full animate-bounce" />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* In-chat Question Pills */}
            <div className="px-5 py-2 border-t border-white/[0.04] bg-white/[0.01]">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block mb-2">// QUICK QUERIES</span>
              <div className="flex flex-wrap gap-1.5">
                {PRE_CONFIGURED_PILLS.map((pill) => (
                  <button
                    key={pill}
                    disabled={isLoading}
                    onClick={() => handleSend(pill)}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/30 text-slate-300 hover:text-rose-400 font-mono text-left transition-all hover:bg-rose-950/10 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-[#090a0d] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isLoading ? "Thinking..." : "Ask me anything..."}
                disabled={isLoading}
                className="flex-1 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] focus:border-rose-500/40 focus:bg-white/[0.03] rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:bg-white/[0.02] disabled:text-slate-600 disabled:border disabled:border-white/[0.06]"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 relative group overflow-hidden border border-rose-400/20 cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#120508] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
