import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, AlertCircle, Check, Languages, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, extractSymptomKeywords } from "../lib/voiceKeywords";

export { SUPPORTED_LANGUAGES, extractSymptomKeywords };

export function VoiceReporting({ onText, onAudio, onLanguageChange }) {
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    if (onLanguageChange) onLanguageChange(code);
  };

  const startRecording = async () => {
    setErrorMessage("");

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Audio recording is not supported on this browser or requires an HTTPS connection.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine compatible audio mime type (especially for Safari on iOS)
      let mimeType = "audio/webm";
      if (typeof MediaRecorder.isTypeSupported === "function") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4"; // Safari on iOS
        } else if (MediaRecorder.isTypeSupported("audio/aac")) {
          mimeType = "audio/aac";
        }
      }

      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      } catch (err) {
        // Fallback without explicit mimeType
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm"
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onAudio) onAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250); // collect in 250ms chunks
      setRecording(true);

      // Web Speech API recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = language;
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onstart = () => {
            setListening(true);
          };

          recognition.onresult = (event) => {
            let fullTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript + " ";
            }
            const trimmed = fullTranscript.trim();
            setText(trimmed);
            if (onText) onText(trimmed, language);
          };

          recognition.onerror = (e) => {
            console.warn("Speech recognition warning:", e.error);
            if (e.error === "not-allowed") {
              setErrorMessage("Microphone permission was denied. Please allow microphone access in browser settings.");
            }
            setListening(false);
          };

          recognition.onend = () => {
            setListening(false);
          };

          recognition.start();
          mediaRecorderRef.current.recognition = recognition;
        } catch (recognitionErr) {
          console.warn("SpeechRecognition start error:", recognitionErr);
        }
      }
    } catch (err) {
      console.error("Microphone access error:", err);
      setErrorMessage(
        "Could not access microphone. Please ensure microphone permissions are granted in your browser (on iPhone Safari: Settings > Safari > Microphone)."
      );
      setRecording(false);
      setListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.recognition) {
        try {
          mediaRecorderRef.current.recognition.stop();
        } catch (e) {}
      }
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    }
    setListening(false);
    setRecording(false);
  };

  const clearRecording = () => {
    setText("");
    setAudioUrl(null);
    setErrorMessage("");
    if (onText) onText("", language);
    if (onAudio) onAudio(null);
  };

  const handleManualTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onText) onText(val, language);
  };

  return (
    <div className="voice" style={{ display: "block" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span className="mic" style={{ fontSize: "24px" }}>🎙️</span>
        <div>
          <strong style={{ fontSize: "14px", display: "block" }}>
            Multilingual Voice & Symptom Reporting
          </strong>
          <span style={{ fontSize: "11px", color: "#607266" }}>
            Speak symptoms in English, Hindi, or Marathi — review & edit transcription before submission.
          </span>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div style={{ marginTop: "10px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#47554c", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Globe size={14} />
          <span>Select Reporting Language:</span>
        </div>
        <div className="lang-selector-bar">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-btn ${language === lang.code ? "active" : ""}`}
              onClick={() => handleLanguageSelect(lang.code)}
              disabled={recording}
            >
              <span>{lang.native}</span>
              <small style={{ marginLeft: "5px", opacity: 0.8 }}>({lang.label})</small>
            </button>
          ))}
        </div>
      </div>

      {/* Recording Controls */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "12px" }}>
        {!recording ? (
          <button
            type="button"
            className="primary"
            onClick={startRecording}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Mic size={16} />
            <span>Start Voice Recording</span>
          </button>
        ) : (
          <button
            type="button"
            className="secondary"
            onClick={stopRecording}
            style={{ background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <MicOff size={16} />
            <span>⏹️ Stop Recording</span>
          </button>
        )}

        {listening && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#dc2626", fontSize: "12px", fontWeight: "700" }}>
            <span className="status-dot" style={{ background: "#dc2626", animation: "pulse 1s infinite" }}></span>
            <span>
              {language === "hi-IN"
                ? "सुन रहे हैं (हिन्दी)... कृपया बोलें"
                : language === "mr-IN"
                ? "ऐकत आहे (मराठी)... कृपया बोला"
                : "Listening (English)... Speak clearly."}
            </span>
          </div>
        )}

        {(text || audioUrl) && !recording && (
          <button
            type="button"
            className="secondary small"
            onClick={clearRecording}
          >
            Clear Voice Data
          </button>
        )}
      </div>

      {/* Error & Compatibility Alerts */}
      {errorMessage && (
        <div style={{ marginTop: "10px", padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "11px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {!speechSupported && (
        <div style={{ marginTop: "10px", padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "11px" }}>
          ℹ️ <strong>Browser note:</strong> Automatic speech-to-text is not supported in this browser engine. You can still record audio and type the symptom description manually below.
        </div>
      )}

      {/* Audio Playback Review */}
      {audioUrl && (
        <div style={{ marginTop: "12px", background: "#f0fdf4", padding: "10px 14px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#166534", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Volume2 size={15} />
            <span>Recorded Voice Audio (Ready for Veterinary Officer Review):</span>
          </div>
          <audio controls src={audioUrl} style={{ width: "100%", height: "36px" }} />
        </div>
      )}

      {/* Editable Transcription Review / Manual Fallback */}
      <div className="transcription-preview">
        <label htmlFor="voice-transcription-input">
          📝 Transcription / Manual Symptom Description (Review & Edit before submitting):
        </label>
        <textarea
          id="voice-transcription-input"
          rows={3}
          value={text}
          onChange={handleManualTextChange}
          placeholder={
            language === "hi-IN"
              ? "पशु के लक्षण यहाँ बोलें या टाइप करें (उदा: 3 दिन से तेज बुखार है, खाना नहीं खा रही है, सुस्त है)..."
              : language === "mr-IN"
              ? "जनावराची लक्षणे येथे बोला किंवा टाईप करा (उदा: गायीला तीव्र ताप आला आहे, चारा खात नाही)..."
              : "Describe the animal's symptoms here (e.g., cow has high fever, nasal discharge, reduced feeding, very lethargic)..."
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "12px",
            fontFamily: "inherit",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "10px", color: "#6b7280" }}>
          <span>Detected symptoms are automatically matched to the checkboxes above.</span>
          <span>Language: {SUPPORTED_LANGUAGES.find(l => l.code === language)?.label}</span>
        </div>
      </div>
    </div>
  );
}
