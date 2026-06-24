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

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function callClaude(system, prompt, maxTokens = 800) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
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

// 언어별 성경 버전 설정
function getBibleVersions(lang) {
  if (lang === "ko") return { primary: "ko", secondary: "en", primaryLabel: "개역한글", secondaryLabel: "KJV" };
  if (lang === "en") return { primary: "en", secondary: null, primaryLabel: "KJV", secondaryLabel: null };
  return { primary: "id", secondary: "en", primaryLabel: "AYT", secondaryLabel: "WEB" };
}

function getLangInstruction(lang) {
  return {
    ko: "한국어로 응답. 성경은 개역한글과 KJV만 제공. 인도네시아어는 불필요.",
    en: "Respond in English. Use KJV only. No Korean or Indonesian needed.",
    id: "Jawab dalam Bahasa Indonesia. Gunakan AYT dan WEB. Tidak perlu bahasa Korea.",
  }[lang];
}

export default function ResultScreen({ pain, state, onRestart, mode, toggleMode, lang, setLang, goHome }) {
  const C = mode === "dark" ? DARK : LIGHT;
  const t = I18N[lang];
  const bv = getBibleVersions(lang);

  // 본문 (1단계 — 즉시 로딩)
  const [verse, setVerse]           = useState(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const [verseLang, setVerseLang]   = useState(bv.primary);

  // 탭별 컨텐츠 (클릭 시 로딩)
  const [thenThere, setThenThere]   = useState(null);
  const [nowHere, setNowHere]       = useState(null);
  const [sitting, setSitting]       = useState(null);
  const [extra, setExtra]           = useState(null);
  const [prayer, setPrayer]         = useState(null);

  // 로딩 상태
  const [loadingTab, setLoadingTab] = useState(null);

  const [activeTab, setActiveTab]   = useState("verse");

  const LANG_FLAGS = [
    { id: "ko", flag: "🇰🇷" },
    { id: "en", flag: "🇺🇸" },
    { id: "id", flag: "🇮🇩" },
  ];

  const system = `You are a pastoral counselor versed in lament theology, Job, lament Psalms, Lamentations, and NT suffering passages. Never give empty comfort. ${getLangInstruction(lang)}`;

  // 1단계: 본문만 즉시 로딩
  useEffect(() => {
    fetchVerse();
  }, []);

  async function fetchVerse() {
    setVerseLoading(true);
    const langFields = lang === "ko"
      ? `"text_ko": "개역한글 2-3절", "text_en": "KJV 2-3절"`
      : lang === "en"
      ? `"text_en": "KJV 2-3 verses"`
      : `"text_id": "AYT 2-3 ayat", "text_en": "WEB 2-3 verses"`;

    const prompt = `Pain: ${pain.label} (${pain.sub})
State: "${state.text}"

JSON only:
{
  "comfort": "Short comforting phrase (max 10 words)",
  "ref": "verse reference",
  ${langFields}
}`;

    try {
      const data = await callClaude(system, prompt, 600);
      setVerse(data);
    } catch {
      setVerse(null);
    } finally {
      setVerseLoading(false);
    }
  }

  // 탭 클릭 시 해당 내용만 로딩
  async function handleTab(tab) {
    setActiveTab(tab);
    if (tab === "verse") return;

    // 이미 로딩된 경우 스킵
    if (tab === "then" && thenThere) return;
    if (tab === "now" && nowHere) return;
    if (tab === "sitting" && sitting) return;
    if (tab === "extra" && extra) return;

    setLoadingTab(tab);

    try {
      if (tab === "then") {
        const data = await callClaude(system,
          `For "${verse?.ref}" in context of pain "${state.text}":
JSON only: {"then_there": "2-3 sentences: historical/linguistic/theological context. Include 1 original language word."}`, 400);
        setThenThere(data.then_there);

      } else if (tab === "now") {
        const data = await callClaude(system,
          `For "${verse?.ref}" and person saying "${state.text}":
JSON only: {"now_here": "2-3 sentences connecting this verse directly to their situation."}`, 400);
        setNowHere(data.now_here);

      } else if (tab === "sitting") {
        const data = await callClaude(system,
          `For "${verse?.ref}" and person saying "${state.text}":
JSON only: {"reflection": "3 sentences as a companion sitting with them. Not a preacher. Warm and honest."}`, 400);
        setSitting(data.reflection);

      } else if (tab === "extra") {
        const langFields = lang === "ko"
          ? `"text_ko": "개역한글", "text_en": "KJV"`
          : lang === "en"
          ? `"text_en": "KJV"`
          : `"text_id": "AYT", "text_en": "WEB"`;

        const data = await callClaude(system,
          `Pain: ${pain.label}, State: "${state.text}"
JSON only:
{
  "extra_ot": [
    {"ref": "OT ref 1", ${langFields}},
    {"ref": "OT ref 2", ${langFields}}
  ],
  "extra_nt": [
    {"ref": "NT ref", ${langFields}}
  ]
}`, 600);
        setExtra(data);
      }
    } catch {
      // 오류 시 탭 내용 없음으로 처리
    } finally {
      setLoadingTab(null);
    }
  }

  async function fetchPrayer() {
    setLoadingTab("prayer");
    try {
      const data = await callClaude(
        "You are a pastor skilled in lament theology. " + getLangInstruction(lang),
        `Pain: ${pain.label}, State: "${state.text}"
Write a lament prayer. 6-8 lines. Honest, questioning God directly.
JSON only: {"prayer": "full prayer text"}`, 500);
      setPrayer(data.prayer);
    } catch {
      setPrayer(t.failed);
    } finally {
      setLoadingTab(null);
    }
  }

  const verseText = verse
    ? (verseLang === "ko" ? verse.text_ko : verseLang === "id" ? verse.text_id : verse.text_en)
    : "";

  const allExtra = [
    ...(extra?.extra_ot || []).map(e => ({ ...e, type: "OT" })),
    ...(extra?.extra_nt || []).map(e => ({ ...e, type: "NT" })),
  ];

  const extraText = (e) => lang === "ko" ? e.text_ko : lang === "id" ? (e.text_id || e.text_en) : e.text_en;

  const TABS = [
    { id: "verse",   label: t.tabVerse },
    { id: "then",    label: t.tabThen },
    { id: "now",     label: t.tabNow },
    { id: "sitting", label: t.tabWith },
    { id: "extra",   label: t.extraTitle },
  ];

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
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.textPrim,
      fontFamily: "'Georgia','Noto Serif KR',serif",
    }}>
      {/* 헤더 */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={goHome} style={{
            background: "transparent", border: "none",
            color: C.amber, cursor: "pointer", fontSize: "22px", padding: "0",
          }}>🏠</button>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: C.amber }}>
              {pain.icon} {pain.label}
            </div>
            <div style={{ fontSize: "12px", color: C.textDim, marginTop: "1px" }}>
              "{state.text}"
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {LANG_FLAGS.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)} style={{
              padding: "4px 8px", fontSize: "18px", cursor: "pointer",
              border: `1px solid ${lang === l.id ? C.amber : C.border}`,
              background: lang === l.id ? C.amberDim : "transparent",
              borderRadius: "4px", lineHeight: 1,
              opacity: lang === l.id ? 1 : 0.6,
            }}>{l.flag}</button>
          ))}
          <button onClick={toggleMode} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            color: C.textDim, padding: "4px 8px", borderRadius: "2px",
            cursor: "pointer", fontSize: "14px", fontFamily: "inherit", marginLeft: "2px",
          }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 16px 48px" }}>

        {/* 위로 한 마디 */}
        <div style={{
          textAlign: "center", padding: "16px 0",
          fontSize: "18px", color: C.amber, lineHeight: "1.7",
        }}>
          {verse.comfort}
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          display: "flex", overflowX: "auto",
          borderBottom: `1px solid ${C.border}`,
          marginBottom: "16px", gap: "0",
        }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => handleTab(tab.id)} style={{
              padding: "10px 14px", border: "none", cursor: "pointer",
              background: "transparent",
              color: activeTab === tab.id ? C.amber : C.textDim,
              fontSize: "12px", fontFamily: "inherit", whiteSpace: "nowrap",
              borderBottom: activeTab === tab.id ? `2px solid ${C.amber}` : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.amber}`,
          padding: "18px 20px", borderRadius: "2px", marginBottom: "16px",
          minHeight: "120px",
        }}>

          {/* 본문 탭 */}
          {activeTab === "verse" && (
            <>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "12px",
              }}>
                <div style={{ fontSize: "11px", color: C.amber, letterSpacing: "1.5px" }}>
                  {verse.ref}
                </div>
                {bv.secondary && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[{ id: bv.primary, label: bv.primaryLabel }, { id: bv.secondary, label: bv.secondaryLabel }].map(l => (
                      <button key={l.id} onClick={() => setVerseLang(l.id)} style={{
                        padding: "2px 8px", fontSize: "10px",
                        border: `1px solid ${verseLang === l.id ? C.amber : C.border}`,
                        background: verseLang === l.id ? C.amberDim : "transparent",
                        color: verseLang === l.id ? C.amber : C.textDim,
                        borderRadius: "2px", cursor: "pointer", fontFamily: "inherit",
                      }}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "15px", color: C.textPrim, lineHeight: "2", fontStyle: "italic" }}>
                {verseText}
              </div>
            </>
          )}

          {/* 그때/거기서 탭 */}
          {activeTab === "then" && (
            loadingTab === "then"
              ? <div style={{ display: "flex", alignItems: "center", gap: "10px", color: C.textDim, fontSize: "13px" }}>
                  <LoadingDots color={C.amber} />
                  <span>{t.searching}</span>
                </div>
              : <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9" }}>
                  {thenThere || "—"}
                </div>
          )}

          {/* 지금/여기서 탭 */}
          {activeTab === "now" && (
            loadingTab === "now"
              ? <div style={{ display: "flex", alignItems: "center", gap: "10px", color: C.textDim, fontSize: "13px" }}>
                  <LoadingDots color={C.amber} />
                  <span>{t.searching}</span>
                </div>
              : <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9" }}>
                  {nowHere || "—"}
                </div>
          )}

          {/* 함께 앉아서 탭 */}
          {activeTab === "sitting" && (
            loadingTab === "sitting"
              ? <div style={{ display: "flex", alignItems: "center", gap: "10px", color: C.textDim, fontSize: "13px" }}>
                  <LoadingDots color={C.amber} />
                  <span>{t.searching}</span>
                </div>
              : <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9" }}>
                  {sitting || "—"}
                </div>
          )}

          {/* 함께 읽을 말씀 탭 */}
          {activeTab === "extra" && (
            loadingTab === "extra"
              ? <div style={{ display: "flex", alignItems: "center", gap: "10px", color: C.textDim, fontSize: "13px" }}>
                  <LoadingDots color={C.amber} />
                  <span>{t.searching}</span>
                </div>
              : allExtra.length > 0
                ? allExtra.map((e, i) => (
                    <div key={i} style={{
                      marginBottom: "14px", paddingBottom: "14px",
                      borderBottom: i < allExtra.length - 1 ? `1px solid ${C.border}` : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <div style={{ fontSize: "11px", color: C.amber, letterSpacing: "1px" }}>{e.ref}</div>
                        <div style={{
                          fontSize: "9px", padding: "1px 6px",
                          border: `1px solid ${e.type === "NT" ? C.amber : C.border}`,
                          color: e.type === "NT" ? C.amber : C.textDim,
                          borderRadius: "2px",
                        }}>
                          {e.type === "NT" ? t.nt : t.ot}
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", color: C.textPrim, lineHeight: "1.9", fontStyle: "italic" }}>
                        {extraText(e)}
                      </div>
                    </div>
                  ))
                : <div style={{ fontSize: "13px", color: C.textDim }}>—</div>
          )}
        </div>

        {/* 탄식 기도문 */}
        {!prayer ? (
          <button
            onClick={fetchPrayer}
            disabled={loadingTab === "prayer"}
            style={{
              width: "100%", padding: "13px",
              background: loadingTab === "prayer" ? C.amberDim : C.amber,
              color: mode === "dark" ? "#0D0F14" : "#FFFFFF",
              border: "none", borderRadius: "2px",
              fontSize: "13px", letterSpacing: "1px",
              cursor: loadingTab === "prayer" ? "not-allowed" : "pointer",
              fontFamily: "inherit", marginBottom: "10px",
            }}>
            {loadingTab === "prayer" ? t.prayerLoading : t.prayerBtn}
          </button>
        ) : (
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
          border: `1px solid ${C.border}`, color: C.textPrim,
          borderRadius: "2px", cursor: "pointer",
          fontFamily: "inherit", fontSize: "13px", letterSpacing: "0.5px",
        }}>
          {t.restart}
        </button>
      </div>
    </div>
  );
}
