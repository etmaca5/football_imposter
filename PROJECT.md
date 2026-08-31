# Football (Soccer) Imposter — Webapp

Tracking doc for building a web version of the party game "Football Imposter."
Goal: clean, simple, distinctive UI — not a templated design.

## What is Football Imposter?

A social-deduction party game for football fans, played with one shared device
or screen per player.

- **Setup:** One footballer is secretly chosen. Every player except one (the
  imposter) is shown that player's name. The imposter(s) see only "IMPOSTER."
- **Clue round:** Each player gives a short (one–two word) clue about the
  footballer (era, role, achievement, club, nationality, visual trait, etc.).
  Imposters must bluff a plausible-sounding clue without knowing who the
  player is.
- **Voting:** After clues, everyone votes for who they think the imposter is.
- **Win conditions:**
  - If the imposter is voted out, they get one guess at the footballer's
    identity — guessing correctly still wins them the round.
  - If the imposter survives the vote, they also win.
  - Non-imposters win if they correctly vote out the imposter and the
    imposter fails to guess the player.

Sources:
- [Play Football Imposter](https://playfootball.games/articles/how-to-play-football-imposter/)
- [Football Imposter Game — Imposter Games](https://impostergames.org/football)
- [Rondo Ringer – The Football Imposter Party Game](https://playfootball.games/rondo-ringer/)
- [Football Imposter Game — Find The Imposter](https://findtheimposter.com/football-imposter-game)
- [Football Teams Imposter — ImpostrGames](https://www.impostrgames.com/footballTeamsImposter)

## Product shape (webapp)

- Single-device pass-and-play (matches the physical game) as the MVP;
  consider a remote/multiplayer mode later.
- Host sets up a round: number of players, number of imposters, player pool
  (real footballers — need a data source/list).
- Each player, in turn, taps to privately reveal their role/name card, then
  passes the device on.
- Once everyone's seen their card, the app's job is done — clue-giving and
  voting happen out loud, in person, with no app involvement. The app never
  reveals who the imposter was or who won.
- Play-again (new footballer, same squad/settings) / new-setup flow.

## Imposter hint levels

At setup, the host picks a difficulty for the imposter's screen (instead of
one fixed rule):

1. **No hint** — imposter sees only "IMPOSTER," nothing else. Hardest for
   the imposter, easiest for the crew to catch them out.
2. **Attribute hint** — imposter sees one loose descriptor instead of the
   name: player type/position (e.g. "striker," "winger," "keeper") or another
   random attribute (e.g. nationality, club, era). Gives the imposter
   something plausible to build a clue around without revealing who the
   player is.
3. **Initials** — imposter sees the footballer's initials (e.g. "C.R.").
   Easiest for the imposter; still requires them to actually know/guess who
   it is to bluff convincingly.

Implementation notes:
- Difficulty is a per-round setting chosen by the host during setup, not a
  per-player toggle.
- Attribute hint needs a data model where each footballer has tagged
  attributes (position, nationality, club, era, etc.) to draw a random one
  from.

## Data source for the player pool

The player list can't just be a random/arbitrary pool — it needs to be
footballers that a casual group would actually recognize, spanning both
current stars and historical greats (so clues/guesses are actually fun and
gettable).

**Recommendation: [TheSportsDB](https://www.thesportsdb.com/)** as the
research source, used **once, offline, to hand-curate** `footballers.json` —
not called live from the app (keeps the no-backend, static-app architecture).
It's free, requires no paid key for basic lookups, and its player records
include nationality, position, team, and a bio/description for both active
and retired/historical players — a good fit for a hobby project where
perfect stats accuracy doesn't matter but recognizability does.

Other options considered and why they're not the primary pick:
- **[salimt/football-datasets (GitHub)](https://github.com/salimt/football-datasets)**
  — a 93,000+ player Transfermarkt-derived dataset. Very deep (market values,
  transfer history, historical players), but it's a bulk scraped dump — good
  as a secondary reference for cross-checking historical names/attributes,
  not something to redistribute wholesale.
- **API-Football / football-data.org / Sportmonks** — solid APIs but built
  for live fixtures/stats/odds, with request caps and paid tiers; overkill
  and the wrong shape for "static list of recognizable players."

Curation approach:
- Pull candidate names + attributes (position, nationality, club, era) from
  TheSportsDB, cross-check historical greats against Wikipedia
  "List of [club] players" pages and major award winners (Ballon d'Or, World
  Cup squads) to bias toward recognizability over obscurity.
- Store the curated result as the static `footballers.json` shipped with the
  app (see Tech stack below) — no runtime API dependency.

Sources:
- [TheSportsDB](https://www.thesportsdb.com/)
- [salimt/football-datasets](https://github.com/salimt/football-datasets)
- [Best Free Football APIs in 2026 — TheStatsAPI](https://www.thestatsapi.com/blog/free-football-api-alternatives)
- [Best Football APIs in 2026 — Highlightly](https://highlightly.net/blogs/best-football-apis-in-2026)

## Open questions

- Single-device only for v1, or design data model to support remote play
  from the start? *(Decided: pass-and-play only for now — see Tech stack.)*
- Any account/persistence needed, or fully stateless per session? *(Leaning
  stateless; maybe `localStorage` for last-used settings.)*
- Exact curation list/size for the MVP player pool (how many footballers is
  enough for variety without diluting recognizability?).

## UI/design direction

Using the `frontend-design` skill approach for a distinctive, non-templated
look rather than generic AI-design defaults (cream+serif, dark+neon accent,
newspaper-hairline layouts). Grounded in football's own visual vocabulary
(the pitch, scoreboards, matchday graphics) rather than generic party-game UI.

**Color** — deep mown-pitch green as the base, with a diagonal two-tone
stripe texture (like a real pitch), not a flat background:
- `--pitch` `#123524` / `--pitch-light` `#16412c` — base + stripe alt
- `--chalk` `#f4f7ef` — primary text/lines
- `--ink-muted` `#8fae9b` — secondary text/captions
- `--floodlight` `#f2c230` — primary accent/CTA
- `--imposter` `#e2493d` — danger/imposter state
- `--card-navy` `#0d1b2a` — reveal-card face

**Type** — Anton (condensed, scoreboard/kit-number feel) for display and the
big reveal moment; Manrope for body copy and buttons; Space Mono for turn
counters, clue order numbers, and initials — a scoreboard-digit utility face.

**Layout** — mobile-first, single centered card per screen, minimal chrome,
large tap targets (used in groups, one phone passed around).

**Signature element** — the reveal card: a tap-to-flip card (like a
substitution board flipping) that turns from a plain "tap to reveal" back
face to either the footballer's name or "IMPOSTER" (+ hint) on the front,
in imposter-red when applicable. This is the moment the app should be
remembered by.

## Tech stack

- **No backend for MVP.** Pass-and-play is single-device, so there's no
  need to keep a secret hidden from other clients — the whole game can run
  client-side.
- **Data layer:** static `footballers.json` bundled with the app (see Data
  source above), each entry `{ id, name, initials, position, nationality,
  club, era }`.
- **App state:** client-side state machine — `setup → reveal → clue-order →
  vote → result` — held in memory, reset per round. `localStorage` only for
  optional settings persistence (last-used player count, etc.).
- **Hosting:** static host (Vercel/Netlify/GitHub Pages) — no server process.
- **Frontend framework:** React + Vite + TypeScript, scaffolded in `app/`.

## Implementation status

Lives in `app/` (React + Vite + TS).

- `src/data/footballers.json` — 40 hand-curated footballers (current stars
  through 1950s–60s legends), matching the schema in Tech stack above.
- `src/gameLogic.ts` — round setup: random footballer pick (avoids repeats
  across the last 5 rounds), random imposter assignment, random attribute
  hint pick, clue-order shuffle.
- `src/screens/` — `SetupScreen` (squad + imposter count + hint level) →
  `RevealScreen` (the flip-card, one player at a time) → `DoneScreen`
  (play again / new setup). No voting or result tracking — clue-giving and
  voting are fully verbal/in-person, so the app never reveals who won.
- `src/components/FlipCard.tsx` — the signature reveal-card element.
- Run locally: `cd app && npm run dev`. Build: `npm run build`.

## Status

- [x] Concept researched, this tracking doc created
- [x] Imposter hint levels defined (no hint / attribute / initials)
- [x] Backend architecture decided (no backend — static app, pass-and-play only)
- [x] Player/footballer data source identified (TheSportsDB, curated offline)
- [x] Pick frontend framework (React + Vite + TypeScript)
- [x] Design direction (palette/type/layout/signature element)
- [x] Curate footballer list into footballers.json (40 players)
- [x] Core pass-and-play flow (setup → reveal → done, no in-app voting)
- [ ] Polish + responsive/mobile pass (test on an actual phone)
- [ ] Deploy to static hosting
