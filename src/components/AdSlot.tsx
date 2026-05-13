'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site';

interface AdSlotProps {
  slot: string;
  format?: string;
  layout?: 'in-article' | 'display';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

export function AdSlot({
  slot,
  format = 'auto',
  layout = 'display',
  className = '',
}: AdSlotProps) {
  const ref = useRef<HTMLModElement | null>(null);
  const enabled = siteConfig.adsense.enabled;

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // adsbygoogle not ready — script likely blocked. Fail silently.
    }
  }, [enabled]);

  if (!enabled) {
    return (
      <div
        className={`flex h-24 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 ${className}`}
        aria-hidden
      >
        Ad placeholder ({slot})
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={siteConfig.adsense.clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout === 'in-article' ? 'in-article' : undefined}
      data-full-width-responsive="true"
    />
  );
}
