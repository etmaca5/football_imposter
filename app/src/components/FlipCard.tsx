interface Props {
  flipped: boolean;
  isImposter: boolean;
  backLabel: string;
  frontMain: string;
  frontSub?: string;
  onTap: () => void;
}

export default function FlipCard({
  flipped,
  isImposter,
  backLabel,
  frontMain,
  frontSub,
  onTap,
}: Props) {
  return (
    <div className="card-scene" onClick={onTap} role="button" tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onTap();
      }}
    >
      <div className={"card-flip" + (flipped ? " is-flipped" : "")}>
        <div className="card-face card-face--back">
          <span className="card-face__crest" aria-hidden="true">
            ⚽
          </span>
          <span className="card-face__label">{backLabel}</span>
        </div>
        <div
          className={
            "card-face card-face--front" + (isImposter ? " is-imposter" : "")
          }
        >
          <span className="card-face__main">{frontMain}</span>
          {frontSub && <span className="card-face__sub">{frontSub}</span>}
        </div>
      </div>
    </div>
  );
}
