import { useState, useEffect } from "react";
import VerseCard from "./VerseCard";
import { I18N } from "../data/i18n";

const DARK = {
  bg: "#0D0F14", surface: "#161922", border: "#252A36",
  textPrim: "#E2DED6", textDim: "#7A8099", textMute: "#3D4358",
  amber: "#C89B4A", amberDim: "#5C4520",
};
const LIGHT = {
  bg: "#F7F4EE", surface: "#FFFFFF", border: "#DDD8CC",
  textPrim: "#1C1810", textDim: "#6B6355", textMute: "#B0A898",
  amber: "#8B6420", amberDim: "#E8D9B8",
};

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function callClaude(system, messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system,
      messages,
    }),
  });
  return response.json();
}

function LoadingDots({ color }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), 500);
    return () => clearInterval(iv);
  }, []);
  return <span style={{ color, letterSpacing: "2px", fontSize: "20px" }}>✦{"...".slice(0, frame)}</span>;
}

export default function ResultScreen({ pain, state, onRestart, mode, toggleMode, lang }) {
  const C = mode === "dark" ? DARK : LIGHT;
  const t = I18N[lang];
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(true);
  const [prayer, setPrayer]               = useState(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [extraLang, setExtraLang]         = useState(lang === "ko" ? "ko" : lang === "id" ? "id" : "en");

  useEffect(() => { fetchResult(); }, []);

  const langInstruction = {
    ko: "한국어로 응답하세요. 한국어 성경은 개역한글(공개 도메인) 버전을 사용하세요. 영어 병행은 KJV(King James Version, 공개 도메인)를 사용하세요.",
    en: "Respond in English. Use King James Version (KJV, public domain) for all scripture.",
    id: "Jawab dalam Bahasa Indonesia. Untuk ayat Indonesia gunakan AYT (Alkitab Yang Terbuka, domain publik). Untuk ayat Inggris gunakan WEB (World English Bible, domain publik).",
  }[lang];

  async function fetchResult() {
    setLoading(true);
    const system = `You are a pastoral counselor deeply versed in lament theology, the book of Job, lament Psalms (22, 42, 77, 88), and Lamentations. You also know NT passages on suffering (Rom 8:18, 2 Cor 12:9, Heb 4:15, John 11:35). Never give empty comfort. Sit with people in their pain. Use both OT and NT. ${langInstruction}`;

    const prompt = `Pain type: ${pain.label} (${pain.sub})
Current state: "${state.text}"

Respond in JSON only:
{
  "comfort": "Short comforting phrase (max 15 chars or words)",
  "verse": {
    "ref": "Main verse reference",
    "text_ko": "Full text in Korean 개역한글 (2-4 verses)",
    "text_en": "Full text in KJV English (2-4 verses)",
    "text_id": "Full text in AYT Indonesian (if applicable)",
    "then_there": "2-3 sentences on historical/linguistic/theological context. Include 1 original language word.",
    "now_here": "2 sentences connecting '${state.text}' to this verse. No overlap with reflection."
  },
  "reflection": "3 sentences as a companion, not a preacher. No overlap with then_there or now_here.",
  "extra_ot": [
    { "ref": "OT ref 1", "text_ko": "개역한글", "text_en": "KJV", "text_id": "AYT" },
    { "ref": "OT ref 2", "text_ko": "개역한글", "text_en": "KJV", "text_id": "AYT" }
  ],
  "extra_nt": [
    { "ref": "NT ref", "text_ko": "개역한글", "text_en": "KJV", "text_id": "AYT" }
  ]
}`;

    try {
      const data = await callClaude(system, [{ role: "user", content: prompt }]);
      const raw = data.content?.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      setResult(JSON.parse(raw));
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPrayer() {
    setPrayerLoading(true);
    const prompt = `Pain: ${pain.label}, State: "${state.text}"
Write a lament prayer for this person. 6-8 lines. Honest, questioning God directly.
${langInstruction}
JSON only: {"prayer": "full prayer text"}`;
    try {
      const data = await callClaude(
        "You are a pastor skilled in lament theology.",
        [{ role: "user", content: prompt }]
      );
      const raw = data.content?.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      setPrayer(JSON.parse(raw).prayer);
    } catch {
      setPrayer(t.failed);
    } finally {
      setPrayerLoading(false);
    }
  }

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "32px" }}>{pain.icon}</div>
      <div style={{ fontSize: "13px", color: C.textDim, letterSpacing: "2px" }}>{t.searching}</div>
      <LoadingDots color={C.amber} />
    </div>
  );

  if (!result) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "14px", color: C.textDim }}>{t.failed}</div>
      <button onClick={fetchResult} style={{
        padding: "10px 24px", background: C.amber,
        color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
        border: "none", borderRadius: "2px", cursor: "pointer",
        fontFamily: "inherit", fontSize: "13px",
      }}>{t.retry}</button>
    </div>
  );

  const allExtra = [
    ...(result.extra_ot || []).map(e => ({ ...e, type: "OT" })),
    ...(result.extra_nt || []).map(e => ({ ...e, type: "NT" })),
  ];

  const extraText = (e) => {
    if (extraLang === "ko") return e.text_ko;
    if (extraLang === "id") return e.text_id || e.text_en;
    return e.text_en;
  };

  const extraLangOptions = lang === "ko"
    ? [{ id: "ko", label: "개역한글" }, { id: "en", label: "KJV" }]
    : lang === "id"
    ? [{ id: "id", label: "AYT" }, { id: "en", label: "WEB" }]
    : [{ id: "en", label: "KJV" }];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.amber }}>
            {pain.icon} {pain.label}
          </div>
          <div style={{ fontSize: "13px", color: C.textDim, marginTop: "2px" }}>
            "{state.text}"
          </div>
        </div>
        <button onClick={toggleMode} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          color: C.textDim, padding: "6px 12px", borderRadius: "2px",
          cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
        }}>
          {mode === "dark" ? t.light : t.dark}
        </button>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px 48px" }}>
        <div style={{
          textAlign: "center", padding: "24px 0 20px",
          fontSize: "18px", color: C.amber, lineHeight: "1.7",
        }}>
          {result.comfort}
        </div>

        {result.verse && (
          <div style={{ marginBottom: "16px" }}>
            <VerseCard verse={result.verse} reflection={result.reflection} mode={mode} lang={lang} />
          </div>
        )}

        {allExtra.length > 0 && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            padding: "18px 20px", borderRadius: "2px", marginBottom: "16px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "14px",
            }}>
              <div style={{ fontSize: "10px", color: C.textDim, letterSpacing: "2px" }}>
                {t.extraTitle}
              </div>
              {extraLangOptions.length > 1 && (
                <div style={{ display: "flex", gap: "4px" }}>
                  {extraLangOptions.map(l => (
                    <button key={l.id} onClick={() => setExtraLang(l.id)} style={{
                      padding: "2px 8px", fontSize: "10px",
                      border: `1px solid ${extraLang === l.id ? C.amber : C.border}`,
                      background: extraLang === l.id ? C.amberDim : "transparent",
                      color: extraLang === l.id ? C.amber : C.textDim,
                      borderRadius: "2px", cursor: "pointer",
                      fontFamily: "inherit", letterSpacing: "1px",
                    }}>{l.label}</button>
                  ))}
                </div>
              )}
            </div>
            {allExtra.map((e, i) => (
              <div key={i} style={{
                marginBottom: "12px", paddingBottom: "12px",
                borderBottom: i < allExtra.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "1px" }}>{e.ref}</div>
                  <div style={{
                    fontSize: "9px", padding: "1px 6px",
                    border: `1px solid ${e.type === "NT" ? C.amber : C.border}`,
                    color: e.type === "NT" ? C.amber : C.textDim,
                    borderRadius: "2px",
                  }}>
                    {e.type === "NT" ? t.nt : t.ot}
                  </div>
                </div>
                <div style={{
                  fontSize: "13px", color: C.textDim,
                  lineHeight: "1.9", fontStyle: "italic",
                }}>
                  {extraText(e)}
                </div>
              </div>
            ))}
          </div>
        )}

        {!prayer && (
          <button onClick={fetchPrayer} disabled={prayerLoading} style={{
            width: "100%", padding: "13px",
            background: prayerLoading ? C.amberDim : C.amber,
            color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
            border: "none", borderRadius: "2px",
            fontSize: "13px", letterSpacing: "1px",
            cursor: prayerLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit", marginBottom: "10px",
          }}>
            {prayerLoading ? t.prayerLoading : t.prayerBtn}
          </button>
        )}

        {prayer && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.amber}`,
            padding: "20px", borderRadius: "2px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "2px", marginBottom: "14px" }}>
              {t.prayerTitle}
            </div>
            <div style={{
              fontSize: "14px", color: C.textPrim,
              lineHeight: "2.1", fontStyle: "italic", whiteSpace: "pre-line",
            }}>
              {prayer}
            </div>
          </div>
        )}

        <button onClick={onRestart} style={{
          width: "100%", padding: "12px", background: "transparent",
          border: `1px solid ${C.border}`, color: C.textDim,
          borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "12px", letterSpacing: "1px",
        }}>
          {t.restart}
        </button>
      </div>
    </div>
  );
}
