interface Props {
  onPlayAgain: () => void;
  onNewSetup: () => void;
}

export default function DoneScreen({ onPlayAgain, onNewSetup }: Props) {
  return (
    <section className="done-screen">
      <p className="done-screen__hint">
        Everyone's seen their card. Clues and voting happen out loud —
        this app's done its part.
      </p>
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
