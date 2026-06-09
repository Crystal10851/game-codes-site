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
  screenshot?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TroubleshootItem {
  symptom: string;
  cause: string;
  fix: string;
}

export interface OfficialChannel {
  label: string;
  url: string;
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
  lastVerifiedOn?: string;
  heroImage?: string;
  videoId?: string;
  videoTitle?: string;
  longDescription?: string;
  whatCodesDo?: string;
  whereToFindMore?: string;
  releaseCadence?: string;
  troubleshooting?: TroubleshootItem[];
  expiredCodesContext?: string;
  officialChannels?: OfficialChannel[];
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
