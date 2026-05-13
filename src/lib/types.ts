export type CodeStatus = 'active' | 'expired';

export interface GameCode {
  code: string;
  reward: string;
  addedOn: string;
  expiresOn: string | null;
  status: CodeStatus;
  notes?: string;
}

export interface RedeemStep {
  title: string;
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Game {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  platform: string;
  developer?: string;
  officialUrl?: string;
  color?: string;
  redeemSteps: RedeemStep[];
  faq: FaqItem[];
  codes: GameCode[];
}

export interface GameSummary {
  slug: string;
  name: string;
  tagline: string;
  platform: string;
  activeCount: number;
  expiredCount: number;
  lastUpdated: string;
}
