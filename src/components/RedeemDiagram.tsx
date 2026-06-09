interface RedeemDiagramProps {
  name: string;
  stepNumber: number;
  label: string;
  accentColor?: string;
}

type IconPath = { paths: string[]; viewBox?: string };

const ICONS: Record<string, IconPath> = {
  launch: { paths: ['M5 3l14 9-14 9V3z'] },
  menu: { paths: ['M3 6h18 M3 12h18 M3 18h18'] },
  twitter: { paths: ['M22 4.01s-2.02 1.18-3.14 1.52a4.48 4.48 0 00-7.65 4.07A12.7 12.7 0 013 4.79s-4 8.95 5 13c-1.85 1.21-3.7 1.69-6 1.4 6.66 3.62 14.86.08 14.86-9.42 0-.23-.02-.46-.06-.69A8.83 8.83 0 0022 4.01z'] },
  settings: { paths: ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'] },
  paste: { paths: ['M9 2h6a2 2 0 012 2v1h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2V4a2 2 0 012-2z'] },
  redeem: { paths: ['M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z'] },
  success: { paths: ['M20 6L9 17l-5-5'] },
  mail: { paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'] },
  portal: { paths: ['M12 2a10 10 0 100 20 10 10 0 000-20z', 'M2 12h20 M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z'] },
  account: { paths: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'] },
  profile: { paths: ['M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z', 'M12 12a3 3 0 100-6 3 3 0 000 6z', 'M6.17 18.85a4 4 0 013.74-2.85h4.18a4 4 0 013.74 2.85'] },
  server: { paths: ['M2 4h20v6H2z', 'M2 14h20v6H2z', 'M6 8h.01 M6 18h.01'] },
  copy: { paths: ['M9 9h10a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V11a2 2 0 012-2z', 'M5 15H4a2 2 0 01-2-2V3a2 2 0 012-2h10a2 2 0 012 2v1'] },
};

function getIcon(name: string): IconPath {
  return ICONS[name] ?? ICONS.success;
}

export function RedeemDiagram({
  name,
  stepNumber,
  label,
  accentColor = '#1b3aa5',
}: RedeemDiagramProps) {
  const icon = getIcon(name);

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow ring-1 ring-slate-200">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
            aria-hidden
          />
          Step {stepNumber}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute h-40 w-40 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: accentColor }}
            aria-hidden
          />
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-lg ring-1 ring-black/5"
            style={{ backgroundColor: accentColor }}
          >
            <svg
              viewBox={icon.viewBox ?? '0 0 24 24'}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
              aria-hidden
            >
              {icon.paths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1.5"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <figcaption className="border-t border-slate-200 bg-white px-4 py-2.5 text-xs">
        <span className="font-bold text-slate-900">Step {stepNumber}:</span>{' '}
        <span className="text-slate-700">{label}</span>
      </figcaption>
    </figure>
  );
}
