import { useState } from "react";
import FlipCard from "../components/FlipCard";
import { isImposter } from "../gameLogic";
import type { HintLevel, Player, RoundState } from "../types";

interface Props {
  players: Player[];
  round: RoundState;
  hintLevel: HintLevel;
  onDone: () => void;
}

export default function RevealScreen({
  players,
  round,
  hintLevel,
  onDone,
}: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const player = players[index];
  const imposter = isImposter(round, player);

  let frontMain: string;
  let frontSub: string | undefined;

  if (!imposter) {
    frontMain = round.footballer.name;
  } else if (hintLevel === "initials") {
    frontMain = "IMPOSTER";
    frontSub = round.footballer.initials;
  } else if (hintLevel === "attribute") {
    frontMain = "IMPOSTER";
    const hint = round.attributeHints[player.id];
    frontSub = hint ? `${hint.label}: ${hint.value}` : undefined;
  } else {
    frontMain = "IMPOSTER";
  }

  function handleNext() {
    if (index + 1 >= players.length) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
  }

  const isLast = index + 1 >= players.length;

  return (
    <section className="reveal-screen">
      <p className="reveal-screen__pass">
        Pass to <strong>{player.name}</strong>
      </p>
      <p className="reveal-screen__count">
        {index + 1} / {players.length}
      </p>
      <FlipCard
        flipped={flipped}
        isImposter={imposter}
        backLabel="Tap to reveal"
        frontMain={frontMain}
        frontSub={frontSub}
        onTap={() => setFlipped(true)}
      />
      <button
        type="button"
        className="btn btn--primary reveal-screen__next"
        disabled={!flipped}
        onClick={handleNext}
      >
        {isLast ? "Everyone's seen it" : "Got it — pass it on"}
      </button>
    </section>
  );
}
