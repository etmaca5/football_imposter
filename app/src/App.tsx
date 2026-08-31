import { useState } from "react";
import "./App.css";
import type { Phase, RoundConfig, RoundState } from "./types";
import { buildRound } from "./gameLogic";
import SetupScreen from "./screens/SetupScreen";
import RevealScreen from "./screens/RevealScreen";
import DoneScreen from "./screens/DoneScreen";

function App() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<RoundConfig | null>(null);
  const [round, setRound] = useState<RoundState | null>(null);
  const [recentFootballerIds, setRecentFootballerIds] = useState<string[]>([]);

  function startRound(nextConfig: RoundConfig) {
    const nextRound = buildRound(nextConfig, recentFootballerIds);
    setConfig(nextConfig);
    setRound(nextRound);
    setRecentFootballerIds((prev) =>
      [nextRound.footballer.id, ...prev].slice(0, 5)
    );
    setPhase("reveal");
  }

  function playAgain() {
    if (!config) return;
    startRound(config);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__eyebrow">Matchday</span>
        <h1 className="app-header__title">Football Imposter</h1>
      </header>
      <main className="app-main">
        {phase === "setup" && (
          <SetupScreen initialConfig={config} onStart={startRound} />
        )}
        {phase === "reveal" && round && config && (
          <RevealScreen
            players={config.players}
            round={round}
            hintLevel={config.hintLevel}
            onDone={() => setPhase("done")}
          />
        )}
        {phase === "done" && (
          <DoneScreen
            onPlayAgain={playAgain}
            onNewSetup={() => {
              setConfig(null);
              setRound(null);
              setPhase("setup");
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
