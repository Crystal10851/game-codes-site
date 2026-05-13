import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from '@/lib/site';

/**
 * Renders the configured analytics provider, or nothing.
 *
 * Set NEXT_PUBLIC_ANALYTICS to:
 *   - "vercel"     → Vercel Web Analytics + Speed Insights (only works on Vercel)
 *   - "plausible"  → Plausible script tag (works anywhere). Requires
 *                    NEXT_PUBLIC_PLAUSIBLE_DOMAIN; optional NEXT_PUBLIC_PLAUSIBLE_HOST
 *                    if self-hosting Plausible.
 *   - unset / "none" → no analytics
 *
 * Both providers are cookieless and don't require a consent banner under
 * GDPR/UK guidance, so the privacy policy already covers them.
 */
export function Analytics() {
  const { provider, plausibleDomain, plausibleHost } = siteConfig.analytics;

  if (provider === 'vercel') {
    return (
      <>
        <VercelAnalytics />
        <SpeedInsights />
      </>
    );
  }

  if (provider === 'plausible') {
    if (!plausibleDomain) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[Analytics] NEXT_PUBLIC_ANALYTICS=plausible but NEXT_PUBLIC_PLAUSIBLE_DOMAIN is empty — skipping script.',
        );
      }
      return null;
    }
    const host = plausibleHost.replace(/\/$/, '');
    return (
      <Script
        id="plausible"
        src={`${host}/js/script.js`}
        data-domain={plausibleDomain}
        strategy="afterInteractive"
        defer
      />
    );
  }

  return null;
}
