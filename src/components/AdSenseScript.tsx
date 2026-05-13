import Script from 'next/script';
import { siteConfig } from '@/lib/site';

export function AdSenseScript() {
  if (!siteConfig.adsense.enabled) return null;
  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`;
  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={src}
      crossOrigin="anonymous"
    />
  );
}
