import { useState, useEffect } from "react";
import { I18N } from "../data/i18n";

const DARK = {
  bg: "#0D0F14", surface: "#161922", border: "#252A36",
  textPrim: "#E2DED6", textDim: "#7A8099", textMute: "#6B7090",
  amber: "#C89B4A", amberDim: "#5C4520",
};
const LIGHT = {
  bg: "#F7F4EE", surface: "#FFFFFF", border: "#DDD8CC",
  textPrim: "#1C1810", textDim: "#6B6355", textMute: "#8B8070",
  amber: "#8B6420", amberDim: "#E8D9B8",
};

async function callClaude(system, prompt, maxTokens = 600) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

function LoadingDots({ color }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), 500);
    return () => clearInterval(iv);
  }, []);
  return <span style={{ color, fontSize: "16px" }}>✦{"...".slice(0, frame)}</span>;
}

function getBibleVersions(lang) {
  if (lang === "ko") return { primary: "ko", secondary: "en", primaryLabel: "개역한글", secondaryLabel: "KJV" };
  if (lang === "en") return { primary: "en", secondary: null, primaryLabel: "KJV", secondaryLabel: null };
  return { primary: "id", secondary: "en", primaryLabel: "AYT", secondaryLabel: "WEB" };
}

function getLangInstruction(lang) {
  return {
    ko: "한국어로 응답. 성경은 개역한글과 KJV만 제공.",
    en: "Respond in English. Use KJV only.",
    id: "Jawab dalam Bahasa Indonesia yang hangat, natural, dan tidak kaku — seperti seorang teman yang berbicara dari hati ke hati. Hindari bahasa formal atau terlalu resmi. Gunakan AYT dan WEB.",
  }[lang];
}

function AccordionSection({ title, content, loading, isOpen, onToggle, C }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "13px 16px",
        background: isOpen ? C.amberDim : C.surface,
        border: "1px solid " + (isOpen ? C.amber : C.border),
        borderLeft: "3px solid " + (isOpen ? C.amber : C.border),
        borderRadius: isOpen ? "2px 2px 0 0" : "2px",
        cursor: "pointer", fontFamily: "inherit", fontSize: "14px",
        color: isOpen ? C.amber : C.textDim,
        textAlign: "left", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        transition: "all 0.15s",
      }}>
        <span>{title}</span>
        <span style={{ fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div style={{
          background: C.surface,
          border: "1px solid " + C.border,
          borderLeft: "3px solid " + C.amber,
          borderTop: "none", padding: "16px 18px",
          borderRadius: "0 0 2px 2px",
        }}>
          {loading
            ? <LoadingDots color={C.amber} />
            : <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9" }}>{content}</div>
          }
        </div>
      )}
    </div>
  );
}

export default function ResultScreen({ pain, state, onRestart, mode, toggleMode, lang, setLang, goHome }) {
  const C = mode === "dark" ? DARK : LIGHT;
  const t = I18N[lang];
  const bv = getBibleVersions(lang);

  const [verse, setVerse]           = useState(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const [verseLang, setVerseLang]   = useState(bv.primary);

  const [thenThere, setThenThere]   = useState(null);
  const [nowHere, setNowHere]       = useState(null);
  const [sitting, setSitting]       = useState(null);
  const [extra, setExtra]           = useState(null);
  const [prayer, setPrayer]         = useState(null);

  const [openThen, setOpenThen]       = useState(false);
  const [openNow, setOpenNow]         = useState(false);
  const [openSitting, setOpenSitting] = useState(false);
  const [openExtra, setOpenExtra]     = useState(false);
  const [extraLang, setExtraLang]     = useState(lang === "ko" ? "ko" : lang === "id" ? "id" : "en");
  const [loadingSection, setLoadingSection] = useState(null);

  const LANG_FLAGS = [
    { id: "ko", flag: "🇰🇷" },
    { id: "en", flag: "🇺🇸" },
    { id: "id", flag: "🇮🇩" },
  ];

  const system = "You are a pastoral counselor versed in lament theology, Job, lament Psalms, Lamentations, and NT suffering passages. Never give empty comfort. " + getLangInstruction(lang);

  useEffect(() => { fetchVerse(); }, []);

  async function fetchVerse() {
    setVerseLoading(true);
    const langFields = lang === "ko"
      ? '"text_ko": "개역한글 2-3절", "text_en": "KJV 2-3절"'
      : lang === "en"
      ? '"text_en": "KJV 2-3 verses"'
      : '"text_id": "AYT 2-3 ayat", "text_en": "WEB 2-3 verses"';
    try {
      const data = await callClaude(system,
        'Pain: ' + pain.label + ' (' + pain.sub + '), State: "' + state.text + '"\nJSON only: {"comfort": "Short phrase max 10 words", "ref": "verse ref", ' + langFields + '}', 500);
      setVerse(data);
    } catch { setVerse(null); }
    finally { setVerseLoading(false); }
  }

  async function handleSection(section, isOpen, setOpen, hasData, setter) {
    setOpen(!isOpen);
    if (isOpen || hasData) return;
    setLoadingSection(section);
    try {
      if (section === "then") {
        const data = await callClaude(system,
          'For "' + verse?.ref + '" regarding "' + state.text + '":\nJSON only: {"then_there": "2-3 sentences historical/linguistic/theological context. Include 1 original language word."}', 400);
        setter(data.then_there);
      } else if (section === "now") {
        const data = await callClaude(system,
          'For "' + verse?.ref + '" and person saying "' + state.text + '":\nJSON only: {"now_here": "2-3 sentences connecting this verse to their exact situation."}', 400);
        setter(data.now_here);
      } else if (section === "sitting") {
        const data = await callClaude(system,
          'For "' + verse?.ref + '" and person saying "' + state.text + '":\nJSON only: {"reflection": "3 sentences as warm companion. Not a preacher."}', 400);
        setter(data.reflection);
      } else if (section === "extra") {
        const lf = lang === "ko"
          ? '"text_ko": "개역한글", "text_en": "KJV"'
          : lang === "en" ? '"text_en": "KJV"'
          : '"text_id": "Ayat dalam AYT (Alkitab Yang Terbuka) bahasa Indonesia"';
        const data = await callClaude(system,
          'Pain: ' + pain.label + ', State: "' + state.text + '"\nJSON only: {"extra_ot":[{"ref":"OT1",' + lf + '},{"ref":"OT2",' + lf + '}],"extra_nt":[{"ref":"NT1",' + lf + '}]}', 600);
        setter(data);
      }
    } catch {}
    finally { setLoadingSection(null); }
  }

  async function fetchPrayer() {
    setLoadingSection("prayer");
    try {
      const data = await callClaude(
        "You are a pastor skilled in lament theology. " + getLangInstruction(lang),
        'Pain: ' + pain.label + ', State: "' + state.text + '"\nWrite a lament prayer. 6-8 lines. Honest, questioning God directly. Use modern contemporary English (avoid thee, thou, hast, dost, wilt, thy).\nJSON only: {"prayer": "full prayer text"}', 500);
      setPrayer(data.prayer);
    } catch { setPrayer(t.failed); }
    finally { setLoadingSection(null); }
  }

  const verseText = verse
    ? (verseLang === "ko" ? verse.text_ko : verseLang === "id" ? verse.text_id : verse.text_en)
    : "";

  const allExtra = [
    ...(extra?.extra_ot || []).map(e => ({ ...e, type: "OT" })),
    ...(extra?.extra_nt || []).map(e => ({ ...e, type: "NT" })),
  ];

  const extraText = (e) => {
    if (lang === "ko") return extraLang === "ko" ? e.text_ko : e.text_en;
    if (lang === "id") return e.text_id || e.text_en;
    return e.text_en;
  };

  if (verseLoading) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "32px" }}>{pain.icon}</div>
      <div style={{ fontSize: "14px", color: C.textDim, letterSpacing: "2px" }}>{t.searching}</div>
      <LoadingDots color={C.amber} />
    </div>
  );

  if (!verse) return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{ fontSize: "14px", color: C.textDim }}>{t.failed}</div>
      <button onClick={fetchVerse} style={{
        padding: "10px 24px", background: C.amber,
        color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
        border: "none", borderRadius: "2px", cursor: "pointer",
        fontFamily: "inherit", fontSize: "13px",
      }}>{t.retry}</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrim, fontFamily: "'Georgia','Noto Serif KR',serif" }}>
      <div style={{
        background: C.surface, borderBottom: "1px solid " + C.border,
        padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "16px", letterSpacing: "1px", color: C.amber }}>{pain.icon} {pain.label}</div>
            <div style={{ fontSize: "13px", color: C.textDim, marginTop: "2px" }}>"{state.text}"</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {LANG_FLAGS.filter(l => l.id === lang).map(l => (
            <span key={l.id} style={{
              fontSize: "20px", padding: "4px 8px",
              border: "1px solid " + C.amber,
              borderRadius: "4px", background: C.amberDim,
            }}>{l.flag}</span>
          ))}
          <button onClick={toggleMode} style={{
            background: "transparent", border: "1px solid " + C.border,
            color: C.textDim, padding: "4px 8px", borderRadius: "2px",
            cursor: "pointer", fontSize: "14px", marginLeft: "2px",
          }}>{mode === "dark" ? "☀️" : "🌙"}</button>
        </div>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 16px 48px" }}>

        <div style={{ textAlign: "center", padding: "16px 0 20px", fontSize: "18px", color: C.amber, lineHeight: "1.7" }}>
          {verse.comfort}
        </div>

        <div style={{
          background: C.surface, border: "1px solid " + C.border,
          borderLeft: "3px solid " + C.amber,
          padding: "18px 20px", borderRadius: "2px", marginBottom: "10px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", color: C.amber, letterSpacing: "1.5px" }}>{verse.ref}</div>
            {bv.secondary && (
              <div style={{ display: "flex", gap: "4px" }}>
                {[{ id: bv.primary, label: bv.primaryLabel }, { id: bv.secondary, label: bv.secondaryLabel }].map(l => (
                  <button key={l.id} onClick={() => setVerseLang(l.id)} style={{
                    padding: "2px 8px", fontSize: "10px",
                    border: "1px solid " + (verseLang === l.id ? C.amber : C.border),
                    background: verseLang === l.id ? C.amberDim : "transparent",
                    color: verseLang === l.id ? C.amber : C.textDim,
                    borderRadius: "2px", cursor: "pointer", fontFamily: "inherit",
                  }}>{l.label}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: "15px", color: C.textPrim, lineHeight: "2", fontStyle: "italic" }}>{verseText}</div>
        </div>

        <AccordionSection title={t.tabThen} content={thenThere} loading={loadingSection === "then"} isOpen={openThen} C={C}
          onToggle={() => handleSection("then", openThen, setOpenThen, thenThere, setThenThere)} />

        <AccordionSection title={t.tabNow} content={nowHere} loading={loadingSection === "now"} isOpen={openNow} C={C}
          onToggle={() => handleSection("now", openNow, setOpenNow, nowHere, setNowHere)} />

        <AccordionSection title={t.tabWith} content={sitting} loading={loadingSection === "sitting"} isOpen={openSitting} C={C}
          onToggle={() => handleSection("sitting", openSitting, setOpenSitting, sitting, setSitting)} />

        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => handleSection("extra", openExtra, setOpenExtra, extra, setExtra)} style={{
            width: "100%", padding: "13px 16px",
            background: openExtra ? C.amberDim : C.surface,
            border: "1px solid " + (openExtra ? C.amber : C.border),
            borderLeft: "3px solid " + (openExtra ? C.amber : C.border),
            borderRadius: openExtra ? "2px 2px 0 0" : "2px",
            cursor: "pointer", fontFamily: "inherit", fontSize: "14px",
            color: openExtra ? C.amber : C.textDim,
            textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>{t.extraTitle}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {lang === "ko" && openExtra && (
                <div style={{ display: "flex", gap: "4px" }} onClick={e => e.stopPropagation()}>
                  {[{ id: "ko", label: "개역한글" }, { id: "en", label: "KJV" }].map(l => (
                    <button key={l.id} onClick={e => { e.stopPropagation(); setExtraLang(l.id); }} style={{
                      padding: "2px 8px", fontSize: "10px",
                      border: "1px solid " + (extraLang === l.id ? C.amber : C.border),
                      background: extraLang === l.id ? C.amberDim : "transparent",
                      color: extraLang === l.id ? C.amber : C.textDim,
                      borderRadius: "2px", cursor: "pointer", fontFamily: "inherit",
                    }}>{l.label}</button>
                  ))}
                </div>
              )}
              <span style={{ fontSize: "12px" }}>{openExtra ? "▲" : "▼"}</span>
            </div>
          </button>

          {openExtra && (
            <div style={{
              background: C.surface, border: "1px solid " + C.border,
              borderLeft: "3px solid " + C.amber, borderTop: "none",
              padding: "16px 18px", borderRadius: "0 0 2px 2px",
            }}>
              {loadingSection === "extra"
                ? <LoadingDots color={C.amber} />
                : allExtra.map((e, i) => (
                    <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < allExtra.length - 1 ? "1px solid " + C.border : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <div style={{ fontSize: "11px", color: C.amber }}>{e.ref}</div>
                        <div style={{ fontSize: "9px", padding: "1px 6px", border: "1px solid " + (e.type === "NT" ? C.amber : C.border), color: e.type === "NT" ? C.amber : C.textDim, borderRadius: "2px" }}>
                          {e.type === "NT" ? t.nt : t.ot}
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9", fontStyle: "italic" }}>
                        {extraText(e)}
                      </div>
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        {!prayer ? (
          <button onClick={fetchPrayer} disabled={loadingSection === "prayer"} style={{
            width: "100%", padding: "13px",
            background: loadingSection === "prayer" ? C.amberDim : C.amber,
            color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
            border: "none", borderRadius: "2px", fontSize: "13px", letterSpacing: "1px",
            cursor: loadingSection === "prayer" ? "not-allowed" : "pointer",
            fontFamily: "inherit", marginBottom: "10px",
          }}>
            {loadingSection === "prayer" ? t.prayerLoading : t.prayerBtn}
          </button>
        ) : (
          <div style={{
            background: C.surface, border: "1px solid " + C.border,
            borderLeft: "3px solid " + C.amber,
            padding: "20px", borderRadius: "2px", marginBottom: "16px",
          }}>
            <div style={{ fontSize: "10px", color: C.amber, letterSpacing: "2px", marginBottom: "14px" }}>{t.prayerTitle}</div>
            <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "2.1", fontStyle: "italic", whiteSpace: "pre-line" }}>{prayer}</div>
          </div>
        )}

        <button onClick={onRestart} style={{
          width: "100%", padding: "12px", background: "transparent",
          border: "1px solid " + C.border, color: C.textPrim,
          borderRadius: "2px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
          marginBottom: "8px",
        }}>
          {lang === "ko" ? "← 다시 선택" : lang === "id" ? "← Pilih lagi" : "← Choose again"}
        </button>
        <button onClick={goHome} style={{
          width: "100%", padding: "12px", background: "transparent",
          border: "1px solid " + C.border, color: C.textDim,
          borderRadius: "2px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
        }}>
          🏠 {lang === "ko" ? "처음으로 돌아가기" : lang === "id" ? "Kembali ke awal" : "Back to home"}
        </button>
      </div>
    </div>
  );
}
