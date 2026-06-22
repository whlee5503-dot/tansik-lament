import { useState } from "react";
import SelectScreen from "./components/SelectScreen";
import ChatScreen from "./components/ChatScreen";

export default function App() {
  const [pain, setPain] = useState(null);

  if (!pain) return <SelectScreen onSelect={setPain} />;
  return <ChatScreen pain={pain} onRestart={() => setPain(null)} />;
}
