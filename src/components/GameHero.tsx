import Link from 'next/link';
import type { Game } from '@/lib/types';
import { formatDate } from '@/lib/codes';

interface Props {
  game: Game;
  activeCount: number;
  lastUpdated: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  eyebrow?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darken(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.max(0, Math.floor(parseInt(clean.slice(0, 2), 16) * factor));
  const g = Math.max(0, Math.floor(parseInt(clean.slice(2, 4), 16) * factor));
  const b = Math.max(0, Math.floor(parseInt(clean.slice(4, 6), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

export function GameHero({
  game,
  activeCount,
  lastUpdated,
  primaryCta,
  secondaryCta,
  eyebrow,
}: Props) {
  const baseColor = game.color ?? '#1b3aa5';
  const background = `linear-gradient(135deg, ${baseColor} 0%, ${darken(baseColor, 0.78)} 60%, ${darken(baseColor, 0.55)} 100%)`;
  const accentGlow = hexToRgba(baseColor, 0.5);

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-7 text-white shadow-lg sm:p-10"
      style={{ background }}
    >
      <span
        aria-hidden
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: accentGlow }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 14px)',
        }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/85">
          <span className="rounded-full bg-white/15 px-3 py-1 ring-1 ring-white/20 backdrop-blur-sm">
            {game.platform}
          </span>
          {game.developer && (
            <span className="hidden text-white/70 sm:inline">·</span>
          )}
          {game.developer && (
            <span className="hidden sm:inline">{game.developer}</span>
          )}
          {eyebrow && (
            <>
              <span className="text-white/70">·</span>
              <span>{eyebrow}</span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
          {game.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-white/90 sm:text-lg">
          {game.tagline}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 font-bold text-emerald-100 ring-1 ring-emerald-300/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden />
            {activeCount} active {activeCount === 1 ? 'code' : 'codes'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white/90 ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Editorially verified
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white/90 ring-1 ring-white/20">
            Updated {formatDate(lastUpdated)}
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md transition hover:bg-slate-100"
          >
            {primaryCta.label}
            <span aria-hidden>→</span>
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {secondaryCta.label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
