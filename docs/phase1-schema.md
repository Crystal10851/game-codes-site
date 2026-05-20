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

## Internal link strategy

Based on 2026-05-19 audit of heartopia.gg (the closest "completed wiki"
analogue this site is aiming at). The point of this section is that
**internal link density is a bigger SEO lever than per-item detail pages**,
and the prior plan over-weighted detail pages.

### What heartopia.gg actually does

- ~24 distinct hub URLs (one per game subsystem: pets, fish, recipes,
  NPCs, home plots, events, tools, beginner guide, hobbies, etc.).
- Most hubs are **single long pages with embedded sections**, not
  paginated indexes — items live inside the hub, not as `/hub/<item>`.
- A handful of hand-picked long-tail detail pages exist (`/villagers/vanya/`,
  `/mushroom-pie-recipe`) — chosen for keyword value, not generated
  for every item.
- 35–45 internal links per page on average. Density comes from
  three places, in this order of weight:
  1. **Inline prose links** inside the hub copy ("Visit our Vanya
     guide for trading tips, check fishing spots map for locations…").
  2. **Mega-footer** with ~19 links present on every page.
  3. **Top nav** (10 primary + 8 secondary).

### Revised hub plan for Blox Fruits

Original plan (locked 2026-05-19 morning): 7 hubs + 50 fruit detail
pages. Revised same-day after heartopia audit:

- **Detail pages: cut from 50 → 10–15**. Pick the highest-search-volume
  fruits (the 10 seed entries above are the starting set). Remaining ~40
  live as section anchors inside `/blox-fruits/fruits` rather than
  individual URLs. Detail pages are chosen for keyword value, not
  written for every item.
- **Hub count: 7 → 13**. Original 7 plus:
  - `/blox-fruits/grinding-guide` — "how to grind blox fruits fast"
  - `/blox-fruits/beginner-guide` — "blox fruits guide for beginners 2026"
  - `/blox-fruits/raids` — raid mechanics + reward tables
  - `/blox-fruits/quests` — quest flow + level progression
  - `/blox-fruits/accessories` — accessory system
  - `/blox-fruits/locations` — island/map progression

13 hubs is roughly half the heartopia density. Realistic target for
Phase 1; the remaining gap closes in Phase 2 or by adding Phase 1.5
hubs based on Search Console keyword data.

### Inline prose linking convention

Every hub page must include a 200–300 word intro paragraph above the
data section. The intro **must contain 3–5 contextual links to other
hubs**, written as natural prose, not a list. Example pattern for
`/blox-fruits/tier-list`:

> "Tier rankings below reflect awakened forms. New players still
> deciding their first purchase should start with the
> [beginner guide](/blox-fruits/beginner-guide) and the
> [grinding guide](/blox-fruits/grinding-guide) — the meta picks here
> are not the same as the easiest picks to level with.
> [Race choice](/blox-fruits/races) and
> [fighting style pairing](/blox-fruits/fighting-styles) shift these
> rankings substantially in PvP."

Implementation: allow markdown link syntax in JSON `intro` and
`tierRationale` fields; render with a markdown parser at build time.
No new dependency required — `react-markdown` or a tiny inline parser.

### Footer pattern (shipped 2026-05-19)

`src/components/Footer.tsx` expanded from 9 internal links to 21,
using only existing routes (24 game-route URLs already prerender). Four
columns: All Games, Latest Codes, Redeem Guides, Site. **Zero new pages
introduced** — no AdSense risk from footer.

When Phase 1 hubs ship in 2026-06+, add a fifth column ("Blox Fruits
Guides") linking to the new hubs. Do **not** pre-add those links before
the hubs exist — 404s in the footer signal "site under construction" to
AdSense reviewers.

### Top nav

Currently `/<game>` switcher only. After Phase 1 ships, add a Blox
Fruits dropdown listing the 13 hubs. Out of scope for the 2026-05-27
AdSense apply window — leave nav alone until after approval.

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

---

## Interactive tool: Fruit Decision Helper (`/blox-fruits/which-fruit`)

Status: **design locked 2026-05-20**, build deferred to post-AdSense (~2026-06+).
Tier-2 retention bet derived from the competitor audit (Heartopia.gg ships
7 interactive tools; we shipped 0 — this is the first answer).

### Purpose

A 3-question quiz that recommends a Blox Fruit from our top-10 tier-list
seed. Output anchor-links into `/blox-fruits/tier-list#<slug>` so the tool
drives session depth into the wiki content, not away from it.

### URL

`/blox-fruits/which-fruit` — chosen for direct SEO intent match with
"which blox fruit should I buy" head-term. Alternatives `/fruit-quiz`
and `/fruit-finder` rejected: lower search-volume match.

### 3 questions

1. **Budget** (4 options) — `beli` (in-game only) / `low-robux` ($5–10) /
   `high-robux` ($20+) / `trading` (going for Mythicals via trade)
2. **Playstyle** (4 options) — `pvp` / `grinding` / `all-around` /
   `bossing`
3. **Experience level** (3 options) — `new` (<500h) / `intermediate`
   (500–2000h) / `veteran` (2000h+)

48 input combinations total. Recommendation logic is deterministic.

### Result shape

- **Top match**: 1 fruit, with one-paragraph rationale and a link to
  `/blox-fruits/tier-list#<slug>`
- **Also consider**: 2 alternative fruits (next-best by the same ranking),
  each one-liner why
- **Skip these for your profile**: 1–2 anti-recommendations with one-line
  reason (drives the message that the tool is editorial, not random)
- CTAs: `Retake quiz` and `Share` button

### Data extension required

Add to each fruit entry in `data/games/blox-fruits/tier-list.json`:

```json
"quizSignals": {
  "budget": "high-robux",        // "beli" | "low-robux" | "high-robux" | "trading"
  "beginnerFriendly": false
}
```

That's the entire schema delta — no new files, no new tables. The
existing `tiers.{overall,pvp,grinding}` carry the playstyle-fit signal.

### Recommendation algorithm (deterministic)

```
candidates = fruits.filter(f => f.quizSignals.budget matches Q1)
                   .filter(f => Q3 !== "new" || f.quizSignals.beginnerFriendly)
                   .filter(f => Q3 !== "veteran" || rank(f.tiers.overall) >= rank("A"))

rankBy = {
  pvp:        f => rank(f.tiers.pvp),
  grinding:   f => rank(f.tiers.grinding),
  bossing:    f => rank(f.tiers.grinding),   // boss = grinding-adjacent in BF
  "all-around": f => rank(f.tiers.overall),
}[Q2]

sorted = candidates.sort(rankBy desc)
top = sorted[0]
alsoConsider = sorted.slice(1, 3)
skipThese = sorted.reverse().slice(0, 2)   // worst matches by same dim
```

Where `rank("S+") = 6, S = 5, A = 4, B = 3, C = 2, D = 1`.

If `candidates.length === 0` (over-restrictive combo): fall back to ignoring
the budget filter and adding a warning to the result that the user's
desired playstyle requires a bigger budget than they selected.

### Implementation

- `src/app/blox-fruits/which-fruit/page.tsx` — server-component shell
  with metadata, JSON-LD (`WebApplication` schema), and the quiz mounted
  as a client component.
- `src/components/FruitQuiz.tsx` — `"use client"`. Uses `useState` for
  quiz state (current question + answers). Pure logic; no fetching.
- Data import from `data/games/blox-fruits/tier-list.json` (same path
  the tier-list page uses).
- Build budget: **4–6 hours** total. No new dependencies.

### SEO

- Title: `Which Blox Fruit Should I Buy? Take the 30-Second Quiz (2026)`
- Description targets: "which blox fruit should I buy", "best blox fruit
  for me", "blox fruit recommendation", "blox fruit picker"
- JSON-LD: `WebApplication` + `BreadcrumbList`
- The tool is itself a content surface — its prose answers
  (rationales, "skip these" reasons) are scannable copy that helps
  long-tail rankings beyond just the head-term

### Entry points (CTAs)

1. `/blox-fruits` overview page — "Not sure which fruit to buy? Take the
   30-second quiz →" button placed below the latest-codes section
2. `/blox-fruits/tier-list` — "Can't decide? Let us pick for you →" CTA
   below the intro paragraph
3. Footer 5th column (`Blox Fruits Guides`) — once Phase 1 hubs ship and
   that column is added; do NOT pre-add before then per the existing
   "no 404 footer links" rule

### Why this beats the other interactive-tool candidates

- **Awakening Cost Calculator** — narrower use case (once per fruit
  awakening), needs new data (fragment costs, raid drop rates) we don't
  have, more maintenance burden against game patches.
- **Value Calculator** — explicitly out-of-scope per the "Out of scope
  for Phase 1" section above (trading values fluctuate weekly).
- **Race Pick Helper** — once-per-account use case; no recurring value.
