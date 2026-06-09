'use client';

import { useState } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailSrc?: string;
  thumbnailQuality?: 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';
}

export function YouTubeEmbed({
  videoId,
  title,
  thumbnailSrc,
  thumbnailQuality = 'hqdefault',
}: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = thumbnailSrc ?? `https://i.ytimg.com/vi/${videoId}/${thumbnailQuality}.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-200">
      {loaded ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" aria-hidden />
          <span
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 group-hover:bg-red-500"
            aria-hidden
          >
            <span className="ml-1 border-y-[12px] border-l-[18px] border-y-transparent border-l-white" />
          </span>
          <span className="sr-only">Play</span>
          <noscript>
            <a
              href={watchUrl}
              className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-white"
            >
              Watch on YouTube
            </a>
          </noscript>
        </button>
      )}
    </div>
  );
}
