import footballersData from "./data/footballers.json";
import type {
  AttributeHint,
  Footballer,
  Player,
  RoundConfig,
  RoundState,
} from "./types";

export const footballers = footballersData as Footballer[];

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickAttributeHint(footballer: Footballer): AttributeHint {
  const candidates: AttributeHint[] = [
    { label: "Position", value: footballer.position },
    { label: "Nationality", value: footballer.nationality },
    { label: "Club", value: footballer.club },
    { label: "Era", value: footballer.era },
  ];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function buildRound(
  config: RoundConfig,
  recentFootballerIds: string[]
): RoundState {
  const pool = footballers.filter(
    (f) => !recentFootballerIds.includes(f.id)
  );
  const source = pool.length > 0 ? pool : footballers;
  const footballer = source[Math.floor(Math.random() * source.length)];

  const shuffledPlayers = shuffle(config.players);
  const imposterIds = shuffledPlayers
    .slice(0, config.imposterCount)
    .map((p) => p.id);

  const attributeHints: Record<string, AttributeHint> = {};
  if (config.hintLevel === "attribute") {
    for (const id of imposterIds) {
      attributeHints[id] = pickAttributeHint(footballer);
    }
  }

  return { footballer, imposterIds, attributeHints };
}

export function isImposter(round: RoundState, player: Player): boolean {
  return round.imposterIds.includes(player.id);
}
