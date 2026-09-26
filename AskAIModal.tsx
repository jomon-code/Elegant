import React, { useState } from 'react';
import { X, Sparkles, Send, Brain, Bot, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose }) => {
  const { suggestions, applySuggestion, addToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "Hello Elena! I analyzed your daily patterns. Your sleep duration (7h 20m) and meditation consistency are keeping your recovery steady. How can I help you optimize your routine today?",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!prompt.trim()) return;
    const userText = prompt.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = "That's a great habit goal. I suggest scheduling it right after your morning meditation to leverage habit stacking!";
      if (userText.toLowerCase().includes('sleep')) {
        reply = "To improve deep sleep above 1h 9m, try avoiding screens 45 minutes before bed and drinking chamomile tea.";
      } else if (userText.toLowerCase().includes('stress') || userText.toLowerCase().includes('cortisol')) {
        reply = "Your cortisol is at 56/100 today. A 5-minute box breathing session (4s in, 4s hold, 4s out, 4s hold) can lower acute stress by up to 25%.";
      }
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-pink-500 via-amber-400 to-emerald-400 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trackora AI Coach</h3>
              <p className="text-[11px] text-slate-400">Personalized habit intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-600">
          <span className="shrink-0 text-slate-400">Suggestions:</span>
          <button
            onClick={() => setPrompt('How can I lower my cortisol today?')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-slate-100 transition-colors"
          >
            ⚡ Lower cortisol
          </button>
          <button
            onClick={() => setPrompt('Optimize my deep sleep')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-slate-100 transition-colors"
          >
            🌙 Optimize deep sleep
          </button>
          <button
            onClick={() => setPrompt('Habit stacking ideas for today')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shrink-0 hover:bg-slate-100 transition-colors"
          >
            🔗 Habit stacking
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1C2833] text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-500" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI anything about your daily habits or wellness..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-400 transition-colors"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
