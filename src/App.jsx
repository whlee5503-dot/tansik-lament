import { useState } from "react";
import SelectScreen from "./components/SelectScreen";
import StateScreen from "./components/StateScreen";
import ResultScreen from "./components/ResultScreen";

export default function App() {
  const [pain, setPain]   = useState(null);
  const [state, setState] = useState(null);

  if (!pain)  return <SelectScreen onSelect={setPain} />;
  if (!state) return (
    <StateScreen
      pain={pain}
      onSelect={setState}
      onBack={() => setPain(null)}
    />
  );
  return (
    <ResultScreen
      pain={pain}
      state={state}
      onRestart={() => { setPain(null); setState(null); }}
    />
  );
}
