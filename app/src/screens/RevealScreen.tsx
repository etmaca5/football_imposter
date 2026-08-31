import { useRef, useState } from "react";
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
  const [isAdvancing, setIsAdvancing] = useState(false);
  const wasLastRef = useRef(false);

  const player = players[index];
  const imposter = isImposter(round, player);

  let frontMain: string;
  let frontSub: string[] | undefined;

  if (!imposter) {
    frontMain = round.footballer.name;
  } else if (hintLevel === "initials") {
    frontMain = "IMPOSTER";
    frontSub = [round.footballer.initials];
  } else if (hintLevel === "attribute") {
    frontMain = "IMPOSTER";
    const hints = round.attributeHints[player.id];
    frontSub = hints?.map((hint) => `${hint.label}: ${hint.value}`);
  } else {
    frontMain = "IMPOSTER";
  }

  const isLast = index + 1 >= players.length;

  function handleNext() {
    if (!flipped || isAdvancing) return;
    wasLastRef.current = isLast;
    setIsAdvancing(true);
    // Only flip the card face-down here. The next player's card content is
    // swapped in by handleCardTransitionEnd, once the flip-back animation
    // has actually finished — otherwise the new content renders instantly
    // and is briefly visible mid-flip, before the card is fully hidden.
    setFlipped(false);
  }

  function handleCardTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (!e.propertyName.includes("transform") || !isAdvancing) return;
    setIsAdvancing(false);
    if (wasLastRef.current) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
  }

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
        onTap={() => {
          if (!isAdvancing) setFlipped(true);
        }}
        onTransitionEnd={handleCardTransitionEnd}
      />
      <button
        type="button"
        className="btn btn--primary reveal-screen__next"
        disabled={!flipped || isAdvancing}
        onClick={handleNext}
      >
        {isLast ? "Everyone's seen it" : "Got it — pass it on"}
      </button>
    </section>
  );
}
