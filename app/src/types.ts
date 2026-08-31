export type HintLevel = "none" | "attribute" | "initials";

export interface Footballer {
  id: string;
  name: string;
  initials: string;
  position: string;
  nationality: string;
  club: string;
  era: string;
}

export interface Player {
  id: string;
  name: string;
}

export type Phase = "setup" | "reveal" | "done";

export interface RoundConfig {
  players: Player[];
  imposterCount: number;
  hintLevel: HintLevel;
}

export interface AttributeHint {
  label: string;
  value: string;
}

export interface RoundState {
  footballer: Footballer;
  imposterIds: string[];
  attributeHints: Record<string, AttributeHint>;
}
