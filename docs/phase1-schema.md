# Phase 1 — Blox Fruits Deepening Schema (Paper Draft)

Status: **paper-only**, locked 2026-05-19, build starts 2026-06.
Audience: future-self when opening the editor on day 1 of June.

This file describes the data structure for `data/games/blox-fruits/` so the
JSON files can be written before the routes / components are scaffolded.
No code in this repo references anything here yet.

---

## Locked architecture decisions (recap)

1. **New subdirectory** `data/games/blox-fruits/` containing
   `fruits.json`, `races.json`, `fighting-styles.json`, `swords.json`,
   `sea-events.json`. **Not** a single bloated `blox-fruits.json`.
2. **Promote `blox-fruits` to a static route** (`app/blox-fruits/...`).
   The other 5 games keep using the dynamic `[game]` route.
3. **Editorial tier ranking**: each fruit gets a hand-assigned `tier` +
   prose rationale. Not formula-computed.

---

## `fruits.json` — single fruit entry

```ts
type Fruit = {
  slug: string;            // URL-safe: "dragon", "leopard", "dough"
  name: string;            // Display: "Dragon"
  aliases?: string[];      // Search aids: ["Dragon Fruit", "Ryu Ryu no Mi"]
  type: "Natural" | "Elemental" | "Beast";
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary" | "Mythical";
  cost: { beli: number; robux: number };
  inShop: boolean;         // Common/Uncommon usually true, Mythical usually false
  awakening: {
    available: boolean;
    fragmentCost?: number;
    unlockedMoves?: string[];   // names only, no damage numbers
  };
  moves: {
    key: "Z" | "X" | "C" | "V" | "F";
    name: string;
    cooldownSec: number;
    description: string;        // one sentence; no damage numbers
  }[];
  tiers: {
    overall:  "S+" | "S" | "A" | "B" | "C" | "D";
    pvp:      "S+" | "S" | "A" | "B" | "C" | "D";
    grinding: "S+" | "S" | "A" | "B" | "C" | "D";
  };
  tierRationale: string;        // 2–3 sentences, hand-written
  pros: string[];               // 3–5 bullets
  cons: string[];               // 2–4 bullets
  bestCombos: {
    sword?: string;
    gun?: string;
    fightingStyle?: string;
    notes?: string;
  };
  howToObtain: string[];        // ["Blox Fruit Dealer", "Random sea spawn"]
  lastUpdated: string;          // ISO date "2026-06-15"
  imageHint?: string;           // filename only, image pipeline is Phase 1.5
};
```

### Three field-level decisions (locked 2026-05-19)

- **No `boss` tier** — too much overlap with `grinding`, raises maintenance
  cost without adding distinct SEO surface.
- **No `damage` numbers on moves** — they break every balance patch, and
  the upstream wikis (Fandom) cover this better anyway. Cooldown + prose
  is what users actually compare.
- **No split awakened entries** — one slug per fruit. Awakening lives in
  the `awakening` object on the same entry. `tiers` defaults to the
  awakened form when an awakening exists; rationale prose calls out the
  pre-awakening case.

---

## Tier semantics

Six grades: `S+ / S / A / B / C / D`.

- `S+` — current-meta dominators. Reserved for ≤3 fruits per dimension.
- `S`  — top-shelf, near-meta.
- `A`  — strong, situationally meta.
- `B`  — solid mid-tier.
- `C`  — outclassed but functional.
- `D`  — avoid except for collection / showcase.

Three dimensions per fruit: `overall`, `pvp`, `grinding`.
Same scale across all three. The `/tier-list` page renders `overall` by
default; the `pvp` / `grinding` toggle ships in Phase 2 if SEO data shows
demand.

---

## Top-10 seed entries (priorities, not full JSON yet)

Order = build order in Batch A. Full JSON written when the route work
starts in June. **Verify every field against current upstream wikis at
write time — tier calls below are paper estimates from 5/19 memory, not
verified data.**

| # | slug    | type      | rarity    | overall | pvp | grinding | Hook (one-liner) |
|---|---------|-----------|-----------|---------|-----|----------|------------------|
| 1 | dragon  | Beast     | Mythical  | S+      | S+  | S+       | Current meta-defining; awakened control + air-pressure. |
| 2 | leopard | Beast     | Mythical  | S+      | S+  | S        | Classic PvP king; fastest combo-extender in the game. |
| 3 | dough   | Natural   | Mythical  | S       | S+  | A        | Awakened AOE; PvP top-tier, grinding decent. |
| 4 | buddha  | Beast     | Legendary | S       | A   | S+       | The grinding workhorse; cheapest path to clean farming. |
| 5 | spirit  | Natural   | Mythical  | A       | S   | D        | Summon-based; great PvP, near-useless for farming. |
| 6 | venom   | Natural   | Mythical  | A       | A   | B        | Poison DoT; consistent but ceiling-capped. |
| 7 | shadow  | Natural   | Mythical  | A       | A   | A        | Generalist; no extremes either way. |
| 8 | rumble  | Elemental | Legendary | A       | A   | B        | Lightning coverage; reliable second pick. |
| 9 | light   | Elemental | Rare      | B       | B   | S        | Budget grinding pick; cheap and fast clears. |
| 10| phoenix | Elemental | Mythical  | B       | B   | A        | Self-heal; forgiving for new players. |

### Why these 10

- 1–4 cover head-search terms ("best blox fruit", "strongest fruit 2026").
- 5–7 cover "is X worth it" long-tail.
- 8–10 cover "cheap / beginner / budget" long-tail.
- Tier spread is wide enough to stress-test the schema (S+ down to D appear).

Remaining ~40 fruits land in Batch C (mid-late July) per the project plan.

---

## Other JSON files (sketched, finalized later)

- `races.json` — 5 entries (Human, Mink, Fishman, Sky, Ghoul) with v2/v3/v4 forms.
- `fighting-styles.json` — ~6 styles (Combat, Black Leg, Electric, Fishman Karate, Dragon Claw, Dark Step + later additions).
- `swords.json` — 30+ entries; Batch C scope.
- `sea-events.json` — seasonal (Easter, Halloween, Christmas, Update events); Batch D.

Schemas for these will be drafted before each batch starts; no commitment
to lock them today.

---

## Maintenance contract

- **`/blox-fruits/tier-list` is weekly**. 5-minute touch: bump `lastUpdated`
  on touched fruits, optionally adjust 1–2 tier values, optionally add a
  one-line note. This is the cost of "wiki-style" SEO and was explicitly
  agreed to 2026-05-19.
- Fruit detail pages (`/blox-fruits/fruits/[slug]`) are **patch-driven**,
  not scheduled: only update when a Blox Fruits balance patch lands.

---

## Out of scope for Phase 1

- Trading values. Fluctuate weekly; Fandom + value-list sites do it better;
  not worth the maintenance.
- Boss / raid guides. Could become Phase 2 if Phase 1 SEO traffic warrants.
- Fruit images. Phase 1.5 task — image pipeline + alt-text strategy.
- User-submitted content / comments. Out of project scope entirely.
