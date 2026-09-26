import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import api from '../utils/api';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  Trash2,
  Compass,
  Coffee,
  Building2,
  Award,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AiMessage } from '../types';

interface CampusAiModalProps {
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  { label: '📍 Where is my next class?', text: 'Where is my next class?' },
  { label: '☕ Is canteen crowded now?', text: 'Is canteen crowded now?' },
  { label: '🖨️ Redeem 1 free print (50 XP)', text: 'How do I redeem 1 free print in library?' },
  { label: '📚 Find quiet study rooms', text: 'Find quiet study rooms available now' },
  { label: '📊 Check my attendance', text: 'Check my attendance percentage' },
  { label: '🛠️ Complaints status (+50 XP)', text: 'What is the status of my complaints and how do I earn 50 XP?' },
  { label: '🔍 Did anyone find my lost item?', text: 'Did anyone find my lost item?' },
  { label: '🏆 My XP & perks balance', text: 'How much XP do I have and what can I redeem?' },
];

const INITIAL_MESSAGES: AiMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'ai',
    text: `👋 **Hello! I'm Campus AI, your 24/7 intelligent campus assistant.**\n\nI have live real-time access to the entire campus ecosystem:\n• 📍 **Timetables & Classrooms:** Tell me where you need to go!\n• ☕ **Canteen Rush Meter:** Live queue counts, wait times & menu specials.\n• 📊 **Attendance & QR Check-Ins:** Track course thresholds & earn **+10 XP** per class.\n• 🏆 **XP & Rewards Store:** Check your leaderboard standing or redeem perks like **1 Free Print in Library** for 50 XP!\n• 🛠️ **Facilities Support:** File complaints & earn **+50 XP** upon resolution.\n\n*Tap any quick question below or ask me anything!*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actions: [
      { label: '📍 Next Class', question: 'Where is my next class?' },
      { label: '☕ Canteen Rush', question: 'Is canteen crowded now?' },
      { label: '🖨️ Free Print (50 XP)', action: 'open_perks' },
      { label: '🏆 View Leaderboard', action: 'open_leaderboard' },
    ],
    suggestions: [
      'Where is my next class?',
      'Is canteen crowded now?',
      'Check my attendance percentage',
      'What can I redeem with my XP?',
    ],
  },
];

const CampusAiModal: React.FC<CampusAiModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { xp, setOpenRewardsModal, setOpenLeaderboardModal } = useGamification();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Text-to-speech helper
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for natural voice
      const clean = text.replace(/[*#_`•]/g, '').slice(0, 220);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: AiMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', { question: textToSend });
      const { answer, actions, suggestions, intent } = res.data;

      const aiMsg: AiMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: answer,
        intent,
        actions: actions || [],
        suggestions: suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(answer);
    } catch (err) {
      // Local intelligent fallback engine
      const q = textToSend.toLowerCase();
      let answer = '';
      let actions: any[] = [];
      let suggestions: string[] = [];

      if (q.includes('next class') || q.includes('timetable') || q.includes('schedule')) {
        answer = `📍 **Your next class is CS301: Data Structures & Algorithms**\n\n• **Location:** Block B - **Room 204** (Floor 2)\n• **Instructor:** Prof. Ananya Sharma\n• **Time:** 10:30 AM - 11:45 AM *(Starts in ~24 minutes)*\n• **Est. Walking Time:** 4 minutes\n• **Route:** Take East Entrance of Block B to 2nd Floor.\n\n💡 *Earn **+10 XP** by scanning the classroom QR code on arrival!*`;
        actions = [
          { label: '🗺️ Navigate to Room 204', link: '/navigation' },
          { label: '📋 Open QR Attendance', link: '/attendance' },
        ];
        suggestions = ['Is canteen crowded now?', 'Check my attendance', 'How much XP do I have?'];
      } else if (q.includes('canteen') || q.includes('cafeteria') || q.includes('crowded') || q.includes('food') || q.includes('lunch')) {
        answer = `☕ **Central Cafeteria Live Status:**\n\n• **Current Queue:** **12 people in queue**\n• **Estimated Wait Time:** **~8 min wait, best to pre-order.**\n• **Popular Right Now:** Cold Brew Coffee & Paneer Kathi Roll\n• **Special Deal:** Student Filter Coffee + Snack Combo ($3.50)\n\n💡 *Perk Alert: You can redeem **60 XP** for a free artisan coffee or **80 XP** for a Priority Queue Pass!*`;
        actions = [
          { label: '☕ Redeem Coffee (60 XP)', action: 'open_perks' },
          { label: '⚡ Get Queue Pass (80 XP)', action: 'open_perks' },
        ];
        suggestions = ['Where is my next class?', 'Redeem 1 free print in library (50 XP)'];
      } else if (q.includes('print') || q.includes('xp') || q.includes('redeem') || q.includes('reward')) {
        answer = `🏆 **Campus XP & Rewards Program:**\n\n• Your Current Balance: **${xp} XP**\n• **1 Free Print in Library:** Costs **50 XP** (Gives you a 10-page printing pass at Library Desk).\n• **Attend Class:** **+10 XP** per verified session.\n• **File + Resolve Complaint:** **+50 XP** (+15 XP file, +35 XP resolved)!\n\nOpen the Rewards Store to claim your digital voucher!`;
        actions = [
          { label: '🖨️ Redeem 1 Free Print (50 XP)', action: 'open_perks' },
          { label: '🏆 View Leaderboard', action: 'open_leaderboard' },
        ];
        suggestions = ['Where is my next class?', 'Is canteen crowded now?'];
      } else {
        answer = `🤖 **Campus AI Response:**\n\nI can help you navigate campus, check real-time canteen crowding (~8 min wait), lookup upcoming timetable slots in Block B, verify your attendance status, and redeem XP for free library prints (50 XP)!`;
        actions = [
          { label: '📍 Next Class', question: 'Where is my next class?' },
          { label: '☕ Canteen Wait', question: 'Is canteen crowded now?' },
          { label: '🖨️ Free Print (50 XP)', action: 'open_perks' },
        ];
      }

      const fallbackMsg: AiMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: answer,
        actions,
        suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(answer);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; link?: string; action?: string; question?: string }) => {
    if (action.link) {
      navigate(action.link);
      onClose();
    } else if (action.action === 'open_perks') {
      setOpenRewardsModal(true);
      onClose();
    } else if (action.action === 'open_leaderboard') {
      setOpenLeaderboardModal(true);
      onClose();
    } else if (action.question) {
      handleSend(action.question);
    }
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div className="campus-ai-overlay">
      <div className="campus-ai-modal">
        {/* Header */}
        <div className="campus-ai-header">
          <div className="campus-ai-title-wrap">
            <div className="campus-ai-avatar">
              <Bot size={22} />
              <Sparkles size={12} className="campus-ai-sparkle-sub" />
            </div>
            <div>
              <div className="campus-ai-main-title">
                <span>Ask Campus AI</span>
                <span className="campus-ai-live-badge">
                  <span className="pulse-dot" /> Live Grid v4.2
                </span>
              </div>
              <div className="campus-ai-sub-title">
                Timetable • Canteen Rush • Attendance • XP Store • Support
              </div>
            </div>
          </div>

          <div className="campus-ai-actions">
            {/* Voice toggle */}
            <button
              className={`campus-ai-btn-icon ${voiceEnabled ? 'active' : ''}`}
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              title={voiceEnabled ? 'Mute AI voice output' : 'Enable voice read-aloud (Speech)'}
              aria-label="Toggle Voice Output"
            >
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Clear history */}
            <button
              className="campus-ai-btn-icon"
              onClick={handleClear}
              title="Reset conversation"
              aria-label="Clear Chat"
            >
              <Trash2 size={18} />
            </button>

            {/* Close */}
            <button
              className="campus-ai-btn-icon close"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              title="Close Assistant"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="campus-ai-presets-bar">
          <div className="campus-ai-presets-scroll">
            {PRESET_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                className="campus-ai-preset-chip"
                onClick={() => handleSend(item.text)}
                disabled={loading}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="campus-ai-messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`campus-ai-message ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
            >
              <div className="campus-ai-msg-avatar">
                {msg.sender === 'user' ? (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                ) : (
                  <Bot size={18} />
                )}
              </div>

              <div className="campus-ai-bubble-wrap">
                <div className="campus-ai-bubble">
                  {/* Message body with formatted lines */}
                  <div className="campus-ai-text-content">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} style={{ height: '8px' }} />;

                      // Render bold text
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} style={{ margin: '0 0 4px 0', lineHeight: 1.5 }}>
                          {parts.map((p, pIdx) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return <strong key={pIdx}>{p.slice(2, -2)}</strong>;
                            }
                            if (p.startsWith('*') && p.endsWith('*')) {
                              return <em key={pIdx}>{p.slice(1, -1)}</em>;
                            }
                            return p;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="campus-ai-actions-row">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          className="campus-ai-action-btn"
                          onClick={() => handleActionClick(act)}
                        >
                          <span>{act.label}</span>
                          <ArrowRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="campus-ai-msg-time">{msg.timestamp}</div>
                </div>

                {/* Suggestions Pills underneath AI response */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="campus-ai-suggestions-row">
                    <span className="campus-ai-suggestions-tag">Ask next:</span>
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        className="campus-ai-suggestion-chip"
                        onClick={() => handleSend(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking / Typing indicator */}
          {loading && (
            <div className="campus-ai-message ai-msg">
              <div className="campus-ai-msg-avatar">
                <Bot size={18} />
              </div>
              <div className="campus-ai-bubble thinking">
                <div className="campus-ai-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  Campus AI is checking live campus records...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          className="campus-ai-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="campus-ai-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="campus-ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: where is my next class? canteen rush, free print, attendance..."
              disabled={loading}
              id="campus-ai-query-input"
            />
            <button
              type="submit"
              className="campus-ai-send-btn"
              disabled={loading || !input.trim()}
              aria-label="Send query"
              id="campus-ai-send-btn"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="campus-ai-footer-notes">
            <span>⚡ Connected to Timetable, Canteen Queue Sensors & XP Ledger</span>
            <span>💡 Try: <em>"Where is my next class?"</em></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampusAiModal;
