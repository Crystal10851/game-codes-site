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
        <>
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
            <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/45" aria-hidden />
            <span
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 group-hover:bg-red-500"
              aria-hidden
            >
              <span className="ml-1 border-y-[12px] border-l-[18px] border-y-transparent border-l-white" />
            </span>
            <span className="sr-only">Play</span>
          </button>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-900 shadow-md ring-1 ring-black/10 transition hover:bg-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-red-600" aria-hidden>
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c.34 0 .677-.017 1.01-.05" />
              <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
            </svg>
            Open on YouTube
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-slate-500" aria-hidden>
              <path d="M7 17L17 7 M7 7h10v10" />
            </svg>
          </a>
        </>
      )}
    </div>
  );
}
