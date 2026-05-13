import type { Game } from './types';

export interface AffiliateOffer {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  badge?: string;
  /**
   * Game platforms this offer is suitable for. Use 'all' to match every game.
   */
  matches: 'all' | string[];
  /**
   * Marks the offer as a real, configured affiliate URL. Placeholders should
   * leave this false so the UI renders a "configure me" hint to the operator.
   */
  enabled?: boolean;
}

/**
 * Affiliate offers shown on game pages. Replace `href` with your real
 * affiliate URLs and set `enabled: true` to activate each offer.
 *
 * FTC disclosure: any offer rendered with `enabled: true` will surface a
 * "we may earn a commission" line via the AffiliateBar component.
 */
export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: 'roblox-gift-card-eneba',
    title: 'Top up Roblox the cheap way',
    description:
      'Pick up Robux gift cards at a discount on Eneba — usually 5–15% off store price, instant digital delivery.',
    cta: 'Shop Robux gift cards',
    href: 'https://www.eneba.com/store/roblox-gift-card?af=REPLACE_ME',
    badge: 'Best for Roblox',
    matches: ['Roblox'],
    enabled: false,
  },
  {
    id: 'hoyoverse-topup-codashop',
    title: 'Top up Genesis Crystals & Oneiric Shards',
    description:
      'Codashop top-ups for Genshin Impact and Honkai: Star Rail — official, instant, often with bonus rewards on first purchase.',
    cta: 'Top up on Codashop',
    href: 'https://www.codashop.com/?ref=REPLACE_ME',
    badge: 'Best for HoYoverse',
    matches: ['PC, Mobile, PS4/5', 'PC, Mobile, PS5'],
    enabled: false,
  },
  {
    id: 'nordvpn',
    title: 'Unlock region-locked codes',
    description:
      'Some redemption codes are restricted to specific regions. A reliable VPN like NordVPN lets you switch servers and still grab them.',
    cta: 'Get NordVPN',
    href: 'https://go.nordvpn.net/aff_c?offer_id=REPLACE_ME',
    badge: 'Region-locked codes',
    matches: 'all',
    enabled: false,
  },
  {
    id: 'razer-controller',
    title: 'Play comfier, redeem faster',
    description:
      "Razer Kishi V2 turns your phone into a console controller — handy for mobile-heavy titles like Genshin and Honkai: Star Rail.",
    cta: 'See on Razer',
    href: 'https://www.razer.com/mobile-controllers?aff=REPLACE_ME',
    matches: ['PC, Mobile, PS4/5', 'PC, Mobile, PS5'],
    enabled: false,
  },
];

function matchesPlatform(offer: AffiliateOffer, platform: string): boolean {
  if (offer.matches === 'all') return true;
  return offer.matches.some(
    (m) => platform.toLowerCase().includes(m.toLowerCase()),
  );
}

export function getOffersForGame(game: Game, limit = 3): AffiliateOffer[] {
  const matched = AFFILIATE_OFFERS.filter((o) =>
    matchesPlatform(o, game.platform),
  );
  // Always include any 'all' offers if not already present.
  const all = AFFILIATE_OFFERS.filter((o) => o.matches === 'all');
  const merged = [...new Set([...matched, ...all])];
  return merged.slice(0, limit);
}

export function hasEnabledOffers(offers: AffiliateOffer[]): boolean {
  return offers.some((o) => o.enabled);
}
