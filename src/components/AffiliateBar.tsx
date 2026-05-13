import type { Game } from '@/lib/types';
import { AffiliateCard } from './AffiliateCard';
import { getOffersForGame, hasEnabledOffers } from '@/lib/affiliates';

interface Props {
  game: Game;
  limit?: number;
  heading?: string;
}

export function AffiliateBar({
  game,
  limit = 3,
  heading = 'Recommended for this game',
}: Props) {
  const offers = getOffersForGame(game, limit);
  if (offers.length === 0) return null;

  const showDisclosure = hasEnabledOffers(offers);

  return (
    <section aria-labelledby="affiliate-heading" className="mt-4">
      <div className="flex items-baseline justify-between">
        <h2
          id="affiliate-heading"
          className="text-lg font-semibold text-slate-900"
        >
          {heading}
        </h2>
        {showDisclosure && (
          <p className="text-[11px] text-slate-500">
            Affiliate disclosure: we may earn a commission on qualifying
            purchases.
          </p>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <AffiliateCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
