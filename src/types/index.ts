export type Role = "admin" | "user";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  preferences: string[];
  onboardingCompleted: boolean;
  savedArticles: string[];
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthSetupStatus = {
  hasAdmin: boolean;
  canRegisterAdmin: boolean;
  registerRoles: Role[];
  loginRoles: Role[];
};

export type Agent = {
  _id: string;
  sourceName: string;
  topic: string;
  category: string;
  rssUrl: string;
  description: string;
  fetchIntervalMinutes: number;
  isActive: boolean;
  lastFetchedAt?: string;
  lastErrorAt?: string;
  lastErrorMessage?: string;
};

export type AdCampaign = {
  _id: string;
  title: string;
  imageUrl: string;
  targetLink: string;
  description: string;
  ctaLabel: string;
  topics: string[];
  isActive: boolean;
};

export type Article = {
  _id: string;
  title: string;
  description: string;
  contentSnippet: string;
  link: string;
  publishedAt: string;
  sourceName: string;
  topic: string;
  category: string;
  imageUrl?: string;
  author?: string;
};

export type FeedItem =
  | {
      kind: "article";
      article: Article;
    }
  | {
      kind: "ad";
      ad: AdCampaign;
      placementIndex: number;
    };

export type FeedResponse = {
  items: FeedItem[];
  page: number;
  hasMore: boolean;
  totalItems: number;
  totalPages: number;
  tabs: string[];
};

export type AnalyticsRow = {
  _id: string;
  title: string;
  topics: string[];
  isActive: boolean;
  uniqueViews: number;
  totalClicks: number;
  ctr: number;
};
