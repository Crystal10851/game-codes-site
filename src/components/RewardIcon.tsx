import type { RewardType } from '@/lib/rewardType';

const PATHS: Record<RewardType, string> = {
  xp: 'M13 2L3 14h7v8l10-12h-7z',
  statReset: 'M3 4v6h6 M21 20v-6h-6 M3.51 9a9 9 0 0114.85-3.36L21 8 M20.49 15a9 9 0 01-14.85 3.36L3 16',
  reroll: 'M3 12l4-4m-4 4l4 4m-4-4h13m5 4l-4-4m4 4l-4 4m4-4H8',
  currency: 'M12 2v20 M8 8h6a3 3 0 010 6h-4a3 3 0 000 6h6',
  material: 'M3 7l9-5 9 5-9 5-9-5z M3 12l9 5 9-5 M3 17l9 5 9-5',
  pet: 'M12 2l1.5 4.5L18 8l-3.5 3.5L15 16l-3-2-3 2 .5-4.5L6 8l4.5-1.5z',
  title: 'M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01',
  bundle: 'M21 11.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-7.5 M3 7h18v4H3z M12 7v14 M8 7l2-3 2 3 2-3 2 3',
  other: 'M9 12h6 M12 9v6 M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

interface Props {
  type: RewardType;
  className?: string;
}

export function RewardIcon({ type, className = 'h-4 w-4' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[type]} />
    </svg>
  );
}
