export interface StateDossier {
  id: string;
  name: string;
  shortSummary: string;
  scandals: { title: string; desc: string; severity: 'CRITICAL' | 'SEVERE' | 'WARNING' }[];
  articles: { title: string; outlet: string; summary: string; url: string }[];
  videos: { title: string; creator: string; summary: string; youtubeUrl: string }[];
  metrics: { label: string; value: string; detail: string }[];
}

export interface Sector {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string; // name of lucide-react icon
  keyCriticisms: string[];
  stats: { label: string; value: string; trend: 'up' | 'down' | 'neutral'; description: string }[];
  preloadedQuery: string;
}

export interface SavedReport {
  id: string;
  query: string;
  sector?: string;
  report: string;
  sources: { title: string; url: string }[];
  model: string;
  timestamp: string;
  useHighThinking: boolean;
}

export interface IndexHistoryPoint {
  year: number;
  pressFreedomRank: number; // 1-180 (lower is better, so 140 -> 161 is deterioration)
  unemploymentRate: number; // CMIE estimated annual average (%)
  wealthShareTopOne: number; // % of national wealth held by top 1% (Oxfam / World Inequality Database)
  vdemScore: number; // Liberal Democracy Index (0 to 1, higher is better)
}
