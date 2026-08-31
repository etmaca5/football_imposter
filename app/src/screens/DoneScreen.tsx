import type { Player } from "../types";

interface Props {
  firstUp: Player;
  onPlayAgain: () => void;
  onNewSetup: () => void;
}

export default function DoneScreen({ firstUp, onPlayAgain, onNewSetup }: Props) {
  return (
    <section className="done-screen">
      <p className="done-screen__hint">
        Everyone's seen their card. Clues and voting happen out loud —
        this app's done its part.
      </p>
      <div className="done-screen__first-up">
        <span className="done-screen__first-up-eyebrow">Goes first</span>
        <span className="done-screen__first-up-name">{firstUp.name}</span>
      </div>
      <button
        type="button"
        className="btn btn--primary done-screen__play-again"
        onClick={onPlayAgain}
      >
        Play again
      </button>
      <button
        type="button"
        className="btn btn--ghost done-screen__new-setup"
        onClick={onNewSetup}
      >
        New setup
      </button>
    </section>
  );
}
