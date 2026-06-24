import { useState } from "react";
import LandingPage  from "./components/LandingPage";
import SelectScreen from "./components/SelectScreen";
import StateScreen  from "./components/StateScreen";
import ResultScreen from "./components/ResultScreen";
import { PAIN_TYPES } from "./data/painTypes";

export const THEMES = {
  dark: {
    bg: "#0D0F14", surface: "#161922", border: "#252A36",
    textPrim: "#E2DED6", textDim: "#7A8099", textMute: "#3D4358",
    amber: "#C89B4A", amberDim: "#5C4520", dawn: "#8BA0C4", teal: "#4A8A6A",
  },
  light: {
    bg: "#F7F4EE", surface: "#FFFFFF", border: "#DDD8CC",
    textPrim: "#1C1810", textDim: "#6B6355", textMute: "#B0A898",
    amber: "#8B6420", amberDim: "#E8D9B8", dawn: "#2D5FA6", teal: "#2A6B4A",
  },
};

export default function App() {
  const [phase, setPhase]     = useState("landing");
  const [lang, setLang]       = useState("ko");
  const [pain, setPain]       = useState(null);
  const [state, setState]     = useState(null);
  const [mode, setMode]       = useState("dark");
  const [resultKey, setResultKey] = useState(0);
  const theme = THEMES[mode];

  function toggleMode() { setMode(m => m === "dark" ? "light" : "dark"); }
  function goHome() { setPain(null); setState(null); setPhase("landing"); }
  function restart() { setPain(null); setState(null); setPhase("select"); }

  function changeLang(newLang) {
    setLang(newLang);
    // pain이 선택된 상태라면 새 언어의 pain 객체로 교체
    if (pain) {
      const newPain = PAIN_TYPES[newLang]?.find(p => p.id === pain.id);
      if (newPain) setPain(newPain);
    }
    // ResultScreen 완전 리셋
    setResultKey(k => k + 1);
  }

  const common = { theme, mode, toggleMode, lang, setLang: changeLang, goHome };

  if (phase === "landing") return (
    <LandingPage mode={mode} toggleMode={toggleMode} lang={lang} setLang={changeLang} onStart={() => setPhase("select")} />
  );
  if (phase === "select") return (
    <SelectScreen onSelect={p => { setPain(p); setPhase("state"); }} {...common} />
  );
  if (phase === "state") return (
    <StateScreen pain={pain} onSelect={s => { setState(s); setPhase("result"); }} onBack={() => setPhase("select")} {...common} />
  );
  return (
    <ResultScreen key={resultKey} pain={pain} state={state} onRestart={restart} {...common} />
  );
}
