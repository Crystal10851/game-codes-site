import { type ReactNode } from 'react';

type IconName =
  | 'list'
  | 'info'
  | 'reward'
  | 'video'
  | 'calendar'
  | 'wrench'
  | 'compass'
  | 'help'
  | 'archive'
  | 'link'
  | 'steps'
  | 'sparkles';

const ICONS: Record<IconName, ReactNode> = {
  list: (
    <path d="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" />
  ),
  info: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01" />,
  reward: <path d="M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" />,
  video: <path d="M23 7l-7 5 7 5V7z M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" />,
  calendar: <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18" />,
  wrench: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
  compass: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />,
  help: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01" />,
  archive: <path d="M21 8v13H3V8 M1 3h22v5H1z M10 12h4" />,
  link: <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />,
  steps: <path d="M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />,
  sparkles: <path d="M12 3l1.9 5.7L19 10l-5.1 1.3L12 17l-1.9-5.7L5 10l5.1-1.3L12 3z M19 17l.95 2.85L22 21l-2.05.95L19 25l-.95-2.85L16 21l2.05-.95L19 17z M5 17l.95 2.85L8 21l-2.05.95L5 25l-.95-2.85L2 21l2.05-.95L5 17z" />,
};

interface Props {
  id?: string;
  icon: IconName;
  children: ReactNode;
  subtitle?: string;
}

export function SectionHeading({ id, icon, children, subtitle }: Props) {
  return (
    <div className="scroll-mt-20" id={id ? `${id}-wrapper` : undefined}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            {ICONS[icon]}
          </svg>
        </span>
        <h2 id={id} className="text-2xl font-bold text-slate-900">
          {children}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 pl-12 text-sm text-slate-600">{subtitle}</p>
      )}
    </div>
  );
}
