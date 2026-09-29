import React, { useState, useEffect, useRef } from "react";
import {
  Bot, Send, Mic, MicOff, Volume2, VolumeX, X,
  Sparkles, AlertTriangle, ShieldCheck, RefreshCw, MessageSquare
} from "lucide-react";
import { getLanguage, t, ALL_INDIAN_LANGUAGES } from "../lib/i18n";
import { sendAiChatMessage, detectEmergencySymptoms } from "../lib/aiAssistant";

export function PashuAiAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "initial-msg",
      sender: "ai",
      text: t("aiGreeting"),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isEmergency: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [activeLang, setActiveLang] = useState(getLanguage());

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Keep active language synced
  useEffect(() => {
    setActiveLang(getLanguage());
  }, [isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === activeLang) || { voiceCode: "en-IN" };
      recognition.lang = langObj.voiceCode || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [activeLang]);

  // Text-to-Speech (TTS)
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    if (ttsActive) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ""));
    const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === activeLang) || { voiceCode: "en-IN" };
    utterance.lang = langObj.voiceCode || "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setTtsActive(false);
    utterance.onerror = () => setTtsActive(false);

    setTtsActive(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge or type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputValue("");
    setLoading(true);

    try {
      const response = await sendAiChatMessage({
        message: userMessage.text,
        history: messages.map((m) => ({ role: m.sender, content: m.text })),
        language: activeLang
      });

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergency: response.isEmergency,
        source: response.source
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I encountered a momentary communication error. Please try asking again or refer to the offline knowledge base.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pashu-ai-modal-overlay" onClick={onClose}>
      <div className="pashu-ai-drawer" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="pashu-ai-header">
          <div className="pashu-ai-title-wrap">
            <div className="pashu-ai-bot-icon">
              <Bot size={22} />
            </div>
            <div>
              <h3>PASHU AI</h3>
              <p>{t("aiCompanionSubtitle")}</p>
            </div>
          </div>

          <div className="pashu-ai-header-actions">
            <button
              className="pashu-ai-close-btn"
              onClick={onClose}
              title="Close Assistant"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* CLINICAL SAFETY DISCLAIMER BANNER */}
        <div className="pashu-ai-disclaimer">
          <ShieldCheck size={16} className="disclaimer-icon" />
          <span>{t("aiDisclaimer")}</span>
        </div>

        {/* MESSAGES STREAM */}
        <div className="pashu-ai-chat-body">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`pashu-ai-msg ${m.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              <div className="msg-bubble">
                {m.isEmergency && (
                  <div className="emergency-alert-pill">
                    <AlertTriangle size={14} /> Immediate Action Required
                  </div>
                )}

                <div className="msg-content" style={{ whiteSpace: "pre-line" }}>
                  {m.text}
                </div>

                <div className="msg-meta">
                  <span>{m.timestamp}</span>
                  {m.sender === "ai" && (
                    <button
                      type="button"
                      className="tts-btn"
                      onClick={() => speakText(m.text)}
                      title="Read aloud"
                    >
                      {ttsActive ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="pashu-ai-msg bot-msg">
              <div className="msg-bubble loading-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <small>Consulting veterinary intelligence...</small>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK QUESTIONS SUGGESTIONS */}
        <div className="pashu-ai-quick-inquiries">
          <span className="quick-label">💡 Suggested Questions:</span>
          <div className="quick-chips-scroll">
            <button
              type="button"
              className="quick-chip"
              onClick={() => handleSend(t("qHowRegister"))}
            >
              {t("qHowRegister")}
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => handleSend(t("qFmdSymptoms"))}
            >
              {t("qFmdSymptoms")}
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => handleSend(t("qTriageScore"))}
            >
              {t("qTriageScore")}
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => handleSend(t("qOfflineSync"))}
            >
              {t("qOfflineSync")}
            </button>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="pashu-ai-input-bar">
          <button
            type="button"
            className={`pashu-ai-mic-btn ${isListening ? "listening" : ""}`}
            onClick={toggleMic}
            title={isListening ? "Listening... click to stop" : "Speak query (Voice)"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t("listening") : t("aiInputPlaceholder")}
          />

          <button
            type="button"
            className="pashu-ai-send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Trigger Button for PASHU AI
export function FloatingAiButton({ onClick }) {
  return (
    <button
      type="button"
      className="floating-pashu-ai-btn"
      onClick={onClick}
      title="Open PASHU AI Assistant"
      aria-label="Open PASHU AI Assistant"
    >
      <div className="ai-btn-glow"></div>
      <Bot size={24} />
      <span className="ai-btn-label">PASHU AI</span>
      <span className="ai-pulse-dot"></span>
    </button>
  );
}
