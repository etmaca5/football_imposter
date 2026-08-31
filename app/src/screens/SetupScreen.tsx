import { useState } from "react";
import type { HintLevel, Player, RoundConfig } from "../types";

const HINT_OPTIONS: { value: HintLevel; title: string; description: string }[] = [
  {
    value: "none",
    title: "No hint",
    description: "Imposter sees only “IMPOSTER.” Hardest to bluff.",
  },
  {
    value: "attribute",
    title: "Attribute",
    description: "Imposter sees one loose detail — position, club, nation, or era.",
  },
  {
    value: "initials",
    title: "Initials",
    description: "Imposter sees the player’s initials. Easiest to bluff.",
  },
];

let idCounter = 0;
function makeId() {
  idCounter += 1;
  return `player-${idCounter}-${Date.now()}`;
}

interface Props {
  initialConfig: RoundConfig | null;
  onStart: (config: RoundConfig) => void;
}

export default function SetupScreen({ initialConfig, onStart }: Props) {
  const [players, setPlayers] = useState<Player[]>(
    initialConfig?.players ?? [
      { id: makeId(), name: "" },
      { id: makeId(), name: "" },
      { id: makeId(), name: "" },
    ]
  );
  const [imposterCount, setImposterCount] = useState(
    initialConfig?.imposterCount ?? 1
  );
  const [hintLevel, setHintLevel] = useState<HintLevel>(
    initialConfig?.hintLevel ?? "none"
  );

  const readyPlayers = players.filter((p) => p.name.trim().length > 0);
  const maxImposters = Math.max(1, readyPlayers.length - 2);
  const clampedImposterCount = Math.min(imposterCount, maxImposters);
  const canStart = readyPlayers.length >= 3;

  function updateName(id: string, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function addPlayer() {
    setPlayers((prev) => [...prev, { id: makeId(), name: "" }]);
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function handleStart() {
    onStart({
      players: readyPlayers,
      imposterCount: clampedImposterCount,
      hintLevel,
    });
  }

  return (
    <section className="setup-screen">
      <div className="setup-block">
        <h2 className="setup-block__title">Squad</h2>
        <p className="setup-block__hint">Who’s playing? Need at least 3.</p>
        <ul className="setup-players">
          {players.map((player, index) => (
            <li className="setup-players__row" key={player.id}>
              <span className="setup-players__num">{index + 1}</span>
              <input
                className="setup-players__input"
                type="text"
                value={player.name}
                placeholder={`Player ${index + 1}`}
                onChange={(e) => updateName(player.id, e.target.value)}
              />
              {players.length > 3 && (
                <button
                  type="button"
                  className="setup-players__remove"
                  aria-label={`Remove player ${index + 1}`}
                  onClick={() => removePlayer(player.id)}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--ghost" onClick={addPlayer}>
          + Add player
        </button>
      </div>

      <div className="setup-block">
        <h2 className="setup-block__title">Imposters</h2>
        <div className="setup-stepper">
          <button
            type="button"
            className="setup-stepper__btn"
            onClick={() => setImposterCount((n) => Math.max(1, n - 1))}
            disabled={clampedImposterCount <= 1}
          >
            −
          </button>
          <span className="setup-stepper__value">{clampedImposterCount}</span>
          <button
            type="button"
            className="setup-stepper__btn"
            onClick={() => setImposterCount((n) => Math.min(maxImposters, n + 1))}
            disabled={clampedImposterCount >= maxImposters}
          >
            +
          </button>
        </div>
      </div>

      <div className="setup-block">
        <h2 className="setup-block__title">Imposter hint</h2>
        <div className="setup-hints">
          {HINT_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={
                "setup-hints__option" +
                (hintLevel === option.value ? " is-selected" : "")
              }
              onClick={() => setHintLevel(option.value)}
            >
              <span className="setup-hints__title">{option.title}</span>
              <span className="setup-hints__desc">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn btn--primary setup-start"
        disabled={!canStart}
        onClick={handleStart}
      >
        Kick off
      </button>
      {!canStart && (
        <p className="setup-block__hint setup-block__hint--warn">
          Add at least 3 named players to start.
        </p>
      )}
    </section>
  );
}
