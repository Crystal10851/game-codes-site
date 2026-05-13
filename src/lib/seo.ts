import type { Metadata } from 'next';
import { siteConfig, absoluteUrl } from './site';

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  images?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  const title = input.title;
  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? 'website',
      url,
      siteName: siteConfig.name,
      title,
      description: input.description,
      locale: siteConfig.locale,
      images: input.images,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: input.description,
      site: siteConfig.twitter,
      images: input.images,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}
