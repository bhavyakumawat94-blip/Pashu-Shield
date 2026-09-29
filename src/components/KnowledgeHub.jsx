import React, { useState } from "react";
import {
  BookOpen, Volume2, VolumeX, ShieldCheck, HeartPulse,
  Sun, CloudRain, Snowflake, CheckCircle2, ChevronRight,
  ExternalLink, Search, Sparkles, Filter, Info
} from "lucide-react";
import { getLanguage, ALL_INDIAN_LANGUAGES } from "../lib/i18n";

export function KnowledgeHub({ onNotify }) {
  const [activeCategory, setActiveCategory] = useState("diseases");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState(null);
  const currentLang = getLanguage();

  const guides = [
    {
      id: "guide-fmd",
      category: "diseases",
      title: "Foot & Mouth Disease (FMD / खुरपका-मुंहपका)",
      icon: "🐄",
      urgency: "High Contagion",
      summary: "Viral disease causing fever, mouth blisters, excessive salivation, and foot lesions leading to lameness.",
      audioText:
        "Foot and Mouth Disease is caused by an Aphtovirus. Typical symptoms are high fever, excessive stringy salivation, and blisters inside mouth and between hooves. Isolate the animal immediately. Clean mouth with mild potassium permanganate solution. Report immediately in PASHU SHIELD.",
      keySteps: [
        "Isolate sick animals immediately from the rest of the herd.",
        "Disinfect sheds with 4% sodium carbonate or citric acid.",
        "Ensure 6-monthly vaccination under national NADCP scheme."
      ],
      source: "ICAR - Indian Veterinary Research Institute (IVRI)",
      reviewedDate: "August 2026"
    },
    {
      id: "guide-lsd",
      category: "diseases",
      title: "Lumpy Skin Disease (LSD / लंपी त्वचा रोग)",
      icon: "🐃",
      urgency: "Vector-Borne",
      summary: "Poxvirus causing circular skin nodules (2-5cm), fever, enlarged lymph nodes, and drop in milk yield.",
      audioText:
        "Lumpy Skin Disease is transmitted by biting flies and mosquitoes. Symptoms include firm skin nodules and swollen limbs. Control vector mosquitoes with neem smoke, apply herbal antiseptic ointment on open skin lesions, and isolate affected cattle.",
      keySteps: [
        "Control biting flies, ticks, and mosquitoes in cattle sheds.",
        "Apply herbal neem / turmeric antiseptic paste to open ruptured skin lesions.",
        "Do not allow shared grazing or water tanks during active infection."
      ],
      source: "Department of Animal Husbandry & Dairying (DAHD)",
      reviewedDate: "July 2026"
    },
    {
      id: "guide-mastitis",
      category: "diseases",
      title: "Bovine Mastitis (थानैला रोग / कासदाह)",
      icon: "🥛",
      urgency: "Dairy Yield Loss",
      summary: "Udder inflammation caused by bacterial entry into the teat canal during unhygienic milking.",
      audioText:
        "Mastitis causes swollen, painful udder and clotted or watery milk. Prevent by washing hands before milking, dipping teats in post-milking antiseptic solution, and keeping the shed floor completely dry.",
      keySteps: [
        "Dry-wipe and wash teats before and immediately after milking.",
        "Never allow cows to sit on wet ground for 30 minutes post-milking.",
        "Perform California Mastitis Test (CMT) monthly for subclinical detection."
      ],
      source: "National Dairy Development Board (NDDB)",
      reviewedDate: "September 2026"
    },
    {
      id: "guide-monsoon",
      category: "seasonal",
      title: "Monsoon Livestock Management & Rot Prevention",
      icon: "🌧️",
      urgency: "Seasonal Care",
      summary: "Guidelines to prevent foot rot, pneumonia, and parasitic infestations during heavy rains.",
      audioText:
        "During monsoon, maintain dry lime bedding to prevent interdigital foot rot. Ensure clean borewell drinking water to avoid waterborne enteritis. Administer broad-spectrum dewormers.",
      keySteps: [
        "Dust shed floors with dry slaked lime to suppress fungal growth.",
        "Keep feed bags elevated on wooden pallets away from moisture.",
        "Complete Hemorrhagic Septicemia (HS) and Black Quarter (BQ) vaccinations before rains."
      ],
      source: "Central Institute for Research on Cattle (CIRC)",
      reviewedDate: "June 2026"
    },
    {
      id: "guide-nutrition",
      category: "nutrition",
      title: "Calf Nutrition & Colostrum Management",
      icon: "🍼",
      urgency: "Foundational Health",
      summary: "Essential feeding guidelines for newborn calves within the golden first 2 hours of life.",
      audioText:
        "Feed newborn calves mother's colostrum equal to 10 percent of their body weight within the first 2 hours. Colostrum provides vital immunoglobulins that establish disease immunity.",
      keySteps: [
        "Feed 2 to 2.5 liters of warm colostrum within 1 to 2 hours of birth.",
        "Disinfect umbilical cord with 7% tincture iodine immediately.",
        "Introduce clean calf starter feed and green hay from week 2."
      ],
      source: "National Dairy Research Institute (NDRI)",
      reviewedDate: "August 2026"
    },
    {
      id: "guide-schemes",
      category: "schemes",
      title: "Pashu Kisan Credit Card (PKCC) & Subsidies",
      icon: "🏛️",
      urgency: "Government Scheme",
      summary: "Affordable credit facilities and subsidized animal welfare programs for dairy and smallholder farmers.",
      audioText:
        "Pashu Kisan Credit Card provides loans up to 1.6 lakh rupees without collateral at a subsidized 4 percent interest rate for cattle feed and veterinary care. Contact your local veterinary hospital or bank branch.",
      keySteps: [
        "Obtain verification certificate from local Veterinary Dispensary.",
        "Submit 12-digit Bharat Pashudhan Yellow Tag ID and land/holding proof.",
        "Avail collateral-free credit limit for feeding and seasonal maintenance."
      ],
      source: "Ministry of Fisheries, Animal Husbandry & Dairying",
      reviewedDate: "September 2026"
    }
  ];

  const handleToggleTts = (guide) => {
    if (!window.speechSynthesis) return;

    if (playingId === guide.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(guide.audioText);
    const langObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === currentLang) || { voiceCode: "en-IN" };
    utterance.lang = langObj.voiceCode || "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    setPlayingId(guide.id);
    window.speechSynthesis.speak(utterance);
    if (onNotify) onNotify(`Playing audio guide: ${guide.title}`);
  };

  const filteredGuides = guides.filter((g) => {
    const matchesCategory =
      activeCategory === "all" || g.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      g.source.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">COMMUNITY EMPOWERMENT (USP 5)</div>
          <h1>Community Livestock Health Knowledge Hub</h1>
          <p>
            Multilingual visual guides, disease prevention protocols, seasonal care, and government schemes with voice narration.
          </p>
        </div>
      </div>

      {/* SEARCH & CATEGORY CHIPS */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="searchbar" style={{ flex: 1, minWidth: "260px", margin: 0 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search guides by disease name, symptom, or scheme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[
            ["all", "All Guides"],
            ["diseases", "Common Diseases"],
            ["seasonal", "Seasonal Care"],
            ["nutrition", "Nutrition & Feeding"],
            ["schemes", "Government Schemes"]
          ].map(([cat, label]) => (
            <button
              key={cat}
              type="button"
              className={activeCategory === cat ? "primary small" : "secondary small"}
              onClick={() => setActiveCategory(cat)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* GUIDES GRID */}
      <div className="knowledge-grid">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="knowledge-card">
            <div className="knowledge-card-header">
              <span className="knowledge-icon">{guide.icon}</span>
              <span className="knowledge-urgency">{guide.urgency}</span>
            </div>

            <h3>{guide.title}</h3>
            <p className="knowledge-summary">{guide.summary}</p>

            <div className="knowledge-steps">
              <strong>Key Recommended Actions:</strong>
              <ul>
                {guide.keySteps.map((step, si) => (
                  <li key={si}>
                    <CheckCircle2 size={13} style={{ color: "#166534", flexShrink: 0, marginTop: "2px" }} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="knowledge-card-footer">
              <button
                type="button"
                className={`audio-listen-btn ${playingId === guide.id ? "playing" : ""}`}
                onClick={() => handleToggleTts(guide)}
                title="Listen in your language"
              >
                {playingId === guide.id ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{playingId === guide.id ? "Stop Audio" : "Listen Audio"}</span>
              </button>

              <div className="knowledge-source-meta">
                <span>{guide.source}</span>
                <small>Reviewed: {guide.reviewedDate}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
