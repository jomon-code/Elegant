import React, { useState } from 'react';
import { Bot, Sparkles, MessageSquareText, HelpCircle } from 'lucide-react';
import CampusAiModal from './CampusAiModal';

const AskAiButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const handleClick = () => {
    setModalOpen(true);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Floating Ask Campus AI Button */}
      <button
        className="ask-ai-float-btn"
        onClick={handleClick}
        title="Ask Campus AI (Timetable, Canteen, Rooms, XP Perks)"
        id="ask-campus-ai-btn"
        aria-label="Ask Campus AI"
      >
        <div className="ask-ai-icon-wrap">
          <Sparkles size={16} className="ask-ai-sparkle-icon" />
          <Bot size={22} className="ask-ai-bot-icon" />
        </div>
        <div className="ask-ai-text">
          <span className="ask-ai-title">Ask Campus AI</span>
          <span className="ask-ai-sub">24/7 Smart Concierge</span>
        </div>

        {/* Pulse badge notification dot */}
        {!hasInteracted && (
          <span className="ask-ai-indicator" title="AI Ready">
            <span className="ask-ai-ping"></span>
          </span>
        )}
      </button>

      {/* AI Assistant Modal */}
      {modalOpen && <CampusAiModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default AskAiButton;
