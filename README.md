# Game Codes Hub

Next.js App Router site for publishing game redeem codes with SEO best practices, auto-generated sitemap/metadata, AdSense slots, affiliate placements and a JSON-driven data layer.

## Stack
- Next.js 15 (App Router, RSC, static export-friendly)
- React 19
- TypeScript
- Tailwind CSS

## Quick start

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Adding a new game

1. Create `data/games/<slug>.json` matching the shape in `src/lib/types.ts`:
   - `slug`, `name`, `tagline`, `description`, `platform`
   - `redeemSteps[]`, `faq[]`
   - `codes[]` with `code`, `reward`, `addedOn` (YYYY-MM-DD), `expiresOn`, `status` (`active` | `expired`)
2. Save the file. The next build (or `next dev`) automatically:
   - Renders `/(slug)`, `/(slug)/latest`, `/(slug)/expired`, `/(slug)/redeem-guide`
   - Adds the game to the home grid, the nav, and the footer
   - Adds all four routes to `sitemap.xml`
   - Generates Article / HowTo / FAQ / BreadcrumbList JSON-LD

No code change needed. Seed data ships for Blox Fruits, Genshin Impact, Honkai: Star Rail, King Legacy, Anime Adventures, Pet Simulator 99.

## SEO features

| Concern | Implementation |
|---|---|
| Titles & descriptions | `generateMetadata` on every route via `src/lib/seo.ts` |
| Canonical URLs | `alternates.canonical` on every page |
| Open Graph & Twitter cards | Built into `buildMetadata` helper |
| Sitemap | `src/app/sitemap.ts` — auto-discovers games |
| robots.txt | `src/app/robots.ts` |
| Structured data | `WebSite`, `Article`, `ItemList`, `HowTo`, `FAQPage`, `BreadcrumbList`, `AboutPage`, `ContactPage` |
| Static rendering | `generateStaticParams` on dynamic routes → fully static, fast TTFB |
| Security headers | `next.config.mjs` `headers()` |
| Image perf | AVIF / WebP via `next/image` defaults |

## Legal & trust pages

For AdSense approval and basic operating hygiene:

- `/about` — purpose, sourcing, editorial standards, disclosures
- `/privacy` — GDPR/CCPA/COPPA-aware policy mentioning AdSense and third-party cookies
- `/contact` — email CTA + reasons-to-contact

Override the publisher name and contact email per environment via:

```
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_LEGAL_NAME="Your Name"
```

## Google AdSense

1. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` and `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-<your-id>` in `.env.local`.
2. Update the `slot` IDs in each `<AdSlot slot="..." />` to match your AdSense unit IDs.

When disabled, `<AdSlot/>` renders a labeled placeholder box so layout matches production.

## Affiliate links

The affiliate system is configured in `src/lib/affiliates.ts`:

- Each offer has `id`, `title`, `description`, `cta`, `href`, `badge`, `matches` (platform filter), `enabled`.
- Offers are surfaced via `<AffiliateBar game={game} />` on each game's overview and redeem-guide pages.
- `matches: 'all'` shows on every game; `matches: ['Roblox']` only on Roblox titles, etc.
- `enabled: false` (the default) renders a "configure me" placeholder so the layout looks the same but no real outbound link is published.
- Outbound links use `rel="sponsored nofollow noopener noreferrer"` and `target="_blank"`.
- When at least one rendered offer is `enabled: true`, the bar prints an FTC affiliate-disclosure line.

To activate:
1. Edit `src/lib/affiliates.ts`, replace `REPLACE_ME` in each `href` with your real affiliate code.
2. Flip `enabled: true` per offer.

## Analytics

The site supports two cookieless analytics providers, toggled by env:

| Provider | When to use | Setup |
|---|---|---|
| **Vercel Analytics** (default if deployed on Vercel) | Free, zero-config on Vercel. Includes Web Analytics + Speed Insights. | `NEXT_PUBLIC_ANALYTICS=vercel`, then enable Analytics in your Vercel project dashboard. |
| **Plausible** | Self-hostable or paid cloud. Works on any host. | `NEXT_PUBLIC_ANALYTICS=plausible` + `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com`. Set `NEXT_PUBLIC_PLAUSIBLE_HOST` only when self-hosting. |
| _none_ (default) | Local dev / staging | leave `NEXT_PUBLIC_ANALYTICS=none` |

Both are cookieless and don't require a GDPR consent banner. The Privacy Policy already covers both.

## Auto-scrape codes from X (GitHub Actions)

`.github/workflows/scrape-codes.yml` polls a configurable list of X (Twitter) handles every 6 hours, runs a regex + trigger-word heuristic over the latest 10 tweets per handle, and opens a **draft PR** with candidate codes appended to the relevant `data/games/<slug>.json` files.

### Setup

1. Get an X API bearer token at https://developer.x.com (Free or Basic tier).
2. Add it as a repo secret: `X_BEARER_TOKEN`.
3. Edit `data/sources/index.json` to set the handles you want to monitor per game.
4. Push to `main`. The workflow then runs on cron; manual runs are also supported via the **Run workflow** button.

Local debug:

```bash
X_BEARER_TOKEN=... npm run scrape:codes
```

### Reality check on X API tiers

| Tier | Cost | Read cap | Verdict |
|---|---|---|---|
| Free | $0 | 100 reads / month | Useless for monitoring more than 1 account |
| Basic | $200 / month | 10,000 reads / month | Comfortable for 5–10 game accounts on 6h cron |
| Pro | $5,000 / month | 1M reads / month | Overkill |

Each cron run = 1 read per monitored handle (after the first run, when user IDs are cached). With 5 handles × 4 runs/day × 30 days ≈ 600 reads/month — Basic tier minimum.

If a Basic subscription is not on the table, run the workflow manually (`workflow_dispatch`) only when a new update drops, or trim the source list.

The script always exits 0 when the token is unset, so the workflow won't fail on PRs from forks.

## Sitemap ping (GitHub Actions)

`.github/workflows/sitemap-ping.yml` pings IndexNow (Bing, Yandex, Seznam, Naver) whenever:
- a file under `data/games/*.json` changes on `main`, or
- `src/app/sitemap.ts` changes, or
- you trigger it manually with a game slug.

The workflow computes the affected URLs from the diff (e.g. editing `data/games/blox-fruits.json` pings `/blox-fruits`, `/blox-fruits/latest`, `/blox-fruits/expired`, `/blox-fruits/redeem-guide`, `/`, `/sitemap.xml`).

Setup (one time):

1. Generate an IndexNow key:
   ```bash
   openssl rand -hex 16
   ```
2. Add a static key file at `public/<your-key>.txt` whose contents are the key. Commit it.
3. Add two repo secrets in GitHub → Settings → Secrets and variables → Actions:
   - `SITE_URL` — e.g. `https://yourdomain.com`
   - `INDEXNOW_KEY` — the key from step 1

Google's classic `/ping?sitemap=` endpoint was deprecated in June 2023; the workflow logs a reminder to re-submit via Google Search Console.

## Project layout

```
data/games/        JSON data, one file per game
src/app/           App Router routes + sitemap.ts + robots.ts
                   plus /about, /privacy, /contact
src/components/    Modular UI (Nav, Footer, CodeCard, AdSlot, AffiliateBar, JsonLd, …)
src/lib/           games / codes / seo / site / affiliates helpers + types
.github/workflows/ sitemap-ping.yml
```

## Customizing the site

- Brand colors: `tailwind.config.ts` (`brand` palette)
- Site name / description / domain: `src/lib/site.ts` (or env vars)
- Layout chrome: `src/components/Nav.tsx`, `src/components/Footer.tsx`

## Production build

```bash
npm run build
npm run start
```

The app is fully static — every route under `/`, `/[game]`, `/about`, `/privacy`, `/contact` plus `sitemap.xml` and `robots.txt` is prerendered. First Load JS sits around 102 kB shared, putting Core Web Vitals comfortably in the green out of the box.

## Deploy to Vercel

1. **Push the repo to GitHub**:
   ```bash
   git init && git add -A && git commit -m "init: game codes site"
   gh repo create game-codes-site --public --source=. --push
   ```
2. **Import to Vercel**: https://vercel.com/new → pick the repo → framework is auto-detected as Next.js → Deploy.
3. **Set env vars** in Vercel → Project → Settings → Environment Variables (all `NEXT_PUBLIC_*` must be set for **Production**, **Preview** and **Development**):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | your real contact email |
   | `NEXT_PUBLIC_LEGAL_NAME` | the name to show as publisher |
   | `NEXT_PUBLIC_ADSENSE_ENABLED` | `false` until AdSense approves you |
   | `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` (placeholder until approved) |
   | `NEXT_PUBLIC_ANALYTICS` | `vercel` (free, zero-config on Vercel) |
4. **Connect a custom domain**: Vercel → Project → Settings → Domains → add `yourdomain.com`. Add the CNAME / A records your registrar suggests. SSL is automatic.
5. **Re-deploy** so the new env vars take effect.

That's it for hosting — every `git push` to `main` ships a new production build.

## Apply for Google AdSense

AdSense reviews sites against the [program policies](https://support.google.com/adsense/answer/48182). The checklist below covers everything Google has historically rejected new applicants for. **Before applying, make sure all of these are true.**

- [ ] Site is live on a real domain (not vercel.app subdomain).
- [ ] You're the registered domain owner. Domain age: 1+ month is helpful, not required.
- [ ] **About**, **Privacy Policy**, **Contact** pages are accessible from the footer (this repo ships them at `/about`, `/privacy`, `/contact`).
- [ ] Privacy Policy explicitly mentions AdSense and third-party cookies (this repo's does).
- [ ] At least 15–20 indexed pages of original, useful content. This repo's 6 seed games × 4 pages = 24 routes — meets the bar, but make sure each game's `description` and FAQ text has been edited / expanded so it isn't visibly templated.
- [ ] No broken links, no Lorem ipsum, no placeholder copy. Search for "TBD", "Replace me", "Lorem", "REPLACE_ME" before applying.
- [ ] Site has been live and crawlable for at least 2–4 weeks (some reviewers reject brand-new sites).
- [ ] Sitemap submitted via Google Search Console.

Application flow:

1. Apply at https://www.google.com/adsense/start/ — enter your domain.
2. Add the `<script>` tag Google gives you to verify ownership. With this repo, set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-<your-id>` and `NEXT_PUBLIC_ADSENSE_ENABLED=true` in Vercel and re-deploy — the verification script auto-loads via `src/components/AdSenseScript.tsx`.
3. Google's review takes anywhere from a few hours to ~14 days.
4. On approval, go to AdSense → Ads → By ad unit, create display units, and copy each unit's slot ID into the `slot="..."` prop on each `<AdSlot/>` in `src/app/...`. Search the repo for `<AdSlot slot=` to see all placements.

## Final pre-deploy checklist

```bash
npm run typecheck   # must pass
npm run build       # must pass (33 static pages)
npm run lint        # warnings ok, errors not
```

Then push and go.
