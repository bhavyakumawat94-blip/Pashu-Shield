import React, { useState, useEffect, useRef } from "react";
import { Languages, Search, Check, ChevronDown, Globe } from "lucide-react";
import { ALL_INDIAN_LANGUAGES, getLanguage, setLanguage, subscribeLanguage } from "../lib/i18n";

export function LanguageSelector({ variant = "topbar" }) {
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    return subscribeLanguage((newLang) => {
      setCurrentLang(newLang);
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const activeLangObj =
    ALL_INDIAN_LANGUAGES.find((l) => l.code === currentLang) || ALL_INDIAN_LANGUAGES[0];

  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter((l) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      l.label.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`lang-selector-container ${variant}`} ref={dropdownRef}>
      <button
        type="button"
        className={`lang-selector-trigger ${variant === "landing" ? "landing-trigger" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Change Application Language"
        aria-label="Change Application Language"
      >
        <Languages size={17} className="lang-icon" />
        <span className="lang-current-label">
          <strong className="lang-native-bold">{activeLangObj.native}</strong>
          {variant !== "compact" && <span className="lang-en-sub">({activeLangObj.label})</span>}
        </span>
        <ChevronDown size={14} className={`chevron ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">
            <div className="lang-search-box">
              <Search size={15} />
              <input
                type="text"
                autoFocus
                placeholder="Search language / भाषा खोजें..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="lang-badge-count">
              {filteredLanguages.length} Languages
            </div>
          </div>

          <div className="lang-list-scroll">
            <div className="lang-section-label">All 22 Indian Scheduled Languages</div>
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <div className="lang-option-text">
                    <span className="lang-native-title">{lang.native}</span>
                    <span className="lang-region-subtitle">
                      {lang.label} • {lang.region}
                    </span>
                  </div>
                  {isSelected && <Check size={16} className="lang-check-icon" />}
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div className="lang-empty-state">
                No matching language found for "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
