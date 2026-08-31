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

// Major footballing nations, recognizable enough to name outright without
// giving away the player. Anyone else is bucketed to their continent
// instead, which stays vague (e.g. any non-top-10 South American nation
// just reads "South America").
const TOP_SOCCER_COUNTRIES = new Set([
  "Brazil",
  "Germany",
  "Italy",
  "Argentina",
  "France",
  "Uruguay",
  "England",
  "Spain",
  "Netherlands",
  "Portugal",
]);

function pickAttributeHints(
  footballer: Footballer,
  count: 1 | 2
): AttributeHint[] {
  const originHint: AttributeHint = TOP_SOCCER_COUNTRIES.has(
    footballer.nationality
  )
    ? { label: "Country", value: footballer.nationality }
    : { label: "Continent", value: footballer.continent };

  const candidates: AttributeHint[] = [
    { label: "Position", value: footballer.position },
    originHint,
    { label: "Club", value: footballer.club },
    { label: "Era", value: footballer.era },
  ];
  return shuffle(candidates).slice(0, count);
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

  const attributeHints: Record<string, AttributeHint[]> = {};
  if (config.hintLevel === "attribute") {
    for (const id of imposterIds) {
      attributeHints[id] = pickAttributeHints(footballer, config.attributeHintCount);
    }
  }

  const firstUp =
    config.players[Math.floor(Math.random() * config.players.length)];

  return { footballer, imposterIds, attributeHints, firstUp };
}

export function isImposter(round: RoundState, player: Player): boolean {
  return round.imposterIds.includes(player.id);
}
